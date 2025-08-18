'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/store';

interface ProtectedAdminRouteProps {
    children: React.ReactNode;
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
    const router = useRouter();
    const { user, isAuthenticated } = useAdminStore();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        // Only run on client side
        if (isClient && (!user || !isAuthenticated)) {
            router.push('/admin/login');
            return;
        }
    }, [user, isAuthenticated, router, isClient]);

    // Don't render anything until client-side hydration is complete
    if (!isClient) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Render children if authenticated
    return <>{children}</>;
}
