'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, CheckCircle, XCircle, ArrowRight, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setMessage({ type: 'error', text: 'Please enter your registered email address' });
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setMessage({ type: 'error', text: 'Please enter a valid email address' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (result.success) {
                setMessage({
                    type: 'success',
                    text: 'A password reset link has been dispatched to your email. Please check your inbox and spam folder.'
                });
                setEmail('');
            } else {
                setMessage({ type: 'error', text: result.message || 'Unable to process reset request.' });
            }
        } catch (err) {
            console.error('Forgot password error:', err);
            setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full relative bg-[#050B1E] text-white flex flex-col justify-between overflow-x-hidden">
            {/* Ambient Glowing Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#B5945B]/20 via-[#D4AF37]/10 to-transparent blur-[140px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute -bottom-36 -left-36 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#142352]/40 via-[#070F2B]/60 to-transparent blur-[150px]" />
                <div 
                    className="absolute inset-0 opacity-[0.14]"
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

                <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#B5945B]/80">
                    <Sparkles className="w-3 h-3 text-[#B5945B]" />
                    <span>Atelier Security</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
                <div className="w-full max-w-md mx-auto">
                    <div className="bg-[#070F2B]/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-9 border border-[#B5945B]/30 shadow-[0_25px_70px_rgba(0,0,0,0.65)] relative overflow-hidden">
                        {/* Top decorative glow */}
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
                                Forgot Password?
                            </h2>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-[#B5945B] mt-1 flex items-center justify-center gap-1.5">
                                <KeyRound className="w-3 h-3 text-[#B5945B]" />
                                Secure Account Recovery
                            </p>
                        </div>

                        <p className="text-gray-300 text-xs leading-relaxed mb-5 text-center">
                            Enter your registered email address below and we will dispatch a confidential 1-hour verification link to reset your password.
                        </p>

                        {/* Status Message */}
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

                        {/* Request Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                                    Registered Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        disabled={isLoading}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/15 focus:border-[#B5945B] focus:ring-1 focus:ring-[#B5945B] rounded-xl text-white text-xs placeholder:text-gray-500 focus:outline-none transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 mt-2 rounded-xl font-extrabold text-xs uppercase tracking-widest text-[#070F2B] bg-gradient-to-r from-[#B5945B] via-[#E5D7B5] to-[#B5945B] hover:from-[#A3834E] hover:to-[#B5945B] shadow-[0_4px_20px_rgba(181,148,91,0.25)] hover:shadow-[0_6px_25px_rgba(181,148,91,0.35)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-[#070F2B] border-t-transparent rounded-full animate-spin" />
                                        <span>Dispatching Link...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Reset Link</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Back to Login */}
                        <div className="mt-6 pt-5 border-t border-white/10 text-center">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#B5945B] transition-colors"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Return to Sign In</span>
                            </Link>
                        </div>
                    </div>
                </div>
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
