'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductSearch from '@/components/product/ProductSearch';
import FilterProducts from '@/components/layout/FilterProducts';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

function ProductsPageContent() {
    const [searchQuery, setSearchQuery] = useState('');
    const searchParams = useSearchParams();
    const router = useRouter();

    // Handle URL search params
    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            setSearchQuery(query);
        }
    }, [searchParams]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);

        // Update URL
        const params = new URLSearchParams(searchParams);
        if (query.trim()) {
            params.set('q', query);
        } else {
            params.delete('q');
        }
        router.push(`/products?${params.toString()}`);
    }, [searchParams, router]);

    const handleSearchClear = useCallback(() => {
        setSearchQuery('');

        // Update URL
        const params = new URLSearchParams(searchParams);
        params.delete('q');
        router.push(`/products?${params.toString()}`);
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
                    <p className="text-gray-600">Discover our latest collection of premium clothing</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="max-w-2xl">
                        <ProductSearch
                            onSearch={handleSearch}
                            onClear={handleSearchClear}
                            placeholder="Search for products, brands, or categories..."
                            products={[]} // FilterProducts will handle its own products
                        />
                    </div>
                </div>

                {/* Main Content - Use FilterProducts component */}
                <FilterProducts />
            </main>

            <Footer />
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductsPageContent />
        </Suspense>
    );
} 