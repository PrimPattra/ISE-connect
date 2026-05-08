import React, { createContext, useContext, useState } from 'react';
import { SEED_JOBS, SEED_REVIEWS, SEED_PROJECTS } from '@/data/seed';
import type { Job, Review, Project, User } from '@/types';

interface AppContextValue {
  user: User | null;
  setUser: (u: User | null) => void;
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  toastMsg: string;
  toast: (msg: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>(SEED_JOBS);
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [toastMsg, setToastMsg] = useState('');

  function toast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2400);
  }

  return (
    <AppContext.Provider value={{ user, setUser, jobs, setJobs, reviews, setReviews, projects, setProjects, toastMsg, toast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
