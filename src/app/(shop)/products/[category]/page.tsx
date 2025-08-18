'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/data/products';
import ProductGrid from '@/components/product/ProductGrid';
// import ProductFilter from '@/components/product/ProductFilter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Filter, ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';
import { productAPI } from '@/lib/api';

export default function CategoryProductsPage() {
    const params = useParams();
    const category = params.category as string;

    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        // Fetch products by category from API
        const fetchCategoryProducts = async () => {
            try {
                const response = await productAPI.getProductsByCategory(category);
                if (response.success) {
                    setProducts(response.data.products);
                    setFilteredProducts(response.data.products);
                }
            } catch (err) {
                console.error('Error fetching category products:', err);
            }
        };

        fetchCategoryProducts();
    }, [category]);

    const handleFilterChange = (filtered: Product[]) => {
        setFilteredProducts(filtered);
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const getCategoryTitle = (cat: string) => {
        const titles: { [key: string]: string } = {
            'casual': 'Casual Wear',
            'formal': 'Formal Wear',
            'ethnic': 'Ethnic Wear',
            'sports': 'Sports Wear',
            't-shirts': 'T-Shirts',
            'shirts': 'Shirts',
            'jeans': 'Jeans',
            'pants': 'Pants',
            'jackets': 'Jackets'
        };
        return titles[cat.toLowerCase()] || cat.charAt(0).toUpperCase() + cat.slice(1);
    };

    const getCategoryDescription = (cat: string) => {
        const descriptions: { [key: string]: string } = {
            'casual': 'Comfortable and stylish casual clothing for everyday wear',
            'formal': 'Professional and elegant formal attire for special occasions',
            'ethnic': 'Traditional and cultural ethnic wear with modern touches',
            'sports': 'Performance-driven sports and athletic wear',
            't-shirts': 'Comfortable and trendy t-shirts for casual styling',
            'shirts': 'Versatile shirts for both casual and formal occasions',
            'jeans': 'Classic and modern denim styles for every occasion',
            'pants': 'Comfortable and stylish pants for various occasions',
            'jackets': 'Trendy jackets to complete your look'
        };
        return descriptions[cat.toLowerCase()] || 'Discover our amazing collection';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                    <Link href="/" className="hover:text-gray-900">Home</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-gray-900">Products</Link>
                    <span>/</span>
                    <span className="text-gray-900">{getCategoryTitle(category)}</span>
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {getCategoryTitle(category)}
                            </h1>
                            <p className="text-gray-600">{getCategoryDescription(category)}</p>
                        </div>
                    </div>

                    {/* Results Summary */}
                    <div className="text-sm text-gray-500">
                        Showing {filteredProducts.length} of {products.length} products
                    </div>
                </div>

                {/* Controls Bar */}
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={toggleFilters}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Filter className="w-4 h-4" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    {/* <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <ProductFilter
                            products={products}
                            onFilterChange={handleFilterChange}
                            className="sticky top-8"
                        />
                    </div> */}

                    {/* Products Grid */}
                    <div className="flex-1">
                        <ProductGrid
                            products={filteredProducts}
                            title=""
                            subtitle=""
                        />
                    </div>
                </div>

                {/* Mobile Filter Overlay */}
                {showFilters && (
                    <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
                        <div className="absolute right-0 top-0 h-full w-80 bg-white p-4 overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Filters</h3>
                                <button
                                    onClick={toggleFilters}
                                    className="p-2 hover:bg-gray-100 rounded"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            {/* <ProductFilter
                                products={products}
                                onFilterChange={handleFilterChange}
                            /> */}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
} 