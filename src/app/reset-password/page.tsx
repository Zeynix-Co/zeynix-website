'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colorClasses } from '@/lib/constants';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const token = searchParams.get('token');
    const type = searchParams.get('type'); // 'user' or 'admin'

    useEffect(() => {
        if (!token) {
            router.push('/login');
        }
    }, [token, router]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Confirm password is required';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setMessage(null);

        try {
            const endpoint = type === 'admin' ? '/api/admin/reset-password' : '/api/auth/reset-password';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                }),
            });

            const result = await response.json();

            if (result.success) {
                setMessage({ type: 'success', text: result.message });
                setTimeout(() => {
                    const redirectPath = type === 'admin' ? '/admin/login' : '/login';
                    router.push(redirectPath);
                }, 3000);
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            console.error('Reset password error:', error);
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className={`text-3xl font-bold ${colorClasses.primary.text} mb-2`}>
                            Zeynix
                        </h1>
                        <p className="text-gray-600 text-sm">Wear The Luxury</p>
                        <h2 className="text-2xl font-semibold text-gray-800 mt-6">
                            Reset Your Password
                        </h2>
                        <p className="text-gray-600 text-sm mt-2">
                            {type === 'admin' ? 'Admin' : 'Customer'} Account
                        </p>
                    </div>

                    {/* Message */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                            {message.type === 'success' ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-600" />
                            )}
                            <p className="text-sm">{message.text}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className={`block text-sm font-medium mb-2 ${colorClasses.primary.text}`}>
                                New Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    placeholder="Enter new password"
                                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 ${colorClasses.primary.text}`}>
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    placeholder="Confirm new password"
                                    className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 ${colorClasses.primary.bg} hover:opacity-90 text-white font-medium rounded-lg transition-colors duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {isLoading ? 'Resetting Password...' : 'Reset Password'}
                        </Button>

                        {/* Back to Login */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    const redirectPath = type === 'admin' ? '/admin/login' : '/login';
                                    router.push(redirectPath);
                                }}
                                className="text-sm text-gray-600 hover:text-gray-800 underline"
                            >
                                Back to Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
