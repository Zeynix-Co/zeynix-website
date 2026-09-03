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
                    <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(7,15,43,0.06)] border border-gray-100 p-6 sm:p-10 text-center max-w-lg mx-auto">
                        <div className="w-16 h-16 rounded-2xl bg-[#070F2B]/5 flex items-center justify-center mx-auto mb-4 text-[#B5945B]">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h3 className={`text-xl font-extrabold uppercase tracking-wide ${colorClasses.primary.text} mb-2`}>Login Required</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">Please log in to your Zeynix account to view and manage your shopping cart.</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={handleLogin}
                                className="w-full sm:w-auto bg-[#070F2B] text-white py-3 px-8 font-bold uppercase tracking-wider text-xs shadow-[3px_3px_0px_#B5945B] hover:shadow-[0px_0px_0px_#B5945B] hover:bg-[#B5945B] hover:text-[#070F2B] transition-all duration-300 cursor-pointer border border-[#070F2B] hover:border-[#B5945B]"
                            >
                                Login to Continue
                            </button>
                            <button
                                onClick={handleContinueShopping}
                                className="w-full sm:w-auto bg-white text-[#070F2B] py-3 px-8 font-bold uppercase tracking-wider text-xs border border-gray-300 hover:border-[#070F2B] transition-colors cursor-pointer"
                            >
                                Continue Shopping
                            </button>
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
                            <h1 className={`text-2xl sm:text-3xl font-bold ${colorClasses.primary.text}`}>Shopping Cart</h1>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">Review your items and proceed to checkout</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Cart Items Section - Order 1 on Mobile & Desktop */}
                    <div className="lg:col-span-2 order-1">
                        {totalItems === 0 ? (
                            /* Empty Cart */
                            <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-100">
                                <ShoppingBag className={`w-16 h-16 sm:w-20 sm:h-20 ${colorClasses.secondary.text} mx-auto mb-4`} />
                                <h3 className={`text-xl font-semibold ${colorClasses.primary.text} mb-2`}>Your cart is empty</h3>
                                <p className="text-gray-600 mb-6 text-sm">Looks like you haven&apos;t added any items to your cart yet.</p>
                                <button
                                    onClick={handleContinueShopping}
                                    className="w-full max-w-xs mx-auto bg-[#070F2B] text-white py-3.5 px-6 font-bold uppercase tracking-wider text-xs shadow-[3px_3px_0px_#B5945B] hover:bg-[#B5945B] hover:text-[#070F2B] transition-all cursor-pointer border border-[#070F2B]"
                                >
                                    Start Shopping
                                </button>
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
                                                    
                                                    {item.customization && (
                                                        <div className="text-[11px] text-gray-500 mt-1.5 space-y-0.5 border-l-2 border-[#FFCB05] pl-2">
                                                            <p><span className="font-semibold text-gray-700">Fit:</span> {item.customization.fit}</p>
                                                            <p><span className="font-semibold text-gray-700">Color:</span> {item.customization.color}</p>
                                                            <p><span className="font-semibold text-gray-700">Placement:</span> {item.customization.placement}</p>
                                                            {item.customization.customText && (
                                                                <p><span className="font-semibold text-gray-700">Text:</span> &quot;{item.customization.customText}&quot; (<span style={{ color: item.customization.textColor }}>Color</span>, {item.customization.textFont})</p>
                                                            )}
                                                            {item.customization.customImage && (
                                                                <p><span className="font-semibold text-gray-700">Logo:</span> Custom Image Uploaded</p>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Price */}
                                                    <div className="mt-2 lg:mt-3">
                                                        {item.product.discountPrice && item.product.discountPrice < item.product.price ? (
                                                            <div className="flex items-center space-x-2 lg:space-x-3">
                                                                <span className={`text-lg lg:text-xl font-semibold ${colorClasses.primary.text}`}>
                                                                    {formatPrice(item.product.discountPrice + (item.customization?.customizationPrice || 0))}
                                                                </span>
                                                                <span className="text-xs lg:text-sm text-gray-500 line-through">
                                                                    {formatPrice(item.product.price + (item.customization?.customizationPrice || 0))}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className={`text-lg lg:text-xl font-semibold ${colorClasses.primary.text}`}>
                                                                {formatPrice(item.product.price + (item.customization?.customizationPrice || 0))}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center justify-between mt-3 lg:mt-4">
                                                        <div className="flex items-center space-x-2 lg:space-x-3">
                                                            <span className={`text-xs lg:text-sm font-medium ${colorClasses.primary.text}`}>Qty:</span>
                                                            <div className="flex items-center border rounded-lg">
                                                                <button
                                                                    onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1, item.id)}
                                                                    className={`p-2 lg:p-2 hover:${colorClasses.light.bg} rounded-l-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center`}
                                                                    disabled={item.quantity <= 1}
                                                                >
                                                                    <Minus className={`w-4 h-4 ${colorClasses.primary.text}`} />
                                                                </button>
                                                                <span className={`w-12 text-center text-sm font-medium py-2 ${colorClasses.primary.text} min-h-[44px] flex items-center justify-center`}>
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1, item.id)}
                                                                    className={`p-2 lg:p-2 hover:${colorClasses.light.bg} rounded-r-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center`}
                                                                >
                                                                    <Plus className={`w-4 h-4 ${colorClasses.primary.text}`} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center space-x-2 lg:space-x-3">
                                                            <button
                                                                onClick={() => moveToSaved(item.product.id, item.size, item.id)}
                                                                className={`p-2 text-gray-400 hover:text-red-500 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center`}
                                                                title="Save for later"
                                                            >
                                                                <Heart className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => removeFromCart(item.product.id, item.size, item.id)}
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
                                                    {item.customization && (
                                                        <div className="text-[11px] text-gray-500 mt-1.5 space-y-0.5 border-l-2 border-[#FFCB05] pl-2">
                                                            <p><span className="font-semibold text-gray-700">Fit:</span> {item.customization.fit}</p>
                                                            <p><span className="font-semibold text-gray-700">Color:</span> {item.customization.color}</p>
                                                            <p><span className="font-semibold text-gray-700">Placement:</span> {item.customization.placement}</p>
                                                        </div>
                                                    )}
                                                    <div className="mt-3">
                                                        {item.product.discountPrice && item.product.discountPrice < item.product.price ? (
                                                            <div className="flex items-center space-x-3">
                                                                <span className={`text-lg font-semibold ${colorClasses.primary.text}`}>
                                                                    {formatPrice(item.product.discountPrice + (item.customization?.customizationPrice || 0))}
                                                                </span>
                                                                <span className="text-sm text-gray-500 line-through">
                                                                    {formatPrice(item.product.price + (item.customization?.customizationPrice || 0))}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className={`text-lg font-semibold ${colorClasses.primary.text}`}>
                                                                {formatPrice(item.product.price + (item.customization?.customizationPrice || 0))}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col space-y-3">
                                                    <button
                                                        onClick={() => moveToCart(item.product.id, item.size, item.id)}
                                                        className={`p-3 ${colorClasses.secondary.text} hover:${colorClasses.secondary.bg} hover:${colorClasses.primary.text} rounded-lg transition-colors`}
                                                        title="Move to cart"
                                                    >
                                                        <ArrowRight className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => removeFromSaved(item.product.id, item.size, item.id)}
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

                    {/* Cart Summary Sidebar - Order 2 on Mobile & Desktop */}
                    {totalItems > 0 && (
                        <div className="lg:col-span-1 order-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 sticky top-4 lg:top-8">
                                <h3 className={`text-base font-extrabold uppercase tracking-wide ${colorClasses.primary.text} mb-4`}>Order Summary</h3>

                                {/* Summary Details */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                                        <span className="font-bold text-[#070F2B]">{formatPrice(totalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="text-green-600 font-bold uppercase tracking-wider text-xs">Free</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-3">
                                        <div className="flex justify-between font-extrabold text-base sm:text-lg">
                                            <span className="text-[#070F2B]">Total</span>
                                            <span className="text-[#070F2B]">{formatPrice(totalAmount)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2.5">
                                    <button
                                        onClick={handleCheckout}
                                        disabled={totalItems === 0}
                                        className="w-full min-h-[48px] py-3.5 px-6 bg-[#070F2B] text-white font-bold uppercase tracking-wider text-xs shadow-[3px_3px_0px_#B5945B] hover:shadow-[0px_0px_0px_#B5945B] hover:bg-[#B5945B] hover:text-[#070F2B] border border-[#070F2B] hover:border-[#B5945B] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center"
                                    >
                                        Proceed to Checkout &rarr;
                                    </button>
                                    <button
                                        onClick={handleContinueShopping}
                                        className="w-full min-h-[44px] py-3 px-6 bg-white text-[#070F2B] font-bold uppercase tracking-wider text-xs border border-gray-300 hover:border-[#070F2B] transition-colors cursor-pointer text-center"
                                    >
                                        Continue Shopping
                                    </button>
                                    <button
                                        onClick={clearCart}
                                        className="w-full text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-700 py-2.5 transition-colors cursor-pointer text-center"
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