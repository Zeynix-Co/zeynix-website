import LoginForm from '@/components/auth/LoginForm';
import { gradients } from '@/lib/constants';

export default function LoginPage() {
    return (
        <div className={`min-h-screen flex items-center justify-center ${gradients.dark.css}`}>
            <LoginForm />
        </div>
    );
} 