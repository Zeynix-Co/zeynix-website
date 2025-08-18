import AdminSetupPage from '@/components/admin/AdminSetupPage';
import { gradients } from '@/lib/constants';

export default function AdminLoginPage() {
    return (
        <div className={`min-h-screen flex items-center justify-center ${gradients.dark.css}`}>
            <AdminSetupPage />
        </div>
    );
}
