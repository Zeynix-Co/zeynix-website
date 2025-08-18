import RegisterForm from '@/components/auth/RegisterForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { gradients } from '@/lib/constants';

export default function RegisterPage() {
    return (
        <ProtectedRoute requireAuth={false} redirectTo="/account">
            <div className={`min-h-screen flex items-center justify-center ${gradients.dark.css}`}>
                <RegisterForm />
            </div>
        </ProtectedRoute>
    );
} 