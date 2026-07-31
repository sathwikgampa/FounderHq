'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { LoadingSpinner } from '@/components/common/loading-spinner';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, loginAsDemo } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginAsDemo();
    }
  }, [isAuthenticated, isLoading, loginAsDemo]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white text-slate-900">
        <LoadingSpinner className="h-10 w-10 text-indigo-600" />
      </div>
    );
  }

  return <>{children}</>;
}
