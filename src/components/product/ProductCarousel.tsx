'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react';
import Link from 'next/link';
import { calculateDiscount } from '@/data/products';
import { productAPI } from '@/lib/api';
import { Product } from '@/data/products';

export default function ProductCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    // Constants for carousel dimensions
    const CARD_WIDTH = 320; // w-80 = 320px
    const GAP = 16; // gap-4 = 16px
    const TOTAL_WIDTH = CARD_WIDTH + GAP;

    // Fetch featured products from API
    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await productAPI.getFeaturedProducts(8);
                if (response.success) {
                    setProducts(response.data);
                    // Start from the first duplicated set for seamless infinite scroll
                    setCurrentIndex(response.data.length);
                }
            } catch (err) {
                setError('Failed to load featured products');
                console.error('Error fetching featured products:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    // Create a circular array: [products, products, products] for smooth infinite scroll
    const circularProducts = products.length > 0 ? [...products, ...products, ...products] : [];

    const nextSlide = useCallback(() => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);

        // Reset position after transition to create infinite effect
        setTimeout(() => {
            setCurrentIndex((current) => {
                if (current >= products.length * 2 - 1) {
                    setIsTransitioning(false);
                    return products.length;
                } else {
                    setIsTransitioning(false);
                    return current;
                }
            });
        }, 500);
    }, [isTransitioning, products.length]);

    const prevSlide = () => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setCurrentIndex((prev) => prev - 1);

        // Reset position after transition to create infinite effect
        setTimeout(() => {
            if (currentIndex <= products.length) {
                setIsTransitioning(false);
                setCurrentIndex(products.length * 2 - 1);
            } else {
                setIsTransitioning(false);
            }
        }, 500);
    };

    // Auto-play functionality with improved timing
    useEffect(() => {
        if (!isAutoPlaying || products.length === 0) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 4000); // Increased to 4 seconds for better UX

        return () => clearInterval(interval);
    }, [isAutoPlaying, products.length, nextSlide]); // Added nextSlide to dependencies

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading products...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 mb-2">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No featured products available</p>
            </div>
        );
    }

    // Touch/swipe handling
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
        setIsAutoPlaying(false);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe && !isTransitioning) {
            nextSlide();
        }
        if (isRightSwipe && !isTransitioning) {
            prevSlide();
        }

        setIsAutoPlaying(true);
    };

    // Handle mouse events for better UX
    const handleMouseEnter = () => setIsAutoPlaying(false);
    const handleMouseLeave = () => setIsAutoPlaying(true);

    return (
        <div
            className="relative w-full overflow-hidden py-4 px-2"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Carousel Container */}
            <div
                ref={carouselRef}
                className="flex gap-4"
                style={{
                    transform: `translateX(-${currentIndex * TOTAL_WIDTH}px)`,
                    transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
                    width: `${circularProducts.length * TOTAL_WIDTH}px`
                }}
            >
                {circularProducts.map((product, index) => (
                    <Link
                        key={`${product.id || index}-${index}`}
                        href={`/products/${product.category || 'casual'}/${product.id || 'unknown'}`}
                        className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        {/* Product Image */}
                        <div className="relative h-64 bg-gray-200">
                            {product.label && (
                                <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                    {product.label}
                                </div>
                            )}
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Fallback to placeholder if image fails to load
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/images/products/placeholder.jpg';
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2"></div>
                                        <p className="text-sm">No Image</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="p-4">
                            {/* Rating */}
                            <div className="flex items-center mb-2">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600 ml-1">{product.rating || 0}</span>
                            </div>

                            {/* Brand and Name */}
                            <div className="mb-2">
                                <p className="font-semibold text-sm text-gray-800">{product.brand || 'Zeynix'}</p>
                                <p className="text-sm text-gray-600 truncate">{product.name || 'Product'}</p>
                            </div>

                            {/* Price and Like */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg text-black">₹{product.price || 0}</span>
                                    {product.originalPrice && (
                                        <>
                                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                                            <span className="text-xs text-green-600 font-semibold">
                                                {calculateDiscount(product.originalPrice, product.price)}% OFF
                                            </span>
                                        </>
                                    )}
                                </div>
                                <div
                                    className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        // TODO: Add to wishlist functionality
                                        console.log('Add to wishlist:', product.id);
                                    }}
                                >
                                    <Heart className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                disabled={isTransitioning}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous products"
            >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>

            <button
                onClick={nextSlide}
                disabled={isTransitioning}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next products"
            >
                <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>

            {/* Touch/Swipe indicators */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {products.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            if (!isTransitioning) {
                                setIsTransitioning(true);
                                setCurrentIndex(products.length + index);
                                setTimeout(() => setIsTransitioning(false), 500);
                            }
                        }}
                        aria-label={`Go to product set ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
} 