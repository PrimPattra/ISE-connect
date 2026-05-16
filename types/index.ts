export type JobType = 'Full-time' | 'Internship' | 'Freelance' | 'Research';
export type ApplicantStatus = 'New' | 'Reviewing' | 'Interview' | 'Hired' | 'Pass';
export type MediaKind = 'image' | 'video' | 'pdf' | 'link';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyTag: string;
  type: JobType;
  location: string;
  comp: string;
  posted: string;
  skills: string[];
  poster: { name: string; tag: string; role: string };
  blurb: string;
  duties?: string;
  period: string;
  applicationLink: string;
  saved: boolean;
}

export interface Salary {
  amount: number;
  currency: string;
  period: string;
  role: string;
}

export interface Review {
  id: string;
  company: string;
  role: string;
  reviewText: string;
  salary: Salary | null;
  when: string;
  by: string;
}

export interface Interview {
  id: string;
  company: string;
  role: string;
  rounds: number;
  timeline: string;
  questions: string[];
  by: string;
}

export interface Resource {
  id: string;
  kind: string;
  title: string;
  author: string;
  mins: number;
  description?: string;
  url?: string;
  image?: string;
}

export interface QA {
  id: string;
  q: string;
  answers: number;
  by: string;
  tag: string;
}

export interface MediaItem {
  kind: MediaKind;
  label: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  skills: string;
  projectLink: string;
  contactInfo: string;
  collaborators: string;
}

export interface Project {
  id: string;
  title: string;
  by: { name: string; tag: string };
  collaborators: { name: string; tag: string }[];
  skills: string[];
  description: string;
  projectLink: string;
  contactInfo: string;
  media: MediaItem[];
  likes: number;
  liked?: boolean;
  views: number;
}

export interface HunterProfile {
  name: string;
  email: string;
  cohort: string;
  track: string;
  headline: string;
  skills: string[];
}

export interface RecruiterProfile {
  name: string;
  email: string;
  company: string;
  companyTag: string;
  isAlumni: boolean;
  alumniCohort: string;
  position: string;
}

export interface UserProfile {
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  studentId?: string;
  // hunter fields
  cohort?: string;
  track?: string;
  headline?: string;
  skills?: string[];
  avatarColor?: string;
  // recruiter fields
  company?: string;
  companyTag?: string;
  isAlumni?: boolean;
  alumniCohort?: string;
  position?: string;
}

export interface User {
  role: 'hunter' | 'recruiter';
  profile: UserProfile;
}

export interface Applicant {
  id: string;
  jobId: string;
  name: string;
  tag: string;
  track: string;
  headline: string;
  skills: string[];
  status: ApplicantStatus;
  applied: string;
}
