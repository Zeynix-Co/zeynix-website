'use client';

import { useState, useEffect, useRef } from 'react';
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
    const carouselRef = useRef<HTMLDivElement>(null);

    // Fetch featured products from API
    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await productAPI.getFeaturedProducts(8);
                if (response.success) {
                    setProducts(response.data);
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

    // Create a circular array by duplicating products
    const circularProducts = products.length > 0 ? [...products, ...products, ...products] : [];

    const nextSlide = () => {
        setCurrentIndex((prev) => {
            const newIndex = prev + 1;
            // Reset to original position when reaching the end of the first set
            if (newIndex >= products.length) {
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
                return products.length - 1;
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
                    <Link
                        key={`${product.id}-${index}`}
                        href={`/products/${product.category}/${product.id}`}
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