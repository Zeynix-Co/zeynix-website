'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminStore } from '@/store';
import { Eye, EyeOff, XCircle, ArrowRight, Lock, Mail, User, Phone, ShieldCheck, Sparkles } from 'lucide-react';

export default function AdminSetupPage() {
    const router = useRouter();
    const { setupFirstAdmin, isLoading, error, clearError } = useAdminStore();

    // Local state for form inputs
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }

        if (error) clearError();
    };

    // Validate form
    const validateForm = () => {
        const errors: typeof formErrors = {};

        if (!formData.name.trim()) {
            errors.name = 'Administrator name is required';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            errors.email = 'Administrator email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!formData.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
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
            await setupFirstAdmin({
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
                password: formData.password,
            });
            router.push('/admin/dashboard');
        } catch (err) {
            console.error('Admin setup failed:', err);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto relative z-10">
            {/* Atelier Luxury Admin Card */}
            <div className="bg-[#070F2B]/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-9 border border-[#B5945B]/30 shadow-[0_25px_70px_rgba(0,0,0,0.65)] relative overflow-hidden">
                {/* Ambient Top Glow Line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#B5945B] to-transparent opacity-80" />

                {/* Brand Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-b from-[#B5945B]/20 to-transparent border border-[#B5945B]/40 shadow-inner mb-3 relative">
                        <Image
                            src="/images/logos/zeynix-logo-rbg.png"
                            alt="Zeynix Logo"
                            width={38}
                            height={38}
                            className="object-contain drop-shadow"
                            priority
                        />
                        <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#070F2B] border border-[#B5945B]">
                            <Sparkles className="w-3 h-3 text-[#B5945B]" />
                        </div>
                    </div>
                    <h2 className="text-2xl sm:text-[24px] font-black tracking-tight text-white font-serif uppercase">
                        Admin Setup
                    </h2>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#B5945B] mt-1 flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#B5945B]" />
                        Initial Administrative Setup
                    </p>
                </div>

                {/* Global Error Banner */}
                {error && (
                    <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/40 rounded-xl flex items-start gap-2.5 text-red-200 text-xs animate-shake">
                        <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{error}</span>
                    </div>
                )}

                {/* Main Setup Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="name" className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                            Administrator Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <User className="w-4 h-4" />
                            </div>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Admin Name"
                                disabled={isLoading}
                                className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border rounded-xl text-white text-xs placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#B5945B] transition-all duration-200 ${
                                    formErrors.name ? 'border-red-500' : 'border-white/15 hover:border-white/30 focus:border-[#B5945B]'
                                }`}
                            />
                        </div>
                        {formErrors.name && (
                            <p className="mt-1 text-[11px] text-red-400 font-medium">{formErrors.name}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                            Administrator Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <Mail className="w-4 h-4" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="admin@zeynix.in"
                                disabled={isLoading}
                                className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border rounded-xl text-white text-xs placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#B5945B] transition-all duration-200 ${
                                    formErrors.email ? 'border-red-500' : 'border-white/15 hover:border-white/30 focus:border-[#B5945B]'
                                }`}
                            />
                        </div>
                        {formErrors.email && (
                            <p className="mt-1 text-[11px] text-red-400 font-medium">{formErrors.email}</p>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div>
                        <label htmlFor="phone" className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                            Phone Number
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <Phone className="w-4 h-4" />
                            </div>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="10-digit mobile number"
                                disabled={isLoading}
                                className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border rounded-xl text-white text-xs placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#B5945B] transition-all duration-200 ${
                                    formErrors.phone ? 'border-red-500' : 'border-white/15 hover:border-white/30 focus:border-[#B5945B]'
                                }`}
                            />
                        </div>
                        {formErrors.phone && (
                            <p className="mt-1 text-[11px] text-red-400 font-medium">{formErrors.phone}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="At least 6 characters"
                                disabled={isLoading}
                                className={`w-full pl-10 pr-10 py-2.5 bg-white/5 border rounded-xl text-white text-xs placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#B5945B] transition-all duration-200 ${
                                    formErrors.password ? 'border-red-500' : 'border-white/15 hover:border-white/30 focus:border-[#B5945B]'
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {formErrors.password && (
                            <p className="mt-1 text-[11px] text-red-400 font-medium">{formErrors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Confirm your password"
                                disabled={isLoading}
                                className={`w-full pl-10 pr-10 py-2.5 bg-white/5 border rounded-xl text-white text-xs placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#B5945B] transition-all duration-200 ${
                                    formErrors.confirmPassword ? 'border-red-500' : 'border-white/15 hover:border-white/30 focus:border-[#B5945B]'
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {formErrors.confirmPassword && (
                            <p className="mt-1 text-[11px] text-red-400 font-medium">{formErrors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-11 mt-2 rounded-xl font-extrabold text-xs uppercase tracking-widest text-[#070F2B] bg-gradient-to-r from-[#B5945B] via-[#E5D7B5] to-[#B5945B] hover:from-[#A3834E] hover:to-[#B5945B] shadow-[0_4px_20px_rgba(181,148,91,0.25)] hover:shadow-[0_6px_25px_rgba(181,148,91,0.35)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-[#070F2B] border-t-transparent rounded-full animate-spin" />
                                <span>Provisioning Admin...</span>
                            </>
                        ) : (
                            <>
                                <span>Initialize Administrator</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                {/* Back to Login */}
                <div className="mt-5 pt-4 border-t border-white/10 text-center">
                    <p className="text-xs text-gray-400">
                        Already have an administrator account?{' '}
                        <Link
                            href="/admin/login"
                            className="font-bold text-[#B5945B] hover:text-[#D4AF37] transition-colors inline-flex items-center gap-1"
                        >
                            Sign in to Console
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
