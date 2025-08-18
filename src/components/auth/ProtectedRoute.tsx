'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import Loading from '@/components/common/Loading';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    redirectTo?: string;
}

export default function ProtectedRoute({
    children,
    requireAuth = true,
    redirectTo = '/login'
}: ProtectedRouteProps) {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isLoading && isClient) {
            if (requireAuth && !isAuthenticated) {
                router.push(redirectTo);
            } else if (!requireAuth && isAuthenticated) {
                // If user is already logged in and trying to access login/register page
                router.push('/account');
            }
        }
    }, [isAuthenticated, isLoading, requireAuth, redirectTo, router, isClient]);

    // Show loading while checking authentication
    if (isLoading || !isClient) {
        return <Loading />;
    }

    // If authentication is required and user is not authenticated, don't render children
    if (requireAuth && !isAuthenticated) {
        return null;
    }

    // If authentication is not required and user is authenticated, don't render children
    if (!requireAuth && isAuthenticated) {
        return null;
    }

    // Render children if authentication requirements are met
    return <>{children}</>;
}
