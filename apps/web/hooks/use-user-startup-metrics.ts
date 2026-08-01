'use client';

import { useState, useEffect } from 'react';

export interface UserStartupMetrics {
  revenue: string | null;
  revenueTrend: string | null;
  runway: string | null;
  runwayTrend: string | null;
  burn: string | null;
  burnTrend: string | null;
  growth: string | null;
  growthTrend: string | null;
  isNewUser: boolean;
}

const STORAGE_KEY = 'founderhq_user_metrics_v1';

export const DEMO_METRICS: UserStartupMetrics = {
  revenue: '$28,450',
  revenueTrend: '+18%',
  runway: '16 Mo',
  runwayTrend: '+2 mo',
  burn: '-$8.1k',
  burnTrend: '-12%',
  growth: '+24%',
  growthTrend: '+4%',
  isNewUser: false,
};

export const NULL_METRICS: UserStartupMetrics = {
  revenue: null,
  revenueTrend: null,
  runway: null,
  runwayTrend: null,
  burn: null,
  burnTrend: null,
  growth: null,
  growthTrend: null,
  isNewUser: true,
};

export function useUserStartupMetrics() {
  const [metrics, setMetrics] = useState<UserStartupMetrics>(NULL_METRICS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setMetrics(JSON.parse(saved));
      } else {
        // Default to NULL state for new user login
        setMetrics(NULL_METRICS);
      }
    } catch {
      setMetrics(NULL_METRICS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveMetrics = (newMetrics: Partial<UserStartupMetrics>) => {
    const updated: UserStartupMetrics = {
      ...metrics,
      ...newMetrics,
      isNewUser: false,
    };
    setMetrics(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // localStorage fallback
    }
  };

  const loadDemoData = () => {
    setMetrics(DEMO_METRICS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_METRICS));
    } catch {
      // localStorage fallback
    }
  };

  const resetToNewUser = () => {
    setMetrics(NULL_METRICS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage fallback
    }
  };

  return {
    metrics,
    isLoaded,
    saveMetrics,
    loadDemoData,
    resetToNewUser,
  };
}
