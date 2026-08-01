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

export interface StartupHealthCalculation {
  score: number;
  statusText: string;
  statusBadge: string;
  statusColor: string;
  strokeDashoffset: number;
  runwayScore: number;
  growthScore: number;
  revenueScore: number;
  burnScore: number;
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

export function calculateStartupHealthScore(metrics: UserStartupMetrics): StartupHealthCalculation {
  // If all metrics are null or user is new
  const hasNoData =
    metrics.isNewUser || (!metrics.revenue && !metrics.runway && !metrics.burn && !metrics.growth);

  if (hasNoData) {
    return {
      score: 0,
      statusText: 'Pending Setup',
      statusBadge: 'New Account',
      statusColor: '#94A3B8',
      strokeDashoffset: 88,
      runwayScore: 0,
      growthScore: 0,
      revenueScore: 0,
      burnScore: 0,
    };
  }

  // 1. Runway Score (Weight: 35%)
  let runwayScore = 50;
  if (metrics.runway) {
    const rVal = parseFloat(metrics.runway.replace(/[^0-9.]/g, '')) || 0;
    if (rVal >= 18) runwayScore = 100;
    else if (rVal >= 12) runwayScore = 90;
    else if (rVal >= 6) runwayScore = 75;
    else if (rVal >= 3) runwayScore = 45;
    else runwayScore = 20;
  }

  // 2. Growth Score (Weight: 25%)
  let growthScore = 50;
  if (metrics.growth) {
    const gVal = parseFloat(metrics.growth.replace(/[^0-9.-]/g, '')) || 0;
    if (gVal >= 25) growthScore = 100;
    else if (gVal >= 15) growthScore = 88;
    else if (gVal >= 5) growthScore = 72;
    else if (gVal >= 0) growthScore = 55;
    else growthScore = 25;
  }

  // 3. Revenue Score (Weight: 25%)
  let revenueScore = 50;
  if (metrics.revenue) {
    let revNum = parseFloat(metrics.revenue.replace(/[^0-9.]/g, '')) || 0;
    if (metrics.revenue.toLowerCase().includes('k')) revNum *= 1000;
    if (metrics.revenue.toLowerCase().includes('m')) revNum *= 1000000;

    if (revNum >= 50000) revenueScore = 100;
    else if (revNum >= 20000) revenueScore = 92;
    else if (revNum >= 5000) revenueScore = 78;
    else if (revNum > 0) revenueScore = 65;
    else revenueScore = 55;
  }

  // 4. Burn Efficiency Score (Weight: 15%)
  let burnScore = 75;
  if (metrics.burnTrend) {
    if (metrics.burnTrend.includes('-'))
      burnScore = 95; // burn decreasing
    else if (metrics.burnTrend.includes('+')) burnScore = 60; // burn increasing
  }

  // Calculate Weighted Overall Health Score (0 - 100)
  const totalScore = Math.round(
    runwayScore * 0.35 + growthScore * 0.25 + revenueScore * 0.25 + burnScore * 0.15,
  );

  const finalScore = Math.max(10, Math.min(100, totalScore));

  let statusBadge = 'Healthy';
  let statusText = 'Optimal';
  let statusColor = '#16A34A'; // Green

  if (finalScore >= 85) {
    statusBadge = 'Healthy';
    statusText = 'Optimal';
    statusColor = '#16A34A';
  } else if (finalScore >= 70) {
    statusBadge = 'Stable';
    statusText = 'Healthy';
    statusColor = '#2563EB'; // Blue
  } else if (finalScore >= 50) {
    statusBadge = 'Moderate';
    statusText = 'Caution';
    statusColor = '#D97706'; // Amber
  } else {
    statusBadge = 'Critical';
    statusText = 'Low Runway';
    statusColor = '#DC2626'; // Red
  }

  const strokeDashoffset = Math.max(0, Math.round(88 - (88 * finalScore) / 100));

  return {
    score: finalScore,
    statusText,
    statusBadge,
    statusColor,
    strokeDashoffset,
    runwayScore,
    growthScore,
    revenueScore,
    burnScore,
  };
}

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

  const health = calculateStartupHealthScore(metrics);

  return {
    metrics,
    health,
    isLoaded,
    saveMetrics,
    loadDemoData,
    resetToNewUser,
  };
}
