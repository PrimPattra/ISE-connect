import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { SEED_JOBS, SEED_PROJECTS, SEED_REGISTERED_USERS, SEED_REVIEWS } from '@/data/seed';
import type { Job, Project, Review, User } from '@/types';

const USER_KEY = 'ise_user';

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
  registeredEmails: string[];
  registerUser: (email: string) => void;
  isEmailRegistered: (email: string) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>(SEED_JOBS);
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [toastMsg, setToastMsg] = useState('');
  const [registeredEmails, setRegisteredEmails] = useState<string[]>(SEED_REGISTERED_USERS);

  useEffect(() => {
    AsyncStorage.getItem(USER_KEY).then(raw => {
      if (raw) setUserState(JSON.parse(raw));
    });
  }, []);

  function setUser(u: User | null) {
    setUserState(u);
    if (u) AsyncStorage.setItem(USER_KEY, JSON.stringify(u));
    else AsyncStorage.removeItem(USER_KEY);
  }

  function toast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2400);
  }

  function registerUser(email: string) {
    setRegisteredEmails(es => es.includes(email) ? es : [...es, email]);
  }

  function isEmailRegistered(email: string) {
    return registeredEmails.includes(email.toLowerCase().trim());
  }

  return (
    <AppContext.Provider value={{ user, setUser, jobs, setJobs, reviews, setReviews, projects, setProjects, toastMsg, toast, registeredEmails, registerUser, isEmailRegistered }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
