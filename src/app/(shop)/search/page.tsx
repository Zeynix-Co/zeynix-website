'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, X, Grid, List, ChevronDown, ChevronUp } from 'lucide-react';
import { productAPI } from '@/lib/api';
import { Product } from '@/data/products';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilter from '@/components/product/ProductFilter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { colorClasses } from '@/lib/constants';

export default function SearchResultsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<string>('relevance');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const query = searchParams.get('q') || '';
    const brand = searchParams.get('brand') || '';
    const category = searchParams.get('category') || '';

    // Load search results
    useEffect(() => {
        if (query || brand || category) {
            fetchSearchResults();
        }
    }, [query, brand, category]);

    const fetchSearchResults = useCallback(async (page = 1, append = false) => {
        try {
            setIsLoading(true);
            setError(null);

            let response;
            if (brand) {
                // Search by brand - we'll need to implement this or use search
                response = await productAPI.searchProducts(brand, {
                    page,
                    limit: 20
                });
            } else if (category) {
                // Search by category
                response = await productAPI.getProductsByCategory(category, {
                    page,
                    limit: 20
                });
            } else {
                // General search
                response = await productAPI.searchProducts(query, {
                    page,
                    limit: 20
                });
            }

            if (response.success) {
                const newProducts = response.data.products;

                if (append) {
                    setProducts(prev => [...prev, ...newProducts]);
                } else {
                    setProducts(newProducts);
                }

                setFilteredProducts(newProducts);
                setHasMore(newProducts.length === 20);
                setCurrentPage(page);
            } else {
                setError('Failed to load search results');
            }
        } catch (err) {
            console.error('Search error:', err);
            setError('Failed to load search results');
        } finally {
            setIsLoading(false);
        }
    }, [query, brand, category]);

    // Handle filter changes
    const handleFilterChange = (filtered: Product[]) => {
        setFilteredProducts(filtered);
    };

    // Handle sorting
    const handleSort = (newSortBy: string) => {
        if (sortBy === newSortBy) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('desc');
        }
    };

    // Apply sorting
    useEffect(() => {
        if (filteredProducts.length > 0) {
            const sorted = [...filteredProducts].sort((a, b) => {
                let aValue: string | number, bValue: string | number;

                switch (sortBy) {
                    case 'price':
                        aValue = a.originalPrice > a.price ? a.price : a.originalPrice;
                        bValue = b.originalPrice > b.price ? b.price : b.originalPrice;
                        break;
                    case 'name':
                        aValue = a.name.toLowerCase();
                        bValue = b.name.toLowerCase();
                        break;
                    case 'newest':
                        // Use a default date since launchDate doesn't exist
                        aValue = new Date('2025-08-03').getTime();
                        bValue = new Date('2025-08-03').getTime();
                        break;
                    case 'popularity':
                        aValue = a.rating || 0;
                        bValue = b.rating || 0;
                        break;
                    default:
                        return 0;
                }

                if (sortOrder === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });

            setFilteredProducts(sorted);
        }
    }, [sortBy, sortOrder, products]);

    // Load more results
    const loadMore = () => {
        if (!isLoading && hasMore) {
            fetchSearchResults(currentPage + 1, true);
        }
    };

    // Get search title
    const getSearchTitle = () => {
        if (brand) return `Brand: ${brand}`;
        if (category) return `Category: ${category.charAt(0).toUpperCase() + category.slice(1)}`;
        return `Search Results for "${query}"`;
    };

    // Get search subtitle
    const getSearchSubtitle = () => {
        if (brand) return `Browse all products from ${brand}`;
        if (category) return `Discover amazing ${category} wear`;
        return `Found ${filteredProducts.length} products matching your search`;
    };

    if (!query && !brand && !category) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-7xl mx-auto px-4 py-8">
                    <div className="text-center">
                        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">No Search Query</h1>
                        <p className="text-gray-600 mb-6">Please enter a search term to find products.</p>
                        <Button onClick={() => router.push('/')}>
                            Back to Home
                        </Button>
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
                    <button onClick={() => router.back()} className="hover:text-gray-900">
                        ← Back
                    </button>
                    <span>/</span>
                    <span className="text-gray-900">Search Results</span>
                </nav>

                {/* Search Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Search className={`w-8 h-8 ${colorClasses.primary.text}`} />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{getSearchTitle()}</h1>
                            <p className="text-gray-600 mt-1">{getSearchSubtitle()}</p>
                        </div>
                    </div>
                </div>

                {/* Search Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    {/* Results Count */}
                    <div className="text-sm text-gray-600">
                        {isLoading ? 'Loading...' : `${filteredProducts.length} products found`}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3">
                        {/* View Toggle */}
                        <div className="flex items-center border rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 transition-colors ${viewMode === 'grid'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 transition-colors ${viewMode === 'list'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                <span className="text-sm">Sort by</span>
                                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {showFilters && (
                                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                                    <div className="p-2">
                                        <div className="text-xs font-medium text-gray-500 px-3 py-1">Sort Options</div>
                                        {[
                                            { value: 'relevance', label: 'Relevance' },
                                            { value: 'price', label: 'Price' },
                                            { value: 'name', label: 'Name' },
                                            { value: 'newest', label: 'Newest' },
                                            { value: 'popularity', label: 'Popularity' }
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    handleSort(option.value);
                                                    setShowFilters(false);
                                                }}
                                                className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 transition-colors ${sortBy === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                                    }`}
                                            >
                                                {option.label}
                                                {sortBy === option.value && (
                                                    <span className="ml-2 text-xs">
                                                        {sortOrder === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 text-red-800">
                            <X className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                        <button
                            onClick={() => fetchSearchResults()}
                            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Results */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <ProductFilter
                            products={products}
                            onFilterChange={handleFilterChange}
                        />
                    </div>

                    {/* Products Grid */}
                    <div className="lg:col-span-3">
                        {isLoading && products.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Searching for products...</p>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <>
                                <ProductGrid
                                    products={filteredProducts}
                                />

                                {/* Load More */}
                                {hasMore && (
                                    <div className="text-center mt-8">
                                        <Button
                                            onClick={loadMore}
                                            disabled={isLoading}
                                            variant="outline"
                                        >
                                            {isLoading ? 'Loading...' : 'Load More Products'}
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                                <p className="text-gray-600 mb-6">
                                    Try adjusting your search terms or filters to find what you&apos;re looking for.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button onClick={() => router.push('/products')}>
                                        Browse All Products
                                    </Button>
                                    <Button
                                        onClick={() => router.push('/')}
                                        variant="outline"
                                    >
                                        Back to Home
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
