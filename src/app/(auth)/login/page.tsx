import LoginForm from '@/components/auth/LoginForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function LoginPage() {
    return (
        <ProtectedRoute requireAuth={false} redirectTo="/account">
            <div className="w-full flex items-center justify-center">
                <LoginForm />
            </div>
        </ProtectedRoute>
    );
}