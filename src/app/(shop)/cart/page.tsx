'use client';

import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cartStore';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { colorClasses } from '@/lib/constants';
import { ShoppingBag, Trash2, Heart, ArrowRight, Minus, Plus, ArrowLeft, Lock } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export default function CartPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const {
        items,
        savedForLater,
        totalItems,
        totalAmount,
        removeFromCart,
        updateQuantity,
        moveToSaved,
        moveToCart,
        removeFromSaved,
        clearCart
    } = useCartStore();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    const getDiscountedPrice = (originalPrice: number, discountPrice?: number) => {
        if (discountPrice && discountPrice < originalPrice) {
            return discountPrice;
        }
        return originalPrice;
    };

    const handleCheckout = () => {
        router.push('/checkout');
    };

    const handleContinueShopping = () => {
        router.push('/products');
    };

    const handleLogin = () => {
        router.push('/login');
    };

    // Show login prompt if user is not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />

                <main className="max-w-7xl mx-auto px-4 py-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                        <Link href="/" className="hover:text-gray-900">Home</Link>
                        <span>/</span>
                        <span className="text-gray-900">Shopping Cart</span>
                    </nav>

                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Link
                                href="/products"
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                                <p className="text-gray-600 mt-1">Login to view your cart</p>
                            </div>
                        </div>
                    </div>

                    {/* Login Required Message */}
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <Lock className={`w-20 h-20 ${colorClasses.secondary.text} mx-auto mb-4`} />
                        <h3 className={`text-xl font-semibold ${colorClasses.primary.text} mb-2`}>Login Required</h3>
                        <p className="text-gray-700 mb-6">Please login to view and manage your shopping cart.</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button onClick={handleLogin} className="w-full sm:w-auto">
                                Login to Continue
                            </Button>
                            <Button onClick={handleContinueShopping} variant="outline" className="w-full sm:w-auto">
                                Continue Shopping
                            </Button>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                    <Link href="/" className={`hover:${colorClasses.primary.text} transition-colors`}>Home</Link>
                    <span className="text-gray-500">/</span>
                    <span className={`${colorClasses.primary.text} font-medium`}>Shopping Cart</span>
                </nav>

                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Link
                            href="/products"
                            className={`p-2 hover:${colorClasses.light.bg} rounded-lg transition-colors`}
                        >
                            <ArrowLeft className={`w-5 h-5 ${colorClasses.primary.text}`} />
                        </Link>
                        <div>
                            <h1 className={`text-3xl font-bold ${colorClasses.primary.text}`}>Shopping Cart</h1>
                            <p className={`text-gray-700 mt-1`}>Review your items and proceed to checkout</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
                    {/* Cart Items Section */}
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        {totalItems === 0 ? (
                            /* Empty Cart */
                            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                                <ShoppingBag className={`w-20 h-20 ${colorClasses.secondary.text} mx-auto mb-4`} />
                                <h3 className={`text-xl font-semibold ${colorClasses.primary.text} mb-2`}>Your cart is empty</h3>
                                <p className="text-gray-700 mb-6">Looks like you haven&apos;t added any items to your cart yet.</p>
                                <Button onClick={handleContinueShopping} className="w-full max-w-xs">
                                    Start Shopping
                                </Button>
                            </div>
                        ) : (
                            /* Cart Items */
                            <div className="bg-white rounded-lg shadow-sm">
                                <div className="p-6 border-b">
                                    <h3 className={`text-lg font-semibold ${colorClasses.primary.text}`}>Cart Items ({totalItems})</h3>
                                </div>

                                <div className="divide-y">
                                    {items.map((item) => (
                                        <div key={item.id} className="p-3 lg:p-6">
                                            <div className="flex space-x-3 lg:space-x-4">
                                                {/* Product Image */}
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={item.product.images[0] || '/images/products/placeholder.jpg'}
                                                        alt={item.product.title}
                                                        className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-lg"
                                                    />
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className={`text-base lg:text-lg font-medium ${colorClasses.primary.text} line-clamp-2`}>
                                                        {item.product.title}
                                                    </h4>
                                                    <p className={`text-xs lg:text-sm ${colorClasses.secondary.text} mt-1 font-medium`}>Size: {item.size}</p>

                                                    {/* Price */}
                                                    <div className="mt-2 lg:mt-3">
                                                        {item.product.discountPrice && item.product.discountPrice < item.product.price ? (
                                                            <div className="flex items-center space-x-2 lg:space-x-3">
                                                                <span className={`text-lg lg:text-xl font-semibold ${colorClasses.primary.text}`}>
                                                                    {formatPrice(item.product.discountPrice)}
                                                                </span>
                                                                <span className="text-xs lg:text-sm text-gray-500 line-through">
                                                                    {formatPrice(item.product.price)}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className={`text-lg lg:text-xl font-semibold ${colorClasses.primary.text}`}>
                                                                {formatPrice(item.product.price)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center justify-between mt-3 lg:mt-4">
                                                        <div className="flex items-center space-x-2 lg:space-x-3">
                                                            <span className={`text-xs lg:text-sm font-medium ${colorClasses.primary.text}`}>Qty:</span>
                                                            <div className="flex items-center border rounded-lg">
                                                                <button
                                                                    onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                                                                    className={`p-2 lg:p-2 hover:${colorClasses.light.bg} rounded-l-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center`}
                                                                    disabled={item.quantity <= 1}
                                                                >
                                                                    <Minus className={`w-4 h-4 ${colorClasses.primary.text}`} />
                                                                </button>
                                                                <span className={`w-12 text-center text-sm font-medium py-2 ${colorClasses.primary.text} min-h-[44px] flex items-center justify-center`}>
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                                                                    className={`p-2 lg:p-2 hover:${colorClasses.light.bg} rounded-r-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center`}
                                                                >
                                                                    <Plus className={`w-4 h-4 ${colorClasses.primary.text}`} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center space-x-2 lg:space-x-3">
                                                            <button
                                                                onClick={() => moveToSaved(item.product.id, item.size)}
                                                                className={`p-2 text-gray-400 hover:text-red-500 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center`}
                                                                title="Save for later"
                                                            >
                                                                <Heart className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => removeFromCart(item.product.id, item.size)}
                                                                className={`p-2 text-gray-400 hover:text-red-500 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center`}
                                                                title="Remove item"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Saved for Later */}
                        {savedForLater.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm mt-6">
                                <div className="p-6 border-b">
                                    <h3 className={`text-lg font-semibold ${colorClasses.primary.text}`}>Saved for Later ({savedForLater.length})</h3>
                                </div>
                                <div className="divide-y">
                                    {savedForLater.map((item) => (
                                        <div key={item.id} className="p-6">
                                            <div className="flex space-x-4">
                                                <img
                                                    src={item.product.images[0] || '/images/products/placeholder.jpg'}
                                                    alt={item.product.title}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className={`text-lg font-medium ${colorClasses.primary.text}`}>
                                                        {item.product.title}
                                                    </h4>
                                                    <p className={`text-sm ${colorClasses.secondary.text} mt-1 font-medium`}>Size: {item.size}</p>
                                                    <div className="mt-3">
                                                        {item.product.discountPrice && item.product.discountPrice < item.product.price ? (
                                                            <div className="flex items-center space-x-3">
                                                                <span className={`text-lg font-semibold ${colorClasses.primary.text}`}>
                                                                    {formatPrice(item.product.discountPrice)}
                                                                </span>
                                                                <span className="text-sm text-gray-500 line-through">
                                                                    {formatPrice(item.product.price)}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className={`text-lg font-semibold ${colorClasses.primary.text}`}>
                                                                {formatPrice(item.product.price)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col space-y-3">
                                                    <button
                                                        onClick={() => moveToCart(item.product.id, item.size)}
                                                        className={`p-3 ${colorClasses.secondary.text} hover:${colorClasses.secondary.bg} hover:${colorClasses.primary.text} rounded-lg transition-colors`}
                                                        title="Move to cart"
                                                    >
                                                        <ArrowRight className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => removeFromSaved(item.product.id, item.size)}
                                                        className="p-3 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                                        title="Remove from saved"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cart Summary Sidebar */}
                    {totalItems > 0 && (
                        <div className="lg:col-span-1 order-1 lg:order-2">
                            <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 sticky top-4 lg:top-8">
                                <h3 className={`text-lg font-semibold ${colorClasses.primary.text} mb-4`}>Order Summary</h3>

                                {/* Summary Details */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className={`${colorClasses.primary.text}`}>Subtotal ({totalItems} items)</span>
                                        <span className={`font-medium ${colorClasses.primary.text}`}>{formatPrice(totalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className={`${colorClasses.primary.text}`}>Shipping</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between font-semibold text-lg">
                                            <span className={`${colorClasses.primary.text}`}>Total</span>
                                            <span className={`${colorClasses.primary.text}`}>{formatPrice(totalAmount)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <Button
                                        onClick={handleCheckout}
                                        className="w-full min-h-[48px] text-base font-medium"
                                        disabled={totalItems === 0}
                                    >
                                        Proceed to Checkout
                                    </Button>
                                    <Button
                                        onClick={handleContinueShopping}
                                        variant="outline"
                                        className="w-full min-h-[48px] text-base"
                                    >
                                        Continue Shopping
                                    </Button>
                                    <button
                                        onClick={clearCart}
                                        className="w-full text-sm text-red-600 hover:text-red-700 py-3 min-h-[44px] border border-red-200 hover:border-red-300 rounded-lg transition-colors"
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
} 