'use client';

import { gradients } from '@/lib/constants';
import { Truck } from 'lucide-react';

export default function DeliveryCoupon() {
    return (
        <div className="relative w-full max-w-md mx-auto mb-6">
            {/* Main Coupon Container */}
            <div className={`relative ${gradients.goldenCoupon.css} rounded-lg p-4 shadow-lg`}>
                {/* Left Perforations */}
                <div className="absolute left-0 top-1/4 w-3 h-3 bg-white rounded-full transform -translate-x-1/2"></div>
                <div className="absolute left-0 bottom-1/4 w-3 h-3 bg-white rounded-full transform -translate-x-1/2"></div>

                {/* Right Perforations */}
                <div className="absolute right-0 top-1/4 w-3 h-3 bg-white rounded-full transform translate-x-1/2"></div>
                <div className="absolute right-0 bottom-1/4 w-3 h-3 bg-white rounded-full transform translate-x-1/2"></div>

                {/* Content */}
                <div className="flex items-center justify-center gap-3 text-black font-semibold">
                    <Truck className="w-8 h-8 animate-bounce" />
                    <span className="text-2xl font-bold">Delivery in 30 mins</span>
                </div>
            </div>

            {/* Pulse Animation Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-lg opacity-0 animate-ping"></div>
        </div>
    );
} 