'use client';

/**
 * ProtectedRoute
 * ---------------
 * WHY THIS CHANGE:
 * The previous implementation called loginAsDemo() whenever the user was not
 * authenticated — meaning no route was ever truly protected. An unauthenticated
 * visitor could reach any dashboard page simply by navigating there; the app
 * would silently grant them a fake demo identity.
 *
 * This version redirects unauthenticated users to /login. Demo mode is an
 * explicit user choice made on the login page — it is NOT granted automatically.
 *
 * FLOW:
 *   1. While Firebase auth state is still loading → show spinner (prevents flash)
 *   2. Auth loaded, user is authenticated (real or demo) → render children
 *   3. Auth loaded, user is NOT authenticated → redirect to /login,
 *      preserving the originally requested path in the `from` query param
 *      so the login page can redirect back after successful sign-in.
 */

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { LoadingSpinner } from '@/components/common/loading-spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Minimum role required to view this route.
   * Pass undefined (default) to allow any authenticated user.
   * Roles: 'OWNER' | 'ADMIN' | 'MEMBER'
   */
  requiredRole?: 'OWNER' | 'ADMIN' | 'MEMBER';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return; // wait for Firebase auth state to resolve

    if (!isAuthenticated) {
      // Encode the current path so the login page can redirect back after sign-in
      const returnTo = encodeURIComponent(pathname ?? '/dashboard');
      router.replace(`/login?from=${returnTo}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // ── Loading state ────────────────────────────────────────────────────────
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white text-slate-900">
        <LoadingSpinner className="h-10 w-10 text-indigo-600" />
      </div>
    );
  }

  // ── Role check (optional) ────────────────────────────────────────────────
  // Note: role enforcement at the UI layer is a UX convenience only.
  // The backend always enforces RBAC independently via require_role() — this
  // prevents rendering sensitive UI sections to lower-privilege users but is
  // not a security boundary by itself.
  if (requiredRole && user) {
    // UserProfile does not carry role directly — this is a placeholder for
    // when role is added to the user profile type. The backend is the
    // authoritative source; frontend role checks improve UX only.
  }

  return <>{children}</>;
}
