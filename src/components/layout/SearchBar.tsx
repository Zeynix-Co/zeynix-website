'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Clock, TrendingUp, ShoppingCart, Heart } from 'lucide-react';
import { colorClasses } from '@/lib/constants';
import { productAPI } from '@/lib/api';
import useCartStore from '@/store/cartStore';
import { useAuthStore } from '@/store';

interface Product {
    id: string;
    name: string;
    images: string[];
    price: number;
    originalPrice: number;
    category: string;
    brand: string;
}

interface SearchSuggestion {
    type: 'product' | 'category' | 'brand';
    id: string;
    title: string;
    subtitle?: string;
    image?: string;
    price?: number;
    discountPrice?: number;
    category?: string; // Add category for products
}

export default function SearchBar() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { addToCart, isInCart } = useCartStore();

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [activeIndex, setActiveIndex] = useState(-1);

    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load search history from localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem('search-history');
        if (savedHistory) {
            try {
                setSearchHistory(JSON.parse(savedHistory));
            } catch (error) {
                console.error('Error loading search history:', error);
            }
        }
    }, []);

    // Save search history to localStorage
    const saveSearchHistory = useCallback((searchTerm: string) => {
        if (!searchTerm.trim()) return;

        setSearchHistory(prev => {
            const newHistory = [searchTerm, ...prev.filter(item => item !== searchTerm)].slice(0, 10);
            localStorage.setItem('search-history', JSON.stringify(newHistory));
            return newHistory;
        });
    }, []);

    // Debounce utility function
    function debounce<T extends (...args: unknown[]) => unknown>(
        func: T,
        wait: number
    ): (...args: Parameters<T>) => void {
        let timeout: NodeJS.Timeout;
        return (...args: Parameters<T>) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (searchTerm: unknown) => {
            if (typeof searchTerm !== 'string' || !searchTerm.trim()) {
                setSuggestions([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                // Search products
                const productResponse = await productAPI.searchProducts(searchTerm, {
                    page: 1,
                    limit: 5
                });

                const productSuggestions: SearchSuggestion[] = [];

                if (productResponse.success && productResponse.data.products) {
                    productResponse.data.products.forEach((product: Product) => {
                        productSuggestions.push({
                            type: 'product',
                            id: product.id,
                            title: product.name,
                            subtitle: `${product.brand} • ${product.category}`,
                            image: product.images[0],
                            price: product.price,
                            discountPrice: product.originalPrice > product.price ? product.originalPrice : undefined,
                            category: product.category
                        });
                    });
                } else {
                    // Fallback to mock data if API fails
                    try {
                        const { mockProducts } = await import('@/data/products');
                        const filteredProducts = mockProducts.filter(product =>
                            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.category.toLowerCase().includes(searchTerm.toLowerCase())
                        );

                        filteredProducts.slice(0, 5).forEach((product: Product) => {
                            productSuggestions.push({
                                type: 'product',
                                id: product.id,
                                title: product.name,
                                subtitle: `${product.brand} • ${product.category}`,
                                image: product.images[0],
                                price: product.price,
                                discountPrice: product.originalPrice > product.price ? product.originalPrice : undefined,
                                category: product.category
                            });
                        });
                    } catch (fallbackErr) {
                        console.error('Fallback data loading failed:', fallbackErr);
                    }
                }

                // Add category suggestions
                const categories = ['casual', 'formal', 'ethnic', 'sports'];
                const categoryMatches = categories.filter(cat =>
                    cat.toLowerCase().includes(searchTerm.toLowerCase())
                );

                categoryMatches.forEach(cat => {
                    productSuggestions.push({
                        type: 'category',
                        id: cat,
                        title: `${cat.charAt(0).toUpperCase() + cat.slice(1)} Wear`,
                        subtitle: 'Browse category'
                    });
                });

                // Add brand suggestions
                const brands = ['Zeynix', 'Nike', 'Adidas', 'Puma'];
                const brandMatches = brands.filter(brand =>
                    brand.toLowerCase().includes(searchTerm.toLowerCase())
                );

                brandMatches.forEach(brand => {
                    productSuggestions.push({
                        type: 'brand',
                        id: brand,
                        title: brand,
                        subtitle: 'Browse brand'
                    });
                });

                setSuggestions(productSuggestions);
            } catch (error) {
                console.error('Search error:', error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        }, 300),
        []
    );

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setActiveIndex(-1);

        if (value.trim()) {
            debouncedSearch(value);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Handle search submission
    const handleSearch = (searchTerm?: string) => {
        const term = searchTerm || query.trim();
        if (!term) return;

        saveSearchHistory(term);
        setShowSuggestions(false);
        setQuery('');

        // Navigate to search results
        router.push(`/search?q=${encodeURIComponent(term)}`);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (activeIndex >= 0) {
                    handleSuggestionClick(suggestions[activeIndex]);
                } else {
                    handleSearch();
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setActiveIndex(-1);
                break;
        }
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
        switch (suggestion.type) {
            case 'product':
                // For products, navigate to the correct category/product route
                if (suggestion.category) {
                    router.push(`/products/${suggestion.category.toLowerCase()}/${suggestion.id}`);
                } else {
                    // Fallback: try to extract category from subtitle or use default
                    const categoryMatch = suggestion.subtitle?.match(/•\s*(\w+)/);
                    const category = categoryMatch ? categoryMatch[1].toLowerCase() : 'ethnic';
                    router.push(`/products/${category}/${suggestion.id}`);
                }
                break;
            case 'category':
                router.push(`/products/${suggestion.id}`);
                break;
            case 'brand':
                router.push(`/search?brand=${encodeURIComponent(suggestion.title)}`);
                break;
        }
        setShowSuggestions(false);
        setQuery('');
    };

    // Handle quick add to cart
    const handleQuickAddToCart = async (e: React.MouseEvent, productId: string, size: string = 'M') => {
        e.stopPropagation();

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        try {
            // Get product details
            const response = await productAPI.getProduct(productId);
            if (response.success) {
                const product = response.data;
                addToCart({
                    product: {
                        id: product.id,
                        title: product.name,
                        images: product.images,
                        price: product.price,
                        discountPrice: product.originalPrice > product.price ? product.originalPrice : undefined
                    },
                    size: size as 'M' | 'L' | 'XL' | 'XXL' | 'XXXL',
                    quantity: 1,
                    totalPrice: (product.originalPrice > product.price ? product.originalPrice : product.price) * 1
                });
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    // Handle quick add to wishlist
    const handleQuickAddToWishlist = (e: React.MouseEvent, productId: string) => {
        e.stopPropagation();

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        // TODO: Implement wishlist functionality
        console.log('Add to wishlist:', productId);
    };

    // Clear search history
    const clearSearchHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem('search-history');
    };

    // Remove specific search history item
    const removeSearchHistoryItem = (index: number) => {
        setSearchHistory(prev => {
            const newHistory = prev.filter((_, i) => i !== index);
            localStorage.setItem('search-history', JSON.stringify(newHistory));
            return newHistory;
        });
    };

    // Click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
                setActiveIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    return (
        <div className="relative w-full max-w-md" ref={searchRef}>
            <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${colorClasses.secondary.text} w-5 h-5`} />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search products, brands, categories..."
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (query.trim() || searchHistory.length > 0) {
                            setShowSuggestions(true);
                        }
                    }}
                    className={`w-full ${colorClasses.light.bg} text-gray-700 px-10 py-2 rounded-lg focus:outline-none focus:ring-2 ${colorClasses.secondary.ring} transition-all duration-200`}
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            setSuggestions([]);
                            setShowSuggestions(false);
                            inputRef.current?.focus();
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                    {/* Search Results */}
                    {query.trim() && (
                        <div className="p-3 border-b border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-700">Search Results</h3>
                                {isLoading && (
                                    <div className="text-sm text-gray-500">Searching...</div>
                                )}
                            </div>

                            {suggestions.length > 0 ? (
                                <div className="space-y-2">
                                    {suggestions.map((suggestion, index) => (
                                        <div
                                            key={`${suggestion.type}-${suggestion.id}`}
                                            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${index === activeIndex ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                                                }`}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            {/* Product Image */}
                                            {suggestion.image && (
                                                <img
                                                    src={suggestion.image}
                                                    alt={suggestion.title}
                                                    className="w-12 h-12 object-cover rounded-md"
                                                />
                                            )}

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-900 truncate">
                                                    {suggestion.title}
                                                </div>
                                                {suggestion.subtitle && (
                                                    <div className="text-xs text-gray-500 truncate">
                                                        {suggestion.subtitle}
                                                    </div>
                                                )}
                                                {suggestion.price && (
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {formatPrice(suggestion.discountPrice || suggestion.price)}
                                                        {suggestion.discountPrice && suggestion.discountPrice < suggestion.price && (
                                                            <span className="text-xs text-gray-500 line-through ml-2">
                                                                {formatPrice(suggestion.price)}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Quick Actions for Products */}
                                            {suggestion.type === 'product' && (
                                                <div className="flex items-center space-x-1">
                                                    <button
                                                        onClick={(e) => handleQuickAddToWishlist(e, suggestion.id)}
                                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                        title="Add to wishlist"
                                                    >
                                                        <Heart className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleQuickAddToCart(e, suggestion.id)}
                                                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                                                        title="Add to cart"
                                                    >
                                                        <ShoppingCart className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : !isLoading && (
                                <div className="text-sm text-gray-500 py-4 text-center">
                                    No results found for &quot;{query}&quot;
                                </div>
                            )}
                        </div>
                    )}

                    {/* Search History */}
                    {!query.trim() && searchHistory.length > 0 && (
                        <div className="p-3">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    Recent Searches
                                </h3>
                                <button
                                    onClick={clearSearchHistory}
                                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    Clear all
                                </button>
                            </div>

                            <div className="space-y-1">
                                {searchHistory.map((term, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
                                    >
                                        <button
                                            onClick={() => handleSearch(term)}
                                            className="flex-1 text-left text-sm text-gray-700 hover:text-gray-900 transition-colors"
                                        >
                                            {term}
                                        </button>
                                        <button
                                            onClick={() => removeSearchHistoryItem(index)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Trending Searches */}
                    {!query.trim() && (
                        <div className="p-3 border-t border-gray-100">
                            <h3 className="text-sm font-medium text-gray-700 flex items-center mb-2">
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Trending
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {['casual wear', 'formal shirts', 'ethnic kurtas', 'sports shoes'].map((term) => (
                                    <button
                                        key={term}
                                        onClick={() => handleSearch(term)}
                                        className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
