import RegisterForm from '@/components/auth/RegisterForm';
import { gradients } from '@/lib/constants';

export default function RegisterPage() {
    return (
        <div className={`min-h-screen flex items-center justify-center ${gradients.dark.css}`}>
            <RegisterForm />
        </div>
    );
} 