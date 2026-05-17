import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Job, Project, Review, Resource, Applicant, User, ApplicantStatus } from '@/types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000';
const TOKEN_KEY = 'ise_token';

// ── Token helpers ─────────────────────────────────────────────────────────────

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function saveToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

// ── Base fetch ────────────────────────────────────────────────────────────────

async function req<T>(method: string, path: string, body?: object, auth = true): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' };
  if (auth) {
    const token = await getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Request failed');
  return data as T;
}

const get    = <T>(path: string, auth = true) => req<T>('GET', path, undefined, auth);
const post   = <T>(path: string, body: object, auth = true) => req<T>('POST', path, body, auth);
const patch  = <T>(path: string, body: object) => req<T>('PATCH', path, body);
const del    = <T>(path: string) => req<T>('DELETE', path);

// ── Type mapper ───────────────────────────────────────────────────────────────
// Flask returns a flat user doc; frontend User type wraps profile inside { role, profile }

function mapUser(raw: any): User {
  const { role, id, name, email, firstName, lastName, studentId,
          cohort, track, headline, skills, avatarColor,
          company, companyTag, isAlumni, alumniCohort, position } = raw;
  return {
    role,
    profile: { id, name, email, firstName, lastName, studentId,
               cohort, track, headline, skills, avatarColor,
               company, companyTag, isAlumni, alumniCohort, position },
  };
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  email: string; password: string; role: 'hunter' | 'recruiter';
  first_name: string; last_name: string; student_id: string; cohort: string;
  avatar_color?: string; track?: string; headline?: string; skills?: string[];
  company?: string; company_tag?: string; position?: string;
}

export const auth = {
  async register(payload: RegisterPayload): Promise<{ token: string; user: User }> {
    const data = await post<any>('/auth/register', payload, false);
    return { token: data.token, user: mapUser(data.user) };
  },

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const data = await post<any>('/auth/login', { email, password }, false);
    return { token: data.token, user: mapUser(data.user) };
  },

  async me(): Promise<User> {
    const data = await get<any>('/auth/me');
    return mapUser(data);
  },
};

// ── Jobs ──────────────────────────────────────────────────────────────────────

export const jobs = {
  list(type?: string): Promise<Job[]> {
    const qs = type ? `?type=${encodeURIComponent(type)}` : '';
    return get<Job[]>(`/jobs${qs}`, true);
  },

  get(id: string): Promise<Job> {
    return get<Job>(`/jobs/${id}`);
  },

  create(payload: object): Promise<Job> {
    return post<Job>('/jobs/', payload);
  },

  async toggleSave(id: string): Promise<boolean> {
    const data = await patch<{ saved: boolean }>(`/jobs/${id}/save`, {});
    return data.saved;
  },

  mine(): Promise<Job[]> {
    return get<Job[]>('/jobs/mine');
  },

  edit(id: string, payload: object): Promise<Job> {
    return patch<Job>(`/jobs/${id}`, payload);
  },

  delete(id: string): Promise<void> {
    return del(`/jobs/${id}`);
  },
};

// ── Applications ──────────────────────────────────────────────────────────────

export const applications = {
  apply(jobId: string): Promise<Applicant> {
    return post<Applicant>('/applications/', { job_id: jobId });
  },

  listForJob(jobId: string): Promise<Applicant[]> {
    return get<Applicant[]>(`/applications/job/${jobId}`);
  },

  updateStatus(applicationId: string, status: ApplicantStatus): Promise<void> {
    return patch(`/applications/${applicationId}/status`, { status });
  },

  mine(): Promise<Applicant[]> {
    return get<Applicant[]>('/applications/mine');
  },
};

// ── Projects ──────────────────────────────────────────────────────────────────

export const projects = {
  list(): Promise<Project[]> {
    return get<Project[]>('/projects/');
  },

  get(id: string): Promise<Project> {
    return get<Project>(`/projects/${id}`);
  },

  create(payload: object): Promise<Project> {
    return post<Project>('/projects/', payload);
  },

  edit(id: string, payload: object): Promise<Project> {
    return patch<Project>(`/projects/${id}`, payload);
  },

  async toggleLike(id: string): Promise<{ liked: boolean; likes: number }> {
    return patch(`/projects/${id}/like`, {});
  },

  delete(id: string): Promise<void> {
    return del(`/projects/${id}`);
  },
};

// ── Reviews ───────────────────────────────────────────────────────────────────

export const reviews = {
  list(company?: string): Promise<Review[]> {
    const qs = company ? `?company=${encodeURIComponent(company)}` : '';
    return get<Review[]>(`/reviews${qs}`);
  },

  create(payload: object): Promise<Review> {
    return post<Review>('/reviews/', payload);
  },
};

// ── Resources ─────────────────────────────────────────────────────────────────

export const resources = {
  list(kind?: string): Promise<Resource[]> {
    const qs = kind ? `?kind=${encodeURIComponent(kind)}` : '';
    return get<Resource[]>(`/resources${qs}`);
  },

  create(payload: object): Promise<Resource> {
    return post<Resource>('/resources/', payload);
  },
};
