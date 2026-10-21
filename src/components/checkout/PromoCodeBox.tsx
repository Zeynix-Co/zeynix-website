'use client';

import { useState } from 'react';
import { useCartStore } from '@/store';
import { Tag, CheckCircle2, X, Sparkles, ArrowRight } from 'lucide-react';

interface PromoCodeBoxProps {
    className?: string;
    compact?: boolean;
}

export default function PromoCodeBox({ className = '', compact = false }: PromoCodeBoxProps) {
    const { appliedCoupon, applyCoupon, removeCoupon } = useCartStore();
    const [inputCode, setInputCode] = useState('');
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isApplying, setIsApplying] = useState(false);

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = inputCode.trim();
        if (!trimmed) {
            setFeedback({ type: 'error', message: 'Please enter a coupon code' });
            return;
        }

        setIsApplying(true);
        setFeedback(null);

        // Micro-timeout for realistic feedback feel
        setTimeout(() => {
            const res = applyCoupon(trimmed);
            if (res.success) {
                setFeedback({ type: 'success', message: res.message });
                setInputCode('');
            } else {
                setFeedback({ type: 'error', message: res.message });
            }
            setIsApplying(false);
        }, 150);
    };

    const handleRemove = () => {
        removeCoupon();
        setFeedback(null);
    };

    return (
        <div className={`transition-all ${className}`}>
            {appliedCoupon ? (
                /* Applied Coupon State */
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300/80 rounded-xl p-3 shadow-xs">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                                <Sparkles className="w-4 h-4 animate-pulse" />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-extrabold text-xs uppercase tracking-wider text-emerald-950 bg-white/90 px-2 py-0.5 rounded border border-emerald-300">
                                        {appliedCoupon.code}
                                    </span>
                                    <span className="text-[11px] font-bold text-emerald-700">
                                        {appliedCoupon.badgeText}
                                    </span>
                                </div>
                                <p className="text-[11px] text-emerald-800 mt-0.5 font-medium truncate">
                                    {appliedCoupon.description}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleRemove}
                            className="text-xs font-semibold text-emerald-800 hover:text-red-600 hover:bg-white/80 p-1.5 rounded-md transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0"
                            title="Remove coupon"
                        >
                            <X className="w-4 h-4" />
                            {!compact && <span className="hidden sm:inline">Remove</span>}
                        </button>
                    </div>
                </div>
            ) : (
                /* Unapplied / Input State */
                <form onSubmit={handleApply} className="space-y-1.5">
                    <div className="relative flex items-center">
                        <div className="absolute left-3 pointer-events-none text-gray-400">
                            <Tag className="w-4 h-4 text-[#B5945B]" />
                        </div>
                        <input
                            type="text"
                            value={inputCode}
                            onChange={(e) => {
                                setInputCode(e.target.value);
                                if (feedback) setFeedback(null);
                            }}
                            placeholder="Enter promo code"
                            className="w-full pl-9 pr-24 py-2.5 text-xs sm:text-sm bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#070F2B]/20 focus:border-[#070F2B] transition-all uppercase placeholder:normal-case font-medium tracking-wide"
                        />
                        <button
                            type="submit"
                            disabled={isApplying || !inputCode.trim()}
                            className="absolute right-1.5 px-3 py-1.5 bg-[#070F2B] text-white hover:bg-[#B5945B] hover:text-[#070F2B] disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                            <span>{isApplying ? 'Applying' : 'Apply'}</span>
                            <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>

                    {feedback && (
                        <p
                            className={`text-xs font-medium flex items-center gap-1 px-1 ${
                                feedback.type === 'success' ? 'text-emerald-700' : 'text-red-600'
                            }`}
                        >
                            {feedback.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {feedback.message}
                        </p>
                    )}
                </form>
            )}
        </div>
    );
}
