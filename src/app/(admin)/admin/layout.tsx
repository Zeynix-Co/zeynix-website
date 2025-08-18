import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute';
import AdminErrorBoundary from '@/components/admin/AdminErrorBoundary';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="admin-layout">
            <AdminErrorBoundary>
                <ProtectedAdminRoute>
                    {children}
                </ProtectedAdminRoute>
            </AdminErrorBoundary>
        </div>
    );
}
