'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle, XCircle, Lock, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';

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
                setMessage({ type: 'success', text: result.message || 'Password successfully updated! Redirecting to login...' });
                setTimeout(() => {
                    const redirectPath = type === 'admin' ? '/admin/login' : '/login';
                    router.push(redirectPath);
                }, 2200);
            } else {
                setMessage({ type: 'error', text: result.message || 'Password reset failed. The link may have expired.' });
            }
        } catch (error) {
            console.error('Reset password error:', error);
            setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return null;
    }

    return (
        <div className="w-full max-w-md mx-auto relative z-10">
            {/* Atelier Luxury Card Container */}
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
                    </div>
                    <h2 className="text-2xl sm:text-[24px] font-black tracking-tight text-white font-serif uppercase">
                        Reset Password
                    </h2>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#B5945B] mt-1 flex items-center justify-center gap-1.5">
                        <KeyRound className="w-3 h-3 text-[#B5945B]" />
                        {type === 'admin' ? 'Admin Credential Security' : 'Atelier Member Security'}
                    </p>
                </div>

                {/* Message Banner */}
                {message && (
                    <div className={`mb-5 p-3.5 rounded-xl flex items-start gap-2.5 text-xs ${
                        message.type === 'success'
                            ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-200'
                            : 'bg-red-500/15 border border-red-500/40 text-red-200'
                    }`}>
                        {message.type === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                            <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        )}
                        <p className="flex-1 leading-snug">{message.text}</p>
                    </div>
                )}

                {/* Reset Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* New Password */}
                    <div>
                        <label htmlFor="password" className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                            New Password
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
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                placeholder="Enter at least 6 characters"
                                disabled={isLoading}
                                className={`w-full pl-10 pr-10 py-2.5 bg-white/5 border rounded-xl text-white text-xs placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#B5945B] transition-all duration-200 ${
                                    errors.password ? 'border-red-500' : 'border-white/15 hover:border-white/30 focus:border-[#B5945B]'
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
                        {errors.password && (
                            <p className="mt-1 text-[11px] text-red-400 font-medium">{errors.password}</p>
                        )}
                    </div>

                    {/* Confirm New Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                            Confirm New Password
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
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                placeholder="Re-enter your new password"
                                disabled={isLoading}
                                className={`w-full pl-10 pr-10 py-2.5 bg-white/5 border rounded-xl text-white text-xs placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#B5945B] transition-all duration-200 ${
                                    errors.confirmPassword ? 'border-red-500' : 'border-white/15 hover:border-white/30 focus:border-[#B5945B]'
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
                        {errors.confirmPassword && (
                            <p className="mt-1 text-[11px] text-red-400 font-medium">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-11 mt-3 rounded-xl font-extrabold text-xs uppercase tracking-widest text-[#070F2B] bg-gradient-to-r from-[#B5945B] via-[#E5D7B5] to-[#B5945B] hover:from-[#A3834E] hover:to-[#B5945B] shadow-[0_4px_20px_rgba(181,148,91,0.25)] hover:shadow-[0_6px_25px_rgba(181,148,91,0.35)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-[#070F2B] border-t-transparent rounded-full animate-spin" />
                                <span>Updating Credentials...</span>
                            </>
                        ) : (
                            <>
                                <span>Save New Password</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                {/* Back to Login */}
                <div className="mt-6 pt-5 border-t border-white/10 text-center">
                    <button
                        type="button"
                        onClick={() => {
                            const redirectPath = type === 'admin' ? '/admin/login' : '/login';
                            router.push(redirectPath);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#B5945B] transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Sign In</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen w-full relative bg-[#050B1E] text-white flex flex-col justify-between overflow-x-hidden">
            {/* Ambient Glowing Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#B5945B]/20 via-[#D4AF37]/10 to-transparent blur-[140px]" />
                <div className="absolute -bottom-36 -left-36 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#142352]/40 via-[#070F2B]/60 to-transparent blur-[150px]" />
                <div 
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(181, 148, 91, 0.4) 1px, transparent 1px)`,
                        backgroundSize: '36px 36px',
                    }}
                />
            </div>

            {/* Header */}
            <header className="relative z-20 w-full px-6 py-5 sm:px-10 flex items-center justify-between">
                <Link
                    href="/"
                    className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B5945B]/40 text-xs font-semibold tracking-wider uppercase text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-md shadow-sm"
                >
                    <ArrowLeft className="w-3.5 h-3.5 text-[#B5945B] group-hover:-translate-x-1 transition-transform" />
                    <span>Return to Store</span>
                </Link>
            </header>

            {/* Content */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
                <Suspense fallback={
                    <div className="text-center p-8">
                        <div className="w-8 h-8 border-2 border-[#B5945B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-xs uppercase tracking-widest text-[#B5945B]">Loading Security Module...</p>
                    </div>
                }>
                    <ResetPasswordForm />
                </Suspense>
            </main>

            {/* Footer */}
            <footer className="relative z-20 w-full px-6 py-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">
                    Zeynix Atelier • Wear The Luxury • All Rights Reserved
                </p>
            </footer>
        </div>
    );
}
