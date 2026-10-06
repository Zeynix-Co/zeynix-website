'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminStore } from '@/store';
import { Eye, EyeOff, CheckCircle, XCircle, ShieldCheck, ArrowRight, Lock, Mail, ShieldAlert } from 'lucide-react';

export default function AdminLoginForm() {
    const router = useRouter();
    const { login, isLoading, error, clearError } = useAdminStore();

    // Local state for form inputs
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [showPassword, setShowPassword] = useState(false);
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

        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }

        if (error) clearError();
    };

    // Validate form
    const validateForm = () => {
        const errors: typeof formErrors = {};

        if (!formData.email.trim()) {
            errors.email = 'Admin email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
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
            router.push('/admin/dashboard');
        } catch (err) {
            console.error('Admin login failed:', err);
        }
    };

    // Handle forgot password
    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!forgotPasswordEmail.trim()) {
            setForgotPasswordMessage({ type: 'error', text: 'Please enter your admin email address' });
            return;
        }

        if (!/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
            setForgotPasswordMessage({ type: 'error', text: 'Please enter a valid email address' });
            return;
        }

        setForgotPasswordLoading(true);
        setForgotPasswordMessage(null);

        try {
            const response = await fetch('/api/admin/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: forgotPasswordEmail }),
            });

            const result = await response.json();

            if (result.success) {
                setForgotPasswordMessage({
                    type: 'success',
                    text: 'If an administrator account with that email exists, a password reset link has been dispatched to your inbox.'
                });
                setForgotPasswordEmail('');
            } else {
                setForgotPasswordMessage({
                    type: 'error',
                    text: result.message || 'Unable to process reset request.'
                });
            }
        } catch (err) {
            console.error('Admin forgot password error:', err);
            setForgotPasswordMessage({
                type: 'error',
                text: 'An unexpected error occurred. Please try again.'
            });
        } finally {
            setForgotPasswordLoading(false);
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
                            <ShieldCheck className="w-3 h-3 text-[#B5945B]" />
                        </div>
                    </div>
                    <h2 className="text-2xl sm:text-[24px] font-black tracking-tight text-white font-serif uppercase">
                        Admin Portal
                    </h2>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#B5945B] mt-1 flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#B5945B]" />
                        Executive Console Access
                    </p>

                    {/* Security Pill */}
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                        <ShieldAlert className="w-3 h-3 text-amber-400" />
                        <span>Restricted • Authorized Access Only</span>
                    </div>
                </div>

                {/* Global Error Banner */}
                {error && (
                    <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/40 rounded-xl flex items-start gap-2.5 text-red-200 text-xs animate-shake">
                        <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{error}</span>
                    </div>
                )}

                {/* Main Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Admin Email */}
                    <div>
                        <label htmlFor="admin-email" className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                            Administrator Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <Mail className="w-4 h-4" />
                            </div>
                            <input
                                id="admin-email"
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

                    {/* Password Input with Visibility Toggle */}
                    <div>
                        <label htmlFor="admin-password" className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                            Security Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                id="admin-password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter admin credentials"
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

                    {/* Remember Me and Forgot Password */}
                    <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                id="admin-rememberMe"
                                name="rememberMe"
                                type="checkbox"
                                checked={formData.rememberMe}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                className="w-3.5 h-3.5 rounded bg-white/10 border-white/20 text-[#B5945B] focus:ring-[#B5945B] focus:ring-offset-0 cursor-pointer accent-[#B5945B]"
                            />
                            <span className="text-[11px] text-gray-300 group-hover:text-white transition-colors">
                                Keep session active
                            </span>
                        </label>
                        <button
                            type="button"
                            onClick={() => {
                                setShowForgotPassword(true);
                                setForgotPasswordEmail(formData.email);
                            }}
                            className="text-[11px] font-bold text-[#B5945B] hover:text-[#D4AF37] transition-colors cursor-pointer"
                        >
                            Forgot password?
                        </button>
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
                                <span>Verifying Clearance...</span>
                            </>
                        ) : (
                            <>
                                <span>Sign In to Console</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                {/* Additional Links / Setup */}
                <div className="mt-6 pt-5 border-t border-white/10 text-center">
                    <p className="text-xs text-gray-400">
                        Need initial setup?{' '}
                        <button
                            type="button"
                            onClick={() => router.push('/admin/setup')}
                            className="font-bold text-[#B5945B] hover:text-[#D4AF37] transition-colors cursor-pointer"
                        >
                            Setup Admin Portal
                        </button>
                    </p>
                </div>
            </div>

            {/* Forgot Password Modal (Luxury Admin Style) */}
            {showForgotPassword && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-[#070F2B] rounded-3xl p-6 sm:p-8 border border-[#B5945B]/40 max-w-md w-full shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative">
                        {/* Top decorative line */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#B5945B] to-transparent" />

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-black text-white font-serif uppercase tracking-tight">
                                    Reset Admin Password
                                </h3>
                                <p className="text-[11px] font-bold text-[#B5945B] uppercase tracking-wider mt-0.5">
                                    Executive Recovery Service
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowForgotPassword(false);
                                    setForgotPasswordMessage(null);
                                    setForgotPasswordEmail('');
                                }}
                                className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-gray-300 text-xs leading-relaxed mb-4">
                            Enter your registered administrator email address and we&apos;ll send an encrypted verification link to reset your administrative credentials.
                        </p>

                        {/* Status Message */}
                        {forgotPasswordMessage && (
                            <div
                                className={`mb-4 p-3 rounded-xl flex items-start gap-2.5 text-xs ${
                                    forgotPasswordMessage.type === 'success'
                                        ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-200'
                                        : 'bg-red-500/15 border border-red-500/40 text-red-200'
                                }`}
                            >
                                {forgotPasswordMessage.type === 'success' ? (
                                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                ) : (
                                    <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                )}
                                <p className="flex-1 leading-snug">{forgotPasswordMessage.text}</p>
                            </div>
                        )}

                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div>
                                <label htmlFor="adminForgotEmail" className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                                    Admin Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        id="adminForgotEmail"
                                        type="email"
                                        value={forgotPasswordEmail}
                                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                        placeholder="admin@zeynix.in"
                                        disabled={forgotPasswordLoading}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/15 focus:border-[#B5945B] focus:ring-1 focus:ring-[#B5945B] rounded-xl text-white text-xs placeholder:text-gray-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForgotPassword(false);
                                        setForgotPasswordMessage(null);
                                        setForgotPasswordEmail('');
                                    }}
                                    disabled={forgotPasswordLoading}
                                    className="flex-1 h-10 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={forgotPasswordLoading}
                                    className="flex-1 h-10 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider text-[#070F2B] bg-gradient-to-r from-[#B5945B] to-[#D4AF37] hover:from-[#A3834E] hover:to-[#B5945B] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-md"
                                >
                                    {forgotPasswordLoading ? (
                                        <>
                                            <div className="w-3.5 h-3.5 border-2 border-[#070F2B] border-t-transparent rounded-full animate-spin" />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <span>Send Link</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
