'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    Filter,
    X,
    Check,
    ChevronDown,
    SlidersHorizontal,
    RotateCcw,
    Sparkles,
    ArrowUpDown,
    Shirt,
    Tag,
    Flame
} from 'lucide-react';
import { Product } from '@/data/products';
import { productAPI } from '@/lib/api';
import { useWishlistStore } from '@/store';
import WishlistConfirmationModal from '@/components/wishlist/WishlistConfirmationModal';
import ProductCard from '@/components/product/ProductCard';

export const FILTER_CATEGORIES = [
    { id: 'All', label: 'All Drops', badge: 'Complete Drop' },
    { id: 'Streetwear', label: 'Streetwear Graphic', badge: '240 GSM' },
    { id: 'Gothic', label: 'Gothic & Dark Art', badge: 'Viper & Skulls' },
    { id: 'Bollywood', label: 'Bollywood & Desi', badge: 'Cult Cinema' },
    { id: 'PopCulture', label: 'Pop Culture & Motors', badge: 'Cars & Retro' },
    { id: 'Halloween', label: 'Halloween Edition', badge: 'Limited Edition' },
    { id: 'Anime', label: 'Anime & Manga', badge: 'DBZ & Pokemon' },
    { id: 'Japanese', label: 'Japanese Aesthetic', badge: 'Samurai & Bonsai' },
];

export const FILTER_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const FILTER_PRICE_RANGES = [
    { id: 'all', label: 'All Prices', min: 0, max: Infinity },
    { id: 'under-600', label: 'Under ₹600', sublabel: 'Launch Deals (₹549)', min: 0, max: 599 },
    { id: '600-750', label: '₹600 – ₹750', sublabel: 'Flagship Oversized (₹699)', min: 600, max: 750 },
];

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating-desc' | 'name-asc';

function matchesCategory(product: Product, categoryId: string): boolean {
    if (categoryId === 'All') return true;
    if (categoryId === 'Streetwear') return true;

    const text = `${product.name} ${product.title || ''} ${product.description || ''} ${product.category || ''} ${product.subcategory || ''}`.toLowerCase();

    switch (categoryId) {
        case 'Anime':
            return /anime|dragon ball|goku|buu|pikachu|pokemon|squirtle|kanagawa/.test(text);
        case 'Bollywood':
            return /majnu|race|om shanti|srk|talha|gumaan|stunners|katkat|patola|mera yaar|desi|bollywood/.test(text);
        case 'Gothic':
            return /gothic|insanity|viper|demon|doberman|chained|rage|cemetery|veni vidi|skull|noir|dark/.test(text);
        case 'Japanese':
            return /samurai|zen|fuji|sakura|bonsai|koi|japanese|kanagawa/.test(text);
        case 'Halloween':
            return /halloween|boo|ghost|phantom|haunted|horror|dead|spookie/.test(text);
        case 'PopCulture':
            return /mcqueen|porsche|vice city|gta|mickey|tom and jerry|cartoon|minions|spider-man|marvel|tony stark|looney/.test(text);
        default:
            return text.includes(categoryId.toLowerCase());
    }
}

function matchesSizes(product: Product, selectedSizes: string[]): boolean {
    if (selectedSizes.length === 0) return true;

    if (Array.isArray(product.sizes) && product.sizes.length > 0) {
        return selectedSizes.some(size =>
            product.sizes?.some(s => s.size.toUpperCase() === size.toUpperCase() && s.inStock !== false)
        );
    }

    if (Array.isArray(product.size) && product.size.length > 0) {
        return selectedSizes.some(size =>
            product.size.some(s => s.toUpperCase() === size.toUpperCase())
        );
    }

    return true;
}

interface FilterProductsProps {
    searchQuery?: string;
}

export default function FilterProducts({ searchQuery: propSearchQuery }: FilterProductsProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const urlCategory = searchParams?.get('category') || '';
    const urlQuery = propSearchQuery ?? (searchParams?.get('q') || '');

    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
    const [sortBy, setSortBy] = useState<SortOption>('featured');

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [showWishlistModal, setShowWishlistModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Sync with URL category parameter if present
    useEffect(() => {
        if (urlCategory) {
            const matched = FILTER_CATEGORIES.find(c => c.id.toLowerCase() === urlCategory.toLowerCase());
            if (matched) {
                setSelectedCategory(matched.id);
            }
        }
    }, [urlCategory]);

    // Fetch full catalog of products
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await productAPI.getAllProducts({
                    page: 1,
                    limit: 100
                });

                if (response.success && response.data?.products) {
                    setProducts(response.data.products);
                } else {
                    setError('Failed to load catalog');
                }
            } catch (err) {
                console.error('Error fetching catalog:', err);
                setError('Failed to load products. Please check your connection.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllProducts();
    }, []);

    // Toggle size filter
    const toggleSize = (size: string) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    // Reset all filters
    const clearAllFilters = () => {
        setSelectedCategory('All');
        setSelectedSizes([]);
        setSelectedPriceRange('all');
        setSortBy('featured');

        // Clear query param if present
        if (urlQuery) {
            router.push('/products');
        }
    };

    const hasActiveFilters =
        selectedCategory !== 'All' ||
        selectedSizes.length > 0 ||
        selectedPriceRange !== 'all' ||
        Boolean(urlQuery.trim()) ||
        sortBy !== 'featured';

    const activeFilterCount =
        (selectedCategory !== 'All' ? 1 : 0) +
        selectedSizes.length +
        (selectedPriceRange !== 'all' ? 1 : 0) +
        (urlQuery.trim() ? 1 : 0);

    // Dynamic counts per category
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const cat of FILTER_CATEGORIES) {
            counts[cat.id] = products.filter(p => matchesCategory(p, cat.id)).length;
        }
        return counts;
    }, [products]);

    // Dynamic counts per price range
    const priceCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const range of FILTER_PRICE_RANGES) {
            if (range.id === 'all') {
                counts[range.id] = products.length;
            } else {
                counts[range.id] = products.filter(p => p.price >= range.min && p.price <= range.max).length;
            }
        }
        return counts;
    }, [products]);

    // Filtered & Sorted products
    const filteredProducts = useMemo(() => {
        const priceConfig = FILTER_PRICE_RANGES.find(r => r.id === selectedPriceRange);

        const filtered = products.filter(product => {
            // Category check
            const categoryMatch = matchesCategory(product, selectedCategory);

            // Size check
            const sizeMatch = matchesSizes(product, selectedSizes);

            // Price check
            const priceMatch =
                !priceConfig ||
                priceConfig.id === 'all' ||
                (product.price >= priceConfig.min && product.price <= priceConfig.max);

            // URL Search query check
            const queryMatch =
                !urlQuery.trim() ||
                (() => {
                    const q = urlQuery.toLowerCase().trim();
                    const searchable = `${product.name} ${product.title || ''} ${product.description || ''} ${product.brand || ''} ${product.category || ''}`.toLowerCase();
                    return searchable.includes(q);
                })();

            return categoryMatch && sizeMatch && priceMatch && queryMatch;
        });

        // Sorting
        const sorted = [...filtered];
        switch (sortBy) {
            case 'price-asc':
                return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
            case 'price-desc':
                return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
            case 'rating-desc':
                return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case 'name-asc':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'featured':
            default:
                return sorted;
        }
    }, [products, selectedCategory, selectedSizes, selectedPriceRange, urlQuery, sortBy]);

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center py-20 min-h-[400px]">
                <div className="relative w-12 h-12 mb-4">
                    <div className="absolute inset-0 rounded-full border-3 border-[#070F2B]/10"></div>
                    <div className="absolute inset-0 rounded-full border-3 border-[#B5945B] border-t-transparent animate-spin"></div>
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-[#070F2B]/80">Loading Zeynix Catalog...</p>
                <p className="text-[11px] text-gray-400 mt-1">Preparing 57 exclusive streetwear fits</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-red-100 max-w-lg mx-auto shadow-sm my-8">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <X className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#070F2B] uppercase tracking-wide">Unable to Load Catalog</h3>
                <p className="text-xs text-gray-500 mt-1 mb-5">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2.5 bg-[#070F2B] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#B5945B] hover:text-[#070F2B] transition-colors cursor-pointer"
                >
                    Retry Loading
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full">
            {/* Top Bar for Mobile & Tablet Filters */}
            <div className="md:hidden mb-5 flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#070F2B]/10 shadow-xs">
                <button
                    onClick={() => setShowMobileFilters(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#070F2B] text-white rounded-xl shadow-xs hover:bg-[#B5945B] hover:text-[#070F2B] transition-all cursor-pointer font-black text-xs uppercase tracking-wider"
                >
                    <SlidersHorizontal className="w-4 h-4 text-[#FFCB05]" />
                    <span>Filter & Refine</span>
                    {activeFilterCount > 0 && (
                        <span className="bg-[#FFCB05] text-[#070F2B] text-[10px] font-black px-2 py-0.5 rounded-full ml-1">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {/* Mobile Sort Dropdown */}
                <div className="relative shrink-0">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="appearance-none bg-gray-50 border border-gray-200 text-[#070F2B] text-xs font-bold py-2.5 pl-3 pr-8 rounded-xl cursor-pointer focus:outline-none focus:border-[#070F2B]"
                        aria-label="Sort products on mobile"
                    >
                        <option value="featured">Featured Drops</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="rating-desc">Top Rated</option>
                        <option value="name-asc">Name: A to Z</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
                {/* =========================================================================
                    DESKTOP FILTER SIDEBAR
                   ========================================================================= */}
                <aside className="hidden md:block w-72 lg:w-80 shrink-0 sticky top-24">
                    <div className="bg-white rounded-2xl border border-[#070F2B]/10 p-5 lg:p-6 shadow-[0_4px_20px_rgba(7,15,43,0.04)] space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
                        {/* Sidebar Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-[#070F2B] flex items-center justify-center text-[#FFCB05] shadow-xs">
                                    <Filter className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-[#070F2B] uppercase tracking-wider">Filters</h3>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                                        {filteredProducts.length} pieces found
                                    </span>
                                </div>
                            </div>

                            {hasActiveFilters && (
                                <button
                                    onClick={clearAllFilters}
                                    className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-rose-600 hover:text-rose-800 transition-colors cursor-pointer bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg"
                                    title="Reset all filters"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Reset</span>
                                </button>
                            )}
                        </div>

                        {/* 1. Category Filter */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[11px] font-black uppercase tracking-widest text-[#B5945B]">
                                    Collections
                                </span>
                                <span className="text-[10px] text-gray-400 font-semibold">
                                    {FILTER_CATEGORIES.length} options
                                </span>
                            </div>

                            <div className="space-y-1.5">
                                {FILTER_CATEGORIES.map(category => {
                                    const isSelected = selectedCategory === category.id;
                                    const count = categoryCounts[category.id] || 0;

                                    return (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left group ${
                                                isSelected
                                                    ? 'bg-[#070F2B] text-white shadow-xs'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#070F2B]'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-[#FFCB05]' : 'bg-transparent group-hover:bg-[#B5945B]'}`} />
                                                <span className="truncate">{category.label}</span>
                                            </div>
                                            <span
                                                className={`text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                                                    isSelected
                                                        ? 'bg-white/15 text-[#FFCB05] font-black'
                                                        : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                                                }`}
                                            >
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 2. Size Filter */}
                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[11px] font-black uppercase tracking-widest text-[#B5945B]">
                                    Available Sizes
                                </span>
                                {selectedSizes.length > 0 && (
                                    <button
                                        onClick={() => setSelectedSizes([])}
                                        className="text-[10px] font-bold text-gray-400 hover:text-rose-600 transition-colors"
                                    >
                                        Clear sizes
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {FILTER_SIZES.map(size => {
                                    const isSelected = selectedSizes.includes(size);
                                    return (
                                        <button
                                            key={size}
                                            onClick={() => toggleSize(size)}
                                            className={`py-2 px-2 text-xs font-black rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                                isSelected
                                                    ? 'bg-[#070F2B] text-white border-[#070F2B] shadow-xs ring-2 ring-[#B5945B]/40'
                                                    : 'bg-[#FAF8F5] text-gray-700 border-gray-200 hover:border-[#070F2B] hover:bg-white'
                                            }`}
                                        >
                                            {isSelected && <Check className="w-3 h-3 text-[#FFCB05]" />}
                                            <span>{size}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium mt-2">
                                Standard unisex oversized silhouette
                            </p>
                        </div>

                        {/* 3. Price Range Filter */}
                        <div className="pt-4 border-t border-gray-100">
                            <span className="text-[11px] font-black uppercase tracking-widest text-[#B5945B] block mb-3">
                                Price Range
                            </span>

                            <div className="space-y-2">
                                {FILTER_PRICE_RANGES.map(range => {
                                    const isSelected = selectedPriceRange === range.id;
                                    const count = priceCounts[range.id] || 0;

                                    return (
                                        <label
                                            key={range.id}
                                            className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                                                isSelected
                                                    ? 'border-[#070F2B] bg-[#070F2B]/5 shadow-2xs'
                                                    : 'border-gray-100 bg-white hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <input
                                                    type="radio"
                                                    name="priceRangeDesktop"
                                                    value={range.id}
                                                    checked={isSelected}
                                                    onChange={() => setSelectedPriceRange(range.id)}
                                                    className="w-4 h-4 accent-[#070F2B] cursor-pointer"
                                                />
                                                <div>
                                                    <span className="text-xs font-bold text-[#070F2B] block">
                                                        {range.label}
                                                    </span>
                                                    {range.sublabel && (
                                                        <span className="text-[10px] text-gray-400 block font-medium">
                                                            {range.sublabel}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                                {count}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Reset All Filters Button */}
                        <div className="pt-2">
                            <button
                                onClick={clearAllFilters}
                                disabled={!hasActiveFilters}
                                className={`w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                    hasActiveFilters
                                        ? 'bg-gray-100 text-[#070F2B] hover:bg-rose-50 hover:text-rose-600 border border-gray-200'
                                        : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed'
                                }`}
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reset All Filters</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* =========================================================================
                    MAIN PRODUCTS DISPLAY AREA
                   ========================================================================= */}
                <div className="flex-1 w-full min-w-0">
                    {/* Header: Result count + Sorting Controls */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#070F2B]/10 shadow-xs mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg sm:text-xl font-black text-[#070F2B] uppercase tracking-tight">
                                    {selectedCategory === 'All' ? 'Trending Catalog' : FILTER_CATEGORIES.find(c => c.id === selectedCategory)?.label}
                                </h2>
                                <span className="bg-[#070F2B] text-[#FFCB05] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                                    {filteredProducts.length} Fits
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 font-medium">
                                Heavyweight 240 GSM organic luxury cotton &bull; Front, Back &amp; Whole HD views
                            </p>
                        </div>

                        {/* Desktop Sort Dropdown */}
                        <div className="hidden sm:flex items-center gap-2">
                            <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                                <ArrowUpDown className="w-3 h-3 text-[#B5945B]" /> Sort:
                            </span>
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className="appearance-none bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#070F2B] text-xs font-bold py-2 pl-3 pr-8 rounded-xl cursor-pointer focus:outline-none focus:border-[#070F2B] transition-colors"
                                    aria-label="Sort products on desktop"
                                >
                                    <option value="featured">Featured Drops</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="rating-desc">Customer Rating</option>
                                    <option value="name-asc">Alphabetical: A to Z</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Active Filter Pills Bar */}
                    {hasActiveFilters && (
                        <div className="mb-5 flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200/70">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#B5945B] mr-1">
                                Active:
                            </span>

                            {/* Search Query Pill */}
                            {urlQuery.trim() && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#070F2B]/20 text-[#070F2B] text-xs font-bold rounded-lg shadow-2xs">
                                    <span>Query: &ldquo;{urlQuery}&rdquo;</span>
                                    <button
                                        onClick={() => router.push('/products')}
                                        className="hover:text-rose-600 cursor-pointer"
                                        aria-label="Remove search query"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}

                            {/* Category Pill */}
                            {selectedCategory !== 'All' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#070F2B] text-white text-xs font-bold rounded-lg shadow-2xs">
                                    <span className="text-[#FFCB05]">{FILTER_CATEGORIES.find(c => c.id === selectedCategory)?.label}</span>
                                    <button
                                        onClick={() => setSelectedCategory('All')}
                                        className="hover:text-rose-400 cursor-pointer"
                                        aria-label="Clear category filter"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}

                            {/* Sizes Pills */}
                            {selectedSizes.map(size => (
                                <span
                                    key={size}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-300 text-[#070F2B] text-xs font-bold rounded-lg shadow-2xs"
                                >
                                    <span>Size: {size}</span>
                                    <button
                                        onClick={() => toggleSize(size)}
                                        className="hover:text-rose-600 cursor-pointer"
                                        aria-label={`Remove size ${size}`}
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}

                            {/* Price Pill */}
                            {selectedPriceRange !== 'all' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#B5945B]/40 text-[#070F2B] text-xs font-bold rounded-lg shadow-2xs">
                                    <span>Price: {FILTER_PRICE_RANGES.find(r => r.id === selectedPriceRange)?.label}</span>
                                    <button
                                        onClick={() => setSelectedPriceRange('all')}
                                        className="hover:text-rose-600 cursor-pointer"
                                        aria-label="Clear price filter"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}

                            {/* Clear All Pill */}
                            <button
                                onClick={clearAllFilters}
                                className="text-[10px] font-black uppercase tracking-wider text-rose-600 hover:text-rose-800 ml-auto cursor-pointer underline"
                            >
                                Clear All
                            </button>
                        </div>
                    )}

                    {/* Product Cards Grid */}
                    {filteredProducts.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-[#070F2B]/10 p-12 text-center shadow-xs my-6">
                            <div className="w-16 h-16 bg-[#070F2B]/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#070F2B]">
                                <Shirt className="w-8 h-8 text-[#B5945B]" />
                            </div>
                            <h3 className="text-lg font-black text-[#070F2B] uppercase tracking-wide mb-1">
                                No Matching Streetwear Fits
                            </h3>
                            <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
                                We couldn&apos;t find any pieces matching your current filters. Try relaxing your size or category selection to browse our 57 luxury drops.
                            </p>
                            <button
                                onClick={clearAllFilters}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#070F2B] text-white hover:bg-[#B5945B] hover:text-[#070F2B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reset All Filters</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* =========================================================================
                MOBILE FILTER DRAWER (SLIDE-OVER)
               ========================================================================= */}
            {showMobileFilters && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 backdrop-blur-sm bg-black/60 z-50 transition-opacity duration-300"
                        onClick={() => setShowMobileFilters(false)}
                    />

                    {/* Drawer */}
                    <div className="fixed top-0 right-0 h-[100dvh] w-[88vw] max-w-sm bg-white shadow-2xl z-50 flex flex-col overflow-hidden border-l border-gray-100 animate-in slide-in-from-right duration-300">
                        {/* Pinned Top Bar */}
                        <div className="shrink-0 flex items-center justify-between p-5 border-b border-gray-100 bg-white">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-[#070F2B] flex items-center justify-center text-[#FFCB05]">
                                    <Filter className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-wider text-[#070F2B]">Filter Fits</h3>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                                        {filteredProducts.length} pieces match
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="p-2 rounded-xl hover:bg-gray-100 text-[#070F2B] transition-colors cursor-pointer"
                                aria-label="Close filters"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Filter Options */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-6 overscroll-contain">
                            {/* Sort Option for Mobile */}
                            <div>
                                <span className="text-[11px] font-black uppercase tracking-widest text-[#B5945B] block mb-2">
                                    Sort Order
                                </span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className="w-full bg-gray-50 border border-gray-200 text-[#070F2B] text-xs font-bold py-2.5 px-3 rounded-xl cursor-pointer focus:outline-none focus:border-[#070F2B]"
                                    aria-label="Select sort order"
                                >
                                    <option value="featured">Featured Drops</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="rating-desc">Top Rated</option>
                                    <option value="name-asc">Alphabetical: A to Z</option>
                                </select>
                            </div>

                            {/* Collections Filter */}
                            <div>
                                <span className="text-[11px] font-black uppercase tracking-widest text-[#B5945B] block mb-2.5">
                                    Collections
                                </span>
                                <div className="space-y-1.5">
                                    {FILTER_CATEGORIES.map(category => {
                                        const isSelected = selectedCategory === category.id;
                                        const count = categoryCounts[category.id] || 0;

                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => setSelectedCategory(category.id)}
                                                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                                                    isSelected
                                                        ? 'bg-[#070F2B] text-white shadow-xs'
                                                        : 'text-gray-700 bg-gray-50 hover:bg-gray-100'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#FFCB05]' : 'bg-gray-300'}`} />
                                                    <span>{category.label}</span>
                                                </div>
                                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-[#FFCB05]' : 'bg-white text-gray-500'}`}>
                                                    {count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Size Filter */}
                            <div>
                                <span className="text-[11px] font-black uppercase tracking-widest text-[#B5945B] block mb-2.5">
                                    Sizes
                                </span>
                                <div className="grid grid-cols-3 gap-2">
                                    {FILTER_SIZES.map(size => {
                                        const isSelected = selectedSizes.includes(size);
                                        return (
                                            <button
                                                key={size}
                                                onClick={() => toggleSize(size)}
                                                className={`py-2 px-2 text-xs font-black rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                                    isSelected
                                                        ? 'bg-[#070F2B] text-white border-[#070F2B] shadow-xs'
                                                        : 'bg-white text-gray-700 border-gray-200'
                                                }`}
                                            >
                                                {isSelected && <Check className="w-3 h-3 text-[#FFCB05]" />}
                                                <span>{size}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <span className="text-[11px] font-black uppercase tracking-widest text-[#B5945B] block mb-2.5">
                                    Price Range
                                </span>
                                <div className="space-y-2">
                                    {FILTER_PRICE_RANGES.map(range => {
                                        const isSelected = selectedPriceRange === range.id;
                                        const count = priceCounts[range.id] || 0;

                                        return (
                                            <label
                                                key={range.id}
                                                className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                                                    isSelected
                                                        ? 'border-[#070F2B] bg-[#070F2B]/5'
                                                        : 'border-gray-200 bg-white'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="priceRangeMobile"
                                                        value={range.id}
                                                        checked={isSelected}
                                                        onChange={() => setSelectedPriceRange(range.id)}
                                                        className="w-4 h-4 accent-[#070F2B]"
                                                    />
                                                    <span className="text-xs font-bold text-[#070F2B]">{range.label}</span>
                                                </div>
                                                <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                                    {count}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Pinned Bottom Actions */}
                        <div className="shrink-0 p-4 border-t border-gray-100 bg-gray-50 flex gap-2.5">
                            <button
                                onClick={clearAllFilters}
                                className="flex-1 py-3 px-3 border border-gray-300 bg-white rounded-xl text-xs font-black uppercase tracking-wider text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer text-center"
                            >
                                Reset
                            </button>
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="flex-2 py-3 px-4 bg-[#070F2B] text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#B5945B] hover:text-[#070F2B] transition-colors cursor-pointer text-center shadow-md flex items-center justify-center gap-1.5"
                            >
                                <span>Show {filteredProducts.length} Fits</span>
                            </button>
                        </div>
                    </div>
                </>
            )}

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