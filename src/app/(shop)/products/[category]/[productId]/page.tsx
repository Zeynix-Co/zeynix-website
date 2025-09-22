'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, Heart, Share2, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { colorClasses } from '@/lib/constants';
import { productAPI } from '@/lib/api';
import { Product } from '@/data/products';
import AddToCartButton from '@/components/cart/AddToCartButton';
import SizeSelector from '@/components/product/SizeSelector';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useWishlistStore } from '@/store';
import WishlistConfirmationModal from '@/components/wishlist/WishlistConfirmationModal';

interface ProductDetailPageProps {
    params: Promise<{
        category: string;
        productId: string;
    }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showWishlistModal, setShowWishlistModal] = useState(false);

    const resolvedParams = useParams();
    const category = resolvedParams.category as string;
    const productId = resolvedParams.productId as string;
    const router = useRouter();

    // Wishlist functionality
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

    // Fetch product details
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await productAPI.getProduct(productId);
                if (response.success) {
                    setProduct(response.data);
                    // Set first available size as default
                    if (response.data.size && response.data.size.length > 0) {
                        setSelectedSize(response.data.size[0]);
                    }
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                setError('Failed to load product');
                console.error('Error fetching product:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const handleImageChange = (index: number) => {
        setSelectedImageIndex(index);
    };

    const nextImage = () => {
        if (product && product.images) {
            setSelectedImageIndex((prev) =>
                prev === product.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (product && product.images) {
            setSelectedImageIndex((prev) =>
                prev === 0 ? product.images.length - 1 : prev - 1
            );
        }
    };

    const toggleWishlist = () => {
        if (!product) return;

        const defaultSize = selectedSize || product.size[0] || 'M';
        const isWishlisted = isInWishlist(product.id, defaultSize);

        if (isWishlisted) {
            removeFromWishlist(product.id, defaultSize);
        } else {
            addToWishlist({
                id: product.id,
                title: product.name,
                images: product.images || [product.image],
                price: product.price,
                originalPrice: product.originalPrice,
                discountPrice: product.price,
                category: product.category,
                brand: product.brand || 'Zeynix'
            }, defaultSize);

            // Show confirmation modal
            setShowWishlistModal(true);
        }
    };

    const handleGoToWishlist = () => {
        setShowWishlistModal(false);
        router.push('/wishlist');
    };

    const handleCloseModal = () => {
        setShowWishlistModal(false);
    };

    const shareProduct = () => {
        if (navigator.share) {
            navigator.share({
                title: product?.name || 'Check out this product',
                url: window.location.href,
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            // TODO: Show toast notification
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    const calculateDiscount = (originalPrice: number, currentPrice: number) => {
        return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                    <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist.'}</p>
                    <Button onClick={() => router.push('/products')}>
                        Back to Products
                    </Button>
                </div>
            </div>
        );
    }

    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercentage = hasDiscount ? calculateDiscount(product.originalPrice, product.price) : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Breadcrumb Navigation */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600">
                        <button
                            onClick={() => router.push('/products')}
                            className="hover:text-gray-900 transition-colors"
                        >
                            Products
                        </button>
                        <span>/</span>
                        <button
                            onClick={() => router.push(`/products/${category}`)}
                            className="hover:text-gray-900 transition-colors capitalize"
                        >
                            {category}
                        </button>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
                            {product.images && product.images.length > 0 ? (
                                <>
                                    <img
                                        src={product.images[selectedImageIndex]}
                                        alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/images/products/placeholder.jpg';
                                        }}
                                    />

                                    {/* Navigation Arrows */}
                                    {product.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2"></div>
                                        <p className="text-sm">No Image Available</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex space-x-2 overflow-x-auto">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleImageChange(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === selectedImageIndex
                                            ? 'border-blue-500'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/images/products/placeholder.jpg';
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Information */}
                    <div className="space-y-6">
                        {/* Product Header */}
                        <div>
                            <div className="flex items-start justify-between mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={toggleWishlist}
                                        className={`p-2 rounded-full transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center ${product && isInWishlist(product.id, selectedSize || product.size[0] || 'M')
                                            ? 'text-red-500 bg-red-50'
                                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                            }`}
                                    >
                                        <Heart className={`w-6 h-6 ${product && isInWishlist(product.id, selectedSize || product.size[0] || 'M')
                                            ? 'fill-current'
                                            : ''
                                            }`} />
                                    </button>
                                    <button
                                        onClick={shareProduct}
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-lg text-gray-600 mb-3">{product.brand}</p>

                            {/* Rating */}
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(product.rating)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                    {product.rating} (0 reviews)
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                                <span className="text-3xl font-bold text-gray-900">
                                    {formatPrice(product.price)}
                                </span>
                                {hasDiscount && (
                                    <>
                                        <span className="text-xl text-gray-500 line-through">
                                            {formatPrice(product.originalPrice)}
                                        </span>
                                        <span className="bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded-full">
                                            {discountPercentage}% OFF
                                        </span>
                                    </>
                                )}
                            </div>
                            {hasDiscount && (
                                <p className="text-sm text-green-600">
                                    You save {formatPrice(product.originalPrice - product.price)}
                                </p>
                            )}
                        </div>

                        {/* Size Selection */}
                        <div className="space-y-3">
                            <SizeSelector
                                sizes={product.size.map(size => ({
                                    size,
                                    stock: Math.floor(Math.random() * 20) + 1, // Mock stock data
                                    inStock: Math.random() > 0.2 // 80% chance of being in stock
                                }))}
                                selectedSize={selectedSize}
                                onSizeSelect={(size) => setSelectedSize(size)}
                            />
                        </div>

                        {/* Add to Cart */}
                        <div className="space-y-4">
                            {selectedSize ? (
                                <AddToCartButton
                                    product={{
                                        id: product.id,
                                        title: product.name,
                                        images: product.images,
                                        price: product.price,
                                        discountPrice: hasDiscount ? product.originalPrice : undefined
                                    }}
                                    size={selectedSize}
                                    disabled={false}
                                />
                            ) : (
                                <Button disabled className="w-full">
                                    Select a Size
                                </Button>
                            )}
                        </div>

                        {/* Product Features */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 pt-6 border-t">
                            <div className="flex items-center space-x-3">
                                <Shield className="w-6 h-6 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-900">Secure Payment</p>
                                    <p className="text-sm text-gray-600">100% secure checkout</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <RotateCcw className="w-6 h-6 text-purple-600" />
                                <div>
                                    <p className="font-medium text-gray-900">Easy Returns</p>
                                    <p className="text-sm text-gray-600">7 day return policy</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Description */}
                {product.description && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </div>
                    </div>
                )}

                {/* Related Products Placeholder */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
                    <div className="bg-white rounded-lg p-8 text-center shadow-sm">
                        <p className="text-gray-600">Related products will be displayed here</p>
                    </div>
                </div>
            </div>

            <Footer />

            {/* Wishlist Confirmation Modal */}
            <WishlistConfirmationModal
                isOpen={showWishlistModal}
                onClose={handleCloseModal}
                onGoToWishlist={handleGoToWishlist}
                productName={product?.name || ''}
            />
        </div>
    );
} 