'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, X, Search as SearchIcon } from 'lucide-react';
import { Product } from '@/data/products';
import { productAPI } from '@/lib/api';
import ProductSearch from '@/components/product/ProductSearch';
import ProductFilter from '@/components/product/ProductFilter';
import ProductGrid from '@/components/product/ProductGrid';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

export default function ProductsPage() {
    console.log('🔄 ProductsPage rendering');

    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([]);

    const searchParams = useSearchParams();
    const router = useRouter();

    // Load initial products
    useEffect(() => {
        console.log('🚀 Initial products useEffect running');
        fetchProducts();
    }, []); // Only run once on mount

    // Handle URL search params
    useEffect(() => {
        console.log('🔍 URL search params useEffect running:', {
            productsLength: products.length,
            searchParams: searchParams.toString()
        });
        const query = searchParams.get('q');
        const category = searchParams.get('category');

        if (query && products.length > 0) {
            setSearchQuery(query);
            // Don't call handleSearch here to avoid infinite loops
            // Just set the search query
        }

        if (category && products.length > 0) {
            // Apply category filter only when products are loaded
            const filtered = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
            setFilteredProducts(filtered);
        }
    }, [searchParams, products.length]); // Only depend on products.length, not products array

    // Handle search when products are loaded
    useEffect(() => {
        if (searchQuery && products.length > 0) {
            const searchTerm = searchQuery.toLowerCase();
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.brand.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm) ||
                product.description?.toLowerCase().includes(searchTerm)
            );
            setFilteredProducts(filtered);
        }
    }, [searchQuery, products.length]);

    const fetchProducts = useCallback(async (page = 1, append = false) => {
        console.log('🔄 fetchProducts called:', { page, append, productsCount: products.length });
        try {
            setIsLoading(true);
            setError(null);

            const response = await productAPI.getAllProducts({
                page,
                limit: 20,
                category: searchParams.get('category') || undefined
            });

            if (response.success) {
                const newProducts = response.data.products;

                if (append) {
                    setProducts(prev => [...prev, ...newProducts]);
                } else {
                    setProducts(newProducts);
                }

                setFilteredProducts(newProducts);
                setHasMore(newProducts.length === 20); // Assuming 20 is the page size
                setCurrentPage(page);
            } else {
                setError('Failed to load products');
            }
        } catch (err) {
            setError('Failed to load products');
            console.error('Error fetching products:', err);
        } finally {
            setIsLoading(false);
        }
    }, [searchParams]);

    const handleSearch = useCallback((query: string) => {
        console.log('🔍 handleSearch called:', query);
        setSearchQuery(query);

        if (!query.trim()) {
            setFilteredProducts(products);
            return;
        }

        const searchTerm = query.toLowerCase();
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.description?.toLowerCase().includes(searchTerm)
        );

        setFilteredProducts(filtered);

        // Update URL
        const params = new URLSearchParams(searchParams);
        if (query.trim()) {
            params.set('q', query);
        } else {
            params.delete('q');
        }
        router.push(`/products?${params.toString()}`);
    }, [products, searchParams, router]);

    const handleSearchClear = useCallback(() => {
        console.log('🧹 handleSearchClear called');
        setSearchQuery('');
        setFilteredProducts(products);

        // Update URL
        const params = new URLSearchParams(searchParams);
        params.delete('q');
        router.push(`/products?${params.toString()}`);
    }, [products, searchParams, router]);

    const handleFilterChange = useCallback((filtered: Product[]) => {
        setFilteredProducts(filtered);
    }, []);

    const handleLoadMore = useCallback(() => {
        fetchProducts(currentPage + 1, true);
    }, [fetchProducts, currentPage]);

    const handleQuickFilterApply = (filterType: string, value: string) => {
        setActiveQuickFilters(prev => [...prev, `${filterType}:${value}`]);
        // Apply the filter logic here
    };

    const handleQuickFilterClear = useCallback(() => {
        setActiveQuickFilters([]);
        // TODO: Clear quick filters
    }, []);

    const toggleFilters = useCallback(() => {
        setShowFilters(!showFilters);
    }, [showFilters]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
                    <p className="text-gray-600">Discover our latest collection of premium clothing</p>
                </div>

                {/* Search and Filter Controls */}
                <div className="mb-6 space-y-4">

                    {/* Search Bar */}
                    <div className="max-w-2xl">
                        <ProductSearch
                            onSearch={handleSearch}
                            onClear={handleSearchClear}
                            placeholder="Search for products, brands, or categories..."
                            products={products}
                        />
                    </div>

                    {/* Filter Toggle */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                onClick={toggleFilters}
                                variant="outline"
                                className="flex items-center space-x-2"
                            >
                                <Filter className="w-4 h-4" />
                                <span>Filters</span>
                                {showFilters && <X className="w-4 h-4" />}
                            </Button>

                            {/* Active Filters Summary */}
                            {searchQuery && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">Search: &quot;{searchQuery}&quot;</span>
                                    <button
                                        onClick={handleSearchClear}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Results Count */}
                        <div className="text-sm text-gray-600">
                            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex gap-6">
                    {/* Filters Sidebar */}
                    {showFilters && (
                        <div className="w-64 flex-shrink-0">
                            <ProductFilter
                                products={products}
                                onFilterChange={handleFilterChange}
                            />
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className="flex-1">
                        <ProductGrid
                            products={filteredProducts}
                            isLoading={isLoading}
                            onLoadMore={handleLoadMore}
                            hasMore={hasMore}
                        />
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <X className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Products</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <Button onClick={() => fetchProducts()}>Try Again</Button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
} 