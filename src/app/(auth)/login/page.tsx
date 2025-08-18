import LoginForm from '@/components/auth/LoginForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { gradients } from '@/lib/constants';

export default function LoginPage() {
    return (
        <ProtectedRoute requireAuth={false} redirectTo="/account">
            <div className={`min-h-screen flex items-center justify-center ${gradients.dark.css}`}>
                <LoginForm />
            </div>
        </ProtectedRoute>
    );
} 