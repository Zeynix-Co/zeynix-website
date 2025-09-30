'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colorClasses } from '@/lib/constants';
import { CheckCircle, XCircle } from 'lucide-react';


export default function LoginForm() {
    const router = useRouter();
    const { login, isLoading, error, clearError } = useAuthStore();

    // Local state for form inputs
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [formErrors, setFormErrors] = useState<{
        email?: string;
        password?: string;
    }>({});

    // Forgot password state
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }

        // Clear global error
        if (error) clearError();
    };

    // Validate form
    const validateForm = () => {
        const errors: typeof formErrors = {};

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await login(formData.email, formData.password, formData.rememberMe);
            router.push('/'); // Redirect to home page after successful login
        } catch (error) {
            // Error is handled by the store
            console.error('Login failed:', error);
        }
    };

    // Handle forgot password
    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!forgotPasswordEmail.trim()) {
            setForgotPasswordMessage({ type: 'error', text: 'Please enter your email address' });
            return;
        }

        if (!/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
            setForgotPasswordMessage({ type: 'error', text: 'Please enter a valid email address' });
            return;
        }

        setForgotPasswordLoading(true);
        setForgotPasswordMessage(null);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: forgotPasswordEmail }),
            });

            const result = await response.json();

            if (result.success) {
                setForgotPasswordMessage({ type: 'success', text: result.message });
                setForgotPasswordEmail('');
            } else {
                setForgotPasswordMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            setForgotPasswordMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setForgotPasswordLoading(false);
        }
    };

    return (
        <div className="md:w-full max-w-md w-5/6 mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className={`text-2xl font-bold text-center mb-6 ${colorClasses.primary.text}`}>
                    Welcome Back
                </h2>

                {/* Global Error Display */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className={`block text-sm font-medium mb-1 ${colorClasses.primary.text}`}>
                            Email Address
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className={formErrors.email ? 'border-red-500' : `w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white ${colorClasses.light.bg} ${colorClasses.dark.text}`}
                            disabled={isLoading}
                        />
                        {formErrors.email && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className={`block text-sm font-medium mb-1 ${colorClasses.primary.text}`}>
                            Password
                        </label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            className={formErrors.password ? 'border-red-500' : `w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white ${colorClasses.light.bg} ${colorClasses.dark.text}`}
                            disabled={isLoading}
                        />
                        {formErrors.password && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                        )}
                    </div>

                    {/* Remember Me and Forgot Password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="rememberMe"
                                name="rememberMe"
                                type="checkbox"
                                checked={formData.rememberMe}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                disabled={isLoading}
                            />
                            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                Remember me
                            </label>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowForgotPassword(true)}
                            className="text-sm text-blue-600 hover:text-blue-500 cursor-pointer"
                            disabled={isLoading}
                        >
                            Forgot password?
                        </button>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                </form>

                {/* Additional Links */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don&apos;t have an account?{' '}
                        <button
                            onClick={() => router.push('/register')}
                            className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className={`text-lg font-semibold ${colorClasses.primary.text}`}>
                                Reset Password
                            </h3>
                            <button
                                onClick={() => {
                                    setShowForgotPassword(false);
                                    setForgotPasswordMessage(null);
                                    setForgotPasswordEmail('');
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <p className="text-gray-600 text-sm mb-4">
                            Enter your email address and we&apos;ll send you a link to reset your password.
                        </p>

                        {/* Message */}
                        {forgotPasswordMessage && (
                            <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${forgotPasswordMessage.type === 'success'
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                                }`}>
                                {forgotPasswordMessage.type === 'success' ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                    <XCircle className="w-4 h-4 text-red-600" />
                                )}
                                <p className="text-sm">{forgotPasswordMessage.text}</p>
                            </div>
                        )}

                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div>
                                <label htmlFor="forgotEmail" className={`block text-sm font-medium mb-1 ${colorClasses.primary.text}`}>
                                    Email Address
                                </label>
                                <Input
                                    id="forgotEmail"
                                    type="email"
                                    value={forgotPasswordEmail}
                                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full"
                                    disabled={forgotPasswordLoading}
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setShowForgotPassword(false);
                                        setForgotPasswordMessage(null);
                                        setForgotPasswordEmail('');
                                    }}
                                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                                    disabled={forgotPasswordLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={forgotPasswordLoading}
                                >
                                    {forgotPasswordLoading ? 'Sending...' : 'Send Reset Link'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
} 