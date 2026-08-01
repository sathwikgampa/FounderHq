'use client';

import { useState, useEffect, useCallback } from 'react';

export interface WorkspaceSettings {
  companyName: string;
  founderName: string;
  email: string;
  role: string;
  stage: string;
  industry: string;
  operatingMode: 'Autonomous' | 'Semi-Autonomous' | 'Strict Approval';
  metricGoal: string;
  notificationsEnabled: boolean;
}

const STORAGE_KEY = 'founderhq_workspace_settings_v2';
const UPDATE_EVENT = 'founderhq_settings_updated';

export const DEFAULT_SETTINGS: WorkspaceSettings = {
  companyName: 'FounderHQ Startup',
  founderName: 'Sathwik Gampa',
  email: 'founder@founderhq.com',
  role: 'Founder & CEO',
  stage: '0-to-1 Incubator / MVP',
  industry: 'SaaS & Artificial Intelligence',
  operatingMode: 'Semi-Autonomous',
  metricGoal: 'Extend Runway & Launch 30-Day MVP',
  notificationsEnabled: true,
};

export function useWorkspaceSettings(initialUserEmail?: string, initialUserName?: string) {
  const [settings, setSettings] = useState<WorkspaceSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadSettingsFromStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSettings(JSON.parse(saved));
      } else {
        const initial: WorkspaceSettings = {
          ...DEFAULT_SETTINGS,
          founderName: initialUserName || DEFAULT_SETTINGS.founderName,
          email: initialUserEmail || DEFAULT_SETTINGS.email,
        };
        setSettings(initial);
      }
    } catch {
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setIsLoaded(true);
    }
  }, [initialUserEmail, initialUserName]);

  useEffect(() => {
    loadSettingsFromStorage();

    const handleUpdate = () => {
      loadSettingsFromStorage();
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener(UPDATE_EVENT, handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener(UPDATE_EVENT, handleUpdate);
    };
  }, [loadSettingsFromStorage]);

  const updateSettings = (newSettings: Partial<WorkspaceSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(UPDATE_EVENT));
      }
    } catch {
      // localStorage fallback
    }
  };

  return {
    settings,
    isLoaded,
    updateSettings,
  };
}
