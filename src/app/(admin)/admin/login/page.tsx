import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { gradients } from '@/lib/constants';

export default function AdminLoginPage() {
    return (
        <div className={`min-h-screen flex items-center justify-center ${gradients.dark.css}`}>
            <AdminLoginForm />
        </div>
    );
}
