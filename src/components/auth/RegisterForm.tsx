'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colorClasses } from '@/lib/constants';

export default function RegisterForm() {
    const router = useRouter();
    const { register, isLoading, error, clearError } = useAuthStore();

    // Local state for form inputs
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const [formErrors, setFormErrors] = useState<{
        name?: string;
        email?: string;
        phone?: string;
        password?: string;
        confirmPassword?: string;
    }>({});

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email';
        }

        if (!formData.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(formData.phone)) {
            errors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await register(formData);
            router.push('/'); // Redirect to home page after successful registration
        } catch (error) {
            // Error is handled by the store
            console.error('Registration failed:', error);
        }
    };

    return (
        <div className="md:w-full max-w-md w-5/6 mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className={`text-2xl font-bold text-center mb-6 ${colorClasses.primary.text}`}>
                    Create Account
                </h2>

                {/* Global Error Display */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className={`block text-sm font-medium mb-1 ${colorClasses.primary.text}`}>
                            Full Name
                        </label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            className={formErrors.name ? 'border-red-500' : `w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white ${colorClasses.light.bg} ${colorClasses.dark.text}`}
                            disabled={isLoading}
                        />
                        {formErrors.name && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                        )}
                    </div>

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
                            placeholder="Enter your email id"
                            className={formErrors.email ? 'border-red-500' : `w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white ${colorClasses.light.bg} ${colorClasses.dark.text}`}
                            disabled={isLoading}
                        />
                        {formErrors.email && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div>
                        <label htmlFor="phone" className={`block text-sm font-medium mb-1 ${colorClasses.primary.text}`}>
                            Phone Number
                        </label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                            className={formErrors.phone ? 'border-red-500' : `w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white ${colorClasses.light.bg} ${colorClasses.dark.text}`}
                            disabled={isLoading}
                        />
                        {formErrors.phone && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
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
                            placeholder="Create a password"
                            className={formErrors.password ? 'border-red-500' : `w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white ${colorClasses.light.bg} ${colorClasses.dark.text}`}
                            disabled={isLoading}
                        />
                        {formErrors.password && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-1 ${colorClasses.primary.text}`}>
                            Confirm Password
                        </label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm your password"
                            className={formErrors.confirmPassword ? 'border-red-500' : `w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white ${colorClasses.light.bg} ${colorClasses.dark.text}`}
                            disabled={isLoading}
                        />
                        {formErrors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </form>

                {/* Additional Links */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <button
                            onClick={() => router.push('/login')}
                            className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
} 