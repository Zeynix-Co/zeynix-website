'use client';

import { useEffect } from 'react';
import { Heart, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface WishlistConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGoToWishlist: () => void;
    productName: string;
}

export default function WishlistConfirmationModal({
    isOpen,
    onClose,
    onGoToWishlist,
    productName
}: WishlistConfirmationModalProps) {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 transform transition-all duration-300 scale-100">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="p-6 text-center">
                    {/* Success Icon */}
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <Heart className="w-8 h-8 text-green-600 fill-current" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Product Added to Wishlist
                    </h3>

                    {/* Product Name */}
                    <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                        &quot;{productName}&quot; has been added to your wishlist
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* OK Button */}
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="flex-1 min-h-[44px] touch-manipulation"
                        >
                            OK
                        </Button>

                        {/* Check Wishlist Button */}
                        <Button
                            onClick={onGoToWishlist}
                            className="flex-1 min-h-[44px] touch-manipulation bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Check Wishlist
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
