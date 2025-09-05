'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colorClasses } from '@/lib/constants';

export default function AdminLoginForm() {
    const router = useRouter();
    const { login, isLoading, error, clearError } = useAdminStore();

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
            // Redirect immediately after successful login
            router.push('/admin/dashboard');
        } catch (error) {
            // Error is handled by the store
            console.error('Admin login failed:', error);
        }
    };

    return (
        <div className="md:w-full max-w-md w-5/6 mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className={`text-2xl font-bold text-center mb-6 ${colorClasses.primary.text}`}>
                    Admin Login
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
                            placeholder="Enter admin email"
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
                            placeholder="Enter admin password"
                            className={formErrors.password ? 'border-red-500' : `w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white ${colorClasses.light.bg} ${colorClasses.dark.text}`}
                            disabled={isLoading}
                        />
                        {formErrors.password && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                        )}
                    </div>

                    {/* Remember Me Checkbox */}
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

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In as Admin'}
                    </Button>
                </form>

                {/* Additional Links */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Need to create admin account?{' '}
                        <button
                            onClick={() => router.push('/admin/setup')}
                            className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                        >
                            Setup Admin
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
