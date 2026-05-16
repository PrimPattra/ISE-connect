import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as api from '@/services/api';
import type { Job, Project, Resource, Review, User } from '@/types';

const USER_KEY = 'ise_user';

interface AppContextValue {
  user: User | null;
  token: string | null;
  setAuthResult: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  signOut: () => void;
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  toastMsg: string;
  toast: (msg: string) => void;
  loading: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [toastMsg, setToastMsg] = useState('');
  const [loading, setLoading] = useState(true);

  // Restore session on app launch
  useEffect(() => {
    async function restoreSession() {
      try {
        const storedToken = await api.getToken();
        if (storedToken) {
          const me = await api.auth.me();
          setUser(me);
          setToken(storedToken);
        }
      } catch {
        // Token expired or invalid — clear it
        await api.clearToken();
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  // Fetch all data once user is set
  useEffect(() => {
    if (!user) return;
    async function fetchAll() {
      try {
        const [j, rv, rs, p] = await Promise.all([
          api.jobs.list(),
          api.reviews.list(),
          api.resources.list(),
          api.projects.list(),
        ]);
        setJobs(j);
        setReviews(rv);
        setResources(rs);
        setProjects(p);
      } catch {
        // Data fetch failed silently — lists stay empty
      }
    }
    fetchAll();
  }, [user]);

  function updateUser(u: User) {
    setUser(u);
    AsyncStorage.setItem(USER_KEY, JSON.stringify(u));
  }

  function setAuthResult(u: User, t: string) {
    setUser(u);
    setToken(t);
    api.saveToken(t);
    AsyncStorage.setItem(USER_KEY, JSON.stringify(u));
  }

  function signOut() {
    setUser(null);
    setToken(null);
    api.clearToken();
    AsyncStorage.removeItem(USER_KEY);
    setJobs([]);
    setReviews([]);
    setResources([]);
    setProjects([]);
  }

  function toast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2400);
  }

  return (
    <AppContext.Provider value={{
      user, token, setAuthResult, updateUser, signOut,
      jobs, setJobs,
      reviews, setReviews,
      resources, setResources,
      projects, setProjects,
      toastMsg, toast,
      loading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
