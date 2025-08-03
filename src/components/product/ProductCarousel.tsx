'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react';
import { mockProducts, calculateDiscount } from '@/data/products';

export default function ProductCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const carouselRef = useRef<HTMLDivElement>(null);

    // Create a circular array by duplicating products
    const circularProducts = [...mockProducts, ...mockProducts, ...mockProducts];

    const nextSlide = () => {
        setCurrentIndex((prev) => {
            const newIndex = prev + 1;
            // Reset to original position when reaching the end of the first set
            if (newIndex >= mockProducts.length) {
                return 0;
            }
            return newIndex;
        });
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => {
            const newIndex = prev - 1;
            // Jump to the end when going before the start
            if (newIndex < 0) {
                return mockProducts.length - 1;
            }
            return newIndex;
        });
    };

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 3000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, currentIndex]);

    return (
        <div className="relative w-full overflow-hidden py-4 px-2">
            {/* Carousel Container */}
            <div
                ref={carouselRef}
                className="flex gap-4"
                style={{
                    transform: `translateX(-${currentIndex * 336}px)`,
                    transition: 'transform 0.5s ease-in-out',
                    width: `${circularProducts.length * 320 + (circularProducts.length - 1) * 16}px`
                }}
            >
                {circularProducts.map((product, index) => (
                    <div
                        key={`${product.id}-${index}`}
                        className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md overflow-hidden"
                    >
                        {/* Product Image */}
                        <div className="relative h-64 bg-gray-200">
                            {product.label && (
                                <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                    {product.label}
                                </div>
                            )}
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                Product Image {product.id}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="p-4">
                            {/* Rating */}
                            <div className="flex items-center mb-2">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                            </div>

                            {/* Brand and Name */}
                            <div className="mb-2">
                                <p className="font-semibold text-sm text-gray-800">{product.brand}</p>
                                <p className="text-sm text-gray-600 truncate">{product.name}</p>
                            </div>

                            {/* Price and Like */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg text-black">₹{product.price}</span>
                                    <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                                    <span className="text-xs text-green-600 font-semibold">
                                        {calculateDiscount(product.originalPrice, product.price)}% OFF
                                    </span>
                                </div>
                                <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
            >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
            >
                <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
        </div>
    );
} 