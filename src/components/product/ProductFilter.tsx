'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Product } from '@/data/products';
import { colorClasses, APP_CONFIG } from '@/lib/constants';

interface FilterState {
    category: string;
    priceRange: [number, number];
    sizes: string[];
    brands: string[];
    sortBy: string;
}

interface ProductFilterProps {
    products: Product[];
    onFilterChange: (filteredProducts: Product[]) => void;
    className?: string;
}

export default memo(function ProductFilter({ products, onFilterChange, className = '' }: ProductFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        category: 'all',
        priceRange: [0, 5000],
        sizes: [],
        brands: [],
        sortBy: 'featured'
    });

    // Get unique values for filters - memoized to prevent recalculation
    const filterValues = useMemo(() => {
        const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
        const sizes = Array.from(new Set(products.flatMap(p => p.size)));
        const brands = Array.from(new Set(products.map(p => p.brand)));
        const maxPrice = Math.max(...products.map(p => p.originalPrice || 0));

        return { categories, sizes, brands, maxPrice };
    }, [products]);

    const { categories, sizes, brands, maxPrice } = filterValues;

    useEffect(() => {
        applyFilters();
    }, [filters]); // Only depend on filters, not products

    const applyFilters = useCallback(() => {
        let filtered = [...products];

        // Category filter
        if (filters.category !== 'all') {
            filtered = filtered.filter(p => p.category === filters.category);
        }

        // Price range filter
        filtered = filtered.filter(p =>
            (p.price || 0) >= filters.priceRange[0] && (p.price || 0) <= filters.priceRange[1]
        );

        // Size filter
        if (filters.sizes.length > 0) {
            filtered = filtered.filter(p =>
                p.size.some(size => filters.sizes.includes(size))
            );
        }

        // Brand filter
        if (filters.brands.length > 0) {
            filtered = filtered.filter(p => filters.brands.includes(p.brand));
        }

        // Sorting
        switch (filters.sortBy) {
            case 'price-low':
                filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'price-high':
                filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'rating':
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'newest':
                // Since id is a string, we'll sort by name instead for "newest"
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'featured':
            default:
                filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
                break;
        }

        onFilterChange(filtered);
    }, [filters, products, onFilterChange]);

    const updateFilter = useCallback((key: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const toggleSize = useCallback((size: string) => {
        setFilters(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    }, []);

    const toggleBrand = useCallback((brand: string) => {
        setFilters(prev => ({
            ...prev,
            brands: prev.brands.includes(brand)
                ? prev.brands.filter(b => b !== brand)
                : [...prev.brands, brand]
        }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({
            category: 'all',
            priceRange: [0, maxPrice],
            sizes: [],
            brands: [],
            sortBy: 'featured'
        });
    }, [maxPrice]);

    const hasActiveFilters = useMemo(() =>
        filters.category !== 'all' ||
        filters.sizes.length > 0 ||
        filters.brands.length > 0 ||
        filters.priceRange[0] > 0 ||
        filters.priceRange[1] < maxPrice
        , [filters, maxPrice]);

    return (
        <div className={`bg-white rounded-lg shadow-md ${className}`}>
            {/* Filter Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-600" />
                        <h3 className="font-semibold text-gray-900">Filters</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Clear All
                            </button>
                        )}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Content */}
            <div className={`${isOpen ? 'block' : 'hidden'} p-4 space-y-6`}>
                {/* Category Filter */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                    <div className="space-y-2">
                        {categories.map(category => (
                            <label key={category} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="category"
                                    value={category}
                                    checked={filters.category === category}
                                    onChange={(e) => updateFilter('category', e.target.value)}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700 capitalize">
                                    {category}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Range Filter */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">₹{filters.priceRange[0]}</span>
                            <span className="text-gray-400">-</span>
                            <span className="text-sm text-gray-600">₹{filters.priceRange[1]}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={maxPrice}
                            value={filters.priceRange[1]}
                            onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                value={filters.priceRange[0]}
                                onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={filters.priceRange[1]}
                                onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value) || maxPrice])}
                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Size Filter */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">Size</h4>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map(size => (
                            <button
                                key={size}
                                onClick={() => toggleSize(size)}
                                className={`px-3 py-1 text-sm rounded border transition-all duration-200 ${filters.sizes.includes(size)
                                    ? `${colorClasses.primary.bg} text-white border-transparent`
                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Brand Filter */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">Brand</h4>
                    <div className="space-y-2">
                        {brands.map(brand => (
                            <label key={brand} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.brands.includes(brand)}
                                    onChange={() => toggleBrand(brand)}
                                    className="text-blue-600 focus:ring-blue-500 rounded"
                                />
                                <span className="text-sm text-gray-700">{brand}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Sort By */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">Sort By</h4>
                    <select
                        value={filters.sortBy}
                        onChange={(e) => updateFilter('sortBy', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                        <option value="newest">Newest First</option>
                    </select>
                </div>
            </div>
        </div>
    );
});

