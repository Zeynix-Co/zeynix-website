'use client';

import { useState, useEffect, useRef, memo } from 'react';
import { Search, X, TrendingUp, Clock, Star } from 'lucide-react';
import { Product } from '@/data/products';
import { colorClasses } from '@/lib/constants';

interface ProductSearchProps {
    onSearch: (query: string) => void;
    onClear: () => void;
    placeholder?: string;
    className?: string;
    products?: Product[];
}

interface SearchSuggestion {
    type: 'product' | 'category' | 'brand';
    text: string;
    count?: number;
    icon?: React.ReactNode;
}

export default memo(function ProductSearch({
    onSearch,
    onClear,
    placeholder = "Search products...",
    className = "",
    products = []
}: ProductSearchProps) {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [trendingSearches] = useState([
        'Kurta', 'Formal Shirt', 'Casual Wear', 'Ethnic Dress', 'Sports Wear'
    ]);

    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recent-searches');
        if (saved && saved !== 'null') {
            try {
                setRecentSearches(JSON.parse(saved));
            } catch (error) {
                console.error('Error loading recent searches:', error);
            }
        }
    }, []);

    // Generate search suggestions
    useEffect(() => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        const queryLower = query.toLowerCase();
        const newSuggestions: SearchSuggestion[] = [];

        // Product name suggestions
        const productMatches = products
            .filter(p => p.name.toLowerCase().includes(queryLower))
            .slice(0, 3)
            .map(p => ({
                type: 'product' as const,
                text: p.name,
                count: 1,
                icon: <Search className="w-4 h-4" />
            }));

        // Category suggestions
        const categories = Array.from(new Set(products.map(p => p.category)));
        const categoryMatches = categories
            .filter(cat => cat.toLowerCase().includes(queryLower))
            .slice(0, 2)
            .map(cat => ({
                type: 'category' as const,
                text: cat,
                count: products.filter(p => p.category === cat).length,
                icon: <TrendingUp className="w-4 h-4" />
            }));

        // Brand suggestions
        const brands = Array.from(new Set(products.map(p => p.brand)));
        const brandMatches = brands
            .filter(brand => brand.toLowerCase().includes(queryLower))
            .slice(0, 2)
            .map(brand => ({
                type: 'brand' as const,
                text: brand,
                count: products.filter(p => p.brand === brand).length,
                icon: <Star className="w-4 h-4" />
            }));

        newSuggestions.push(...productMatches, ...categoryMatches, ...brandMatches);
        setSuggestions(newSuggestions);
    }, [query, products]);

    // Debounced search
    useEffect(() => {
        console.log('🔍 ProductSearch useEffect running:', { query, onSearch: !!onSearch, onClear: !!onClear });

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (query.trim()) {
            setIsSearching(true);
            searchTimeoutRef.current = setTimeout(() => {
                console.log('🔍 ProductSearch calling onSearch:', query.trim());
                onSearch(query.trim());
                setIsSearching(false);

                // Save to recent searches
                if (query.trim() && !recentSearches.includes(query.trim())) {
                    const newRecent = [query.trim(), ...recentSearches.slice(0, 4)];
                    setRecentSearches(newRecent);
                    localStorage.setItem('recent-searches', JSON.stringify(newRecent));
                }
            }, 300);
        } else {
            setIsSearching(false);
            onClear();
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [query, onSearch, onClear, recentSearches]);

    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery);
        setShowSuggestions(false);
        inputRef.current?.blur();
    };

    const handleClear = () => {
        setQuery('');
        setShowSuggestions(false);
        onClear();
        inputRef.current?.focus();
    };

    const handleInputFocus = () => {
        if (query.trim() || recentSearches.length > 0 || trendingSearches.length > 0) {
            setShowSuggestions(true);
        }
    };

    const handleInputBlur = () => {
        // Delay hiding suggestions to allow clicking on them
        setTimeout(() => setShowSuggestions(false), 200);
    };

    const removeRecentSearch = (search: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newRecent = recentSearches.filter(s => s !== search);
        setRecentSearches(newRecent);
        localStorage.setItem('recent-searches', JSON.stringify(newRecent));
    };

    return (
        <div className={`relative ${className}`}>
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />

                {/* Clear Button */}
                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </button>
                )}

                {/* Loading Indicator */}
                {isSearching && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                )}
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    {/* Search Suggestions */}
                    {suggestions.length > 0 && (
                        <div className="p-3 border-b border-gray-100">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Suggestions</h4>
                            <div className="space-y-1">
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSearch(suggestion.text)}
                                        className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md transition-colors text-left"
                                    >
                                        <span className="text-gray-400">{suggestion.icon}</span>
                                        <span className="flex-1 text-sm text-gray-700">
                                            {suggestion.text}
                                        </span>
                                        {suggestion.count && suggestion.count > 1 && (
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                {suggestion.count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                        <div className="p-3 border-b border-gray-100">
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                Recent Searches
                            </h4>
                            <div className="space-y-1">
                                {recentSearches.map((search, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md group">
                                        <button
                                            onClick={() => handleSearch(search)}
                                            className="flex-1 text-sm text-gray-700 text-left"
                                        >
                                            {search}
                                        </button>
                                        <button
                                            onClick={(e) => removeRecentSearch(search, e)}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full transition-all"
                                        >
                                            <X className="w-3 h-3 text-gray-400" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Trending Searches */}
                    <div className="p-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Trending
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {trendingSearches.map((trend, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSearch(trend)}
                                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                                >
                                    {trend}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});
