import RegisterForm from '@/components/auth/RegisterForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function RegisterPage() {
    return (
        <ProtectedRoute requireAuth={false} redirectTo="/account">
            <div className="w-full flex items-center justify-center">
                <RegisterForm />
            </div>
        </ProtectedRoute>
    );
}