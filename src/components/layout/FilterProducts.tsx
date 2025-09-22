'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Star, Heart, Filter, X } from 'lucide-react';
import Link from 'next/link';
import { colorClasses } from '@/lib/constants';
import { calculateDiscount, Product } from '@/data/products';
import { productAPI } from '@/lib/api';
import { useWishlistStore } from '@/store';
import WishlistConfirmationModal from '@/components/wishlist/WishlistConfirmationModal';

const categories = ["All", "casual", "formal", "ethnic", "sports"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const priceRanges = [
    { label: "Under ₹500", min: 0, max: 500 },
    { label: "₹500 - ₹1000", min: 500, max: 1000 },
    { label: "₹1000 - ₹2000", min: 1000, max: 2000 }
];

export default function FilterProducts() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
    const [showMoreProducts, setShowMoreProducts] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [showWishlistModal, setShowWishlistModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Wishlist functionality
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

    // Fetch products from API with pagination
    useEffect(() => {
        const fetchProducts = async (page = 1, append = false) => {
            try {
                if (page === 1) {
                    setIsLoading(true);
                } else {
                    setIsLoadingMore(true);
                }
                setError(null);

                const response = await productAPI.getAllProducts({
                    page,
                    limit: 12
                });

                if (response.success) {
                    const newProducts = response.data.products;
                    if (append) {
                        setProducts(prev => [...prev, ...newProducts]);
                    } else {
                        setProducts(newProducts);
                    }
                    setHasMore(newProducts.length === 12);
                    setCurrentPage(page);
                }
            } catch (err) {
                setError('Failed to load products');
                console.error('Error fetching products:', err);
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
            }
        };

        fetchProducts();
    }, []);

    // Load more products
    const loadMoreProducts = async () => {
        if (isLoadingMore || !hasMore) return;

        try {
            setIsLoadingMore(true);
            const response = await productAPI.getAllProducts({
                page: currentPage + 1,
                limit: 12
            });

            if (response.success) {
                const newProducts = response.data.products;
                setProducts(prev => [...prev, ...newProducts]);
                setHasMore(newProducts.length === 12);
                setCurrentPage(prev => prev + 1);
            }
        } catch (err) {
            console.error('Error loading more products:', err);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategory === "All" || product.category.toLowerCase() === selectedCategory.toLowerCase();
        const sizeMatch = selectedSizes.length === 0 || selectedSizes.some(size => product.size.includes(size));
        const priceMatch = !selectedPriceRange || (() => {
            const range = priceRanges.find(r => r.label === selectedPriceRange);
            return range && product.price >= range.min && product.price <= range.max;
        })();

        return categoryMatch && sizeMatch && priceMatch;
    });

    // Remove the old pagination logic since we're using infinite scroll
    // const displayedProducts = showMoreProducts ? filteredProducts : filteredProducts.slice(0, 6);

    const toggleSize = (size: string) => {
        setSelectedSizes(prev =>
            prev.includes(size)
                ? prev.filter(s => s !== size)
                : [...prev, size]
        );
    };

    const openMobileFilters = () => {
        setShowMobileFilters(true);
    };

    const closeMobileFilters = () => {
        setShowMobileFilters(false);
    };

    // Wishlist toggle function
    const handleWishlistToggle = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        e.stopPropagation();

        const defaultSize = product.size[0] || 'M';
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
                brand: product.brand
            }, defaultSize);

            // Show confirmation modal
            setSelectedProduct(product);
            setShowWishlistModal(true);
        }
    };

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

    return (
        <div className="mx-auto">
            {/* Mobile Filter Button */}
            <div className="md:hidden mb-4">
                <button
                    onClick={openMobileFilters}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                    <Filter className="w-4 h-4 text-gray-900" />
                    <span className="text-gray-900">Filters</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {[selectedCategory !== "All" ? 1 : 0, selectedSizes.length, selectedPriceRange ? 1 : 0].reduce((a, b) => a + b, 0)}
                    </span>
                </button>
            </div>

            <div className="flex gap-4 md:flex-row md:gap-8">
                {/* Filter Sidebar - Hidden on mobile, visible on desktop */}
                <div className="hidden md:block w-1/4">
                    <div className="bg-white rounded-lg shadow-md border p-6 sticky top-20">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                            <Filter className="w-5 h-5 text-gray-900" />
                        </div>

                        {/* Category Filter */}
                        <div className="mb-6">
                            <h4 className="font-medium mb-3 text-gray-900">Category</h4>
                            <div className="space-y-2">
                                {categories.map(category => (
                                    <label key={category} className="flex items-center gap-2 cursor-pointer text-gray-900">
                                        <input
                                            type="radio"
                                            name="category"
                                            value={category}
                                            checked={selectedCategory === category}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-sm text-gray-900">{category}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Size Filter */}
                        <div className="mb-6">
                            <h4 className="font-medium mb-3 text-gray-900">Size</h4>
                            <div className="grid md:grid-cols-3 gap-2">
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => toggleSize(size)}
                                        className={`px-3 py-2 text-sm rounded border transition-colors ${selectedSizes.includes(size)
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-900 border-gray-300 hover:border-blue-600'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div className="mb-6">
                            <h4 className="font-medium mb-3 text-gray-900">Price Range</h4>
                            <div className="space-y-2">
                                {priceRanges.map(range => (
                                    <label key={range.label} className="flex items-center gap-2 cursor-pointer text-gray-900">
                                        <input
                                            type="radio"
                                            name="priceRange"
                                            value={range.label}
                                            checked={selectedPriceRange === range.label}
                                            onChange={(e) => setSelectedPriceRange(e.target.value)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-sm text-gray-900">{range.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Clear Filters */}
                        <button
                            onClick={() => {
                                setSelectedCategory("All");
                                setSelectedSizes([]);
                                setSelectedPriceRange("");
                            }}
                            className="w-full p-1 md:py-2 md:px-4 border border-gray-300 rounded-md text-sm text-gray-900 hover:border-blue-600 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Products Grid - Full width on mobile, 3/4 on desktop */}
                <div className="w-full md:w-3/4">
                    {/* Results Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Trending Products</h2>
                            <p className="text-gray-600">{filteredProducts.length} products found</p>
                        </div>
                    </div>

                    {/* Products Grid - Mobile optimized */}
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                        {filteredProducts.map(product => (
                            <Link
                                key={product.id}
                                href={`/products/${product.category}/${product.id}`}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                            >
                                {/* Product Image - Mobile optimized */}
                                <div className="relative aspect-square bg-gray-200">
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

                                {/* Product Details - Mobile optimized */}
                                <div className="p-2">
                                    {/* Rating - Hidden on mobile to save space */}
                                    <div className="hidden md:flex items-center mb-1">
                                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                        <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                                    </div>

                                    {/* Brand and Name */}
                                    <div className="mb-1">
                                        <p className="font-semibold text-xs text-gray-800 truncate">{product.brand}</p>
                                        <p className="text-xs text-gray-600 truncate">{product.name}</p>
                                    </div>

                                    {/* Price and Like - Mobile optimized */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-xs text-black">₹{product.price}</span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                                                <span className="text-xs text-green-600 font-semibold">
                                                    {calculateDiscount(product.originalPrice, product.price)}% OFF
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className={`w-4 h-4 md:w-5 md:h-5 cursor-pointer transition-colors ${isInWishlist(product.id, product.size[0] || 'M')
                                                ? 'text-red-500'
                                                : 'text-gray-400 hover:text-red-500'
                                                }`}
                                            onClick={(e) => handleWishlistToggle(e, product)}
                                        >
                                            <Heart
                                                className={`w-4 h-4 md:w-5 md:h-5 ${isInWishlist(product.id, product.size[0] || 'M')
                                                    ? 'fill-current'
                                                    : 'fill-none'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Infinite Scroll Load More */}
                    {hasMore && (
                        <div className="text-center mt-8">
                            <button
                                onClick={loadMoreProducts}
                                disabled={isLoadingMore}
                                className={`px-8 py-3 rounded-md transition-colors ${colorClasses.primary.bg} text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isLoadingMore ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Loading...
                                    </div>
                                ) : (
                                    'Load More Products'
                                )}
                            </button>
                        </div>
                    )}

                    {/* Loading More Indicator */}
                    {isLoadingMore && (
                        <div className="text-center py-4">
                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-gray-600">Loading more products...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <>
                {/* Overlay */}
                {showMobileFilters && (
                    <div
                        className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-40"
                        onClick={closeMobileFilters}
                    />
                )}

                {/* Mobile Filter Drawer */}
                <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out overflow-x-hidden ${showMobileFilters ? 'translate-x-0' : 'translate-x-full'
                    }`}>
                    <div className="p-6">
                        {/* Close Button */}
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={closeMobileFilters}
                                className="p-2 rounded-full"
                            >
                                <X className="w-6 h-6 text-gray-900" />
                            </button>
                        </div>

                        {/* Header */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                        </div>

                        {/* Category Filter */}
                        <div className="mb-6">
                            <h4 className="font-medium mb-3 text-gray-900">Category</h4>
                            <div className="space-y-2">
                                {categories.map(category => (
                                    <label key={category} className="flex items-center gap-2 cursor-pointer text-gray-900">
                                        <input
                                            type="radio"
                                            name="category"
                                            value={category}
                                            checked={selectedCategory === category}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-sm text-gray-900">{category}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Size Filter */}
                        <div className="mb-6">
                            <h4 className="font-medium mb-3 text-gray-900">Size</h4>
                            <div className="grid grid-cols-3 gap-2">
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => toggleSize(size)}
                                        className={`px-3 py-2 text-sm rounded border transition-colors ${selectedSizes.includes(size)
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-900 border-gray-300 hover:border-blue-600'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div className="mb-6">
                            <h4 className="font-medium mb-3 text-gray-900">Price Range</h4>
                            <div className="space-y-2">
                                {priceRanges.map(range => (
                                    <label key={range.label} className="flex items-center gap-2 cursor-pointer text-gray-900">
                                        <input
                                            type="radio"
                                            name="priceRange"
                                            value={range.label}
                                            checked={selectedPriceRange === range.label}
                                            onChange={(e) => setSelectedPriceRange(e.target.value)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-sm text-gray-900">{range.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    setSelectedCategory("All");
                                    setSelectedSizes([]);
                                    setSelectedPriceRange("");
                                }}
                                className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm text-gray-900 hover:border-blue-600 transition-colors"
                            >
                                Clear Filters
                            </button>

                            <button
                                onClick={closeMobileFilters}
                                className="w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            </>

            {/* Wishlist Confirmation Modal */}
            <WishlistConfirmationModal
                isOpen={showWishlistModal}
                onClose={() => setShowWishlistModal(false)}
                onGoToWishlist={() => {
                    setShowWishlistModal(false);
                    window.location.href = '/wishlist';
                }}
                productName={selectedProduct?.name || ''}
            />
        </div>
    );
} 