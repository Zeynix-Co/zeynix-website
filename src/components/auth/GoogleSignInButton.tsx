'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { AlertCircle } from 'lucide-react';

interface GoogleSignInButtonProps {
    mode?: 'login' | 'register';
    redirectTo?: string;
}

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: any) => void;
                    prompt: (momentListener?: any) => void;
                    renderButton: (parent: HTMLElement, options: any) => void;
                };
            };
        };
    }
}

export default function GoogleSignInButton({ mode = 'login', redirectTo = '/' }: GoogleSignInButtonProps) {
    const router = useRouter();
    const { googleLogin, isLoading } = useAuthStore();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [customerNotice, setCustomerNotice] = useState<string | null>(null);
    const [googleReady, setGoogleReady] = useState(false);
    const googleBtnRef = useRef<HTMLDivElement>(null);

    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

    useEffect(() => {
        if (!googleClientId) return;

        const loadScript = () => {
            if (!document.getElementById('google-gsi-script')) {
                const script = document.createElement('script');
                script.id = 'google-gsi-script';
                script.src = 'https://accounts.google.com/gsi/client';
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    initGoogle();
                };
                document.body.appendChild(script);
            } else if (window.google) {
                initGoogle();
            }
        };

        const initGoogle = () => {
            if (!window.google?.accounts?.id || !googleClientId) return;

            try {
                window.google.accounts.id.initialize({
                    client_id: googleClientId,
                    callback: handleCredentialResponse,
                    auto_select: false,
                    cancel_on_tap_outside: true,
                });

                if (googleBtnRef.current) {
                    googleBtnRef.current.innerHTML = '';
                    window.google.accounts.id.renderButton(googleBtnRef.current, {
                        type: 'standard',
                        theme: 'outline',
                        size: 'large',
                        text: mode === 'login' ? 'continue_with' : 'signup_with',
                        shape: 'rectangular',
                        logo_alignment: 'left',
                        width: 380,
                    });
                    setGoogleReady(true);
                }
            } catch (e) {
                console.error('Failed to initialize Google Sign-In:', e);
            }
        };

        loadScript();
    }, [googleClientId, mode]);

    const handleCredentialResponse = async (response: any) => {
        if (!response.credential) return;

        setIsGoogleLoading(true);
        setCustomerNotice(null);

        try {
            await googleLogin({ credential: response.credential });
            router.push(redirectTo);
        } catch (err: any) {
            console.error('Google login failed:', err);
            setCustomerNotice(err.message || 'Unable to sign in with Google. Please try again.');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleCustomClick = () => {
        if (!googleClientId) {
            setCustomerNotice(
                'Google Sign-In is temporarily undergoing maintenance. Please sign in with your email and password below.'
            );
            setTimeout(() => setCustomerNotice(null), 6000);
            return;
        }

        if (window.google?.accounts?.id) {
            setIsGoogleLoading(true);
            try {
                window.google.accounts.id.prompt((notification: any) => {
                    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                        setIsGoogleLoading(false);
                        const btn = googleBtnRef.current?.querySelector('div[role="button"]') as HTMLElement;
                        if (btn) btn.click();
                    }
                });
            } catch (err) {
                setIsGoogleLoading(false);
                const btn = googleBtnRef.current?.querySelector('div[role="button"]') as HTMLElement;
                if (btn) btn.click();
            }
        }
    };

    return (
        <div className="w-full flex flex-col items-center">
            {/* Dedicated Google Rendered Button Container */}
            <div
                ref={googleBtnRef}
                className={`w-full flex items-center justify-center min-h-[44px] overflow-hidden rounded-xl transition-opacity duration-300 ${
                    googleReady ? 'block' : 'hidden'
                }`}
            />

            {/* Fallback Luxury Button shown while Google GSI script loads */}
            {!googleReady && (
                <button
                    type="button"
                    onClick={handleCustomClick}
                    disabled={isLoading || isGoogleLoading}
                    className="w-full h-11 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-[#070F2B] border border-gray-200 hover:border-[#B5945B]/60 shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(181,148,91,0.18)] active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                    {isGoogleLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-[#070F2B] border-t-transparent rounded-full animate-spin" />
                            <span>Connecting to Google...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                />
                            </svg>
                            <span className="text-[#070F2B] font-extrabold">
                                {mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}
                            </span>
                        </>
                    )}
                </button>
            )}

            {customerNotice && (
                <div className="w-full mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed flex items-center gap-2.5 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <p className="flex-1 font-medium">{customerNotice}</p>
                </div>
            )}
        </div>
    );
}
