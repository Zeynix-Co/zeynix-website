'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminStore } from '@/store';

interface ProtectedAdminRouteProps {
    children: React.ReactNode;
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated } = useAdminStore();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const isPublicAdminRoute = pathname === '/admin/login' || pathname === '/admin/setup';

    useEffect(() => {
        if (!isClient) return;

        if (isPublicAdminRoute) {
            if (user && isAuthenticated) {
                router.push('/admin/dashboard');
            }
        } else {
            if (!user || !isAuthenticated) {
                router.push('/admin/login');
            }
        }
    }, [user, isAuthenticated, router, isClient, isPublicAdminRoute]);

    // Don't render anything until client-side hydration is complete
    if (!isClient) {
        return (
            <div className="min-h-screen bg-[#050B1E] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-[#B5945B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-xs uppercase tracking-widest text-[#B5945B]">Loading Atelier Security...</p>
                </div>
            </div>
        );
    }

    // On protected admin routes, don't show children if not authenticated
    if (!isPublicAdminRoute && (!user || !isAuthenticated)) {
        return (
            <div className="min-h-screen bg-[#050B1E] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-[#B5945B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-xs uppercase tracking-widest text-[#B5945B]">Verifying Credentials...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
