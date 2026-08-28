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
        <div className="min-h-screen bg-[#FAF6F0] text-[#070F2B] font-sans">
            <Header />

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#070F2B]/60 mb-6">
                    <Link href="/" className="hover:text-[#B5945B] transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-[#B5945B] transition-colors">Products</Link>
                    <span>/</span>
                    <span className="text-[#070F2B]">{getCategoryTitle(category)}</span>
                </nav>

                {/* Category Hero Banner */}
                <div className="relative w-full bg-[#070F2B] text-white rounded-2xl overflow-hidden py-12 px-8 md:px-16 mb-10 shadow-[0_15px_30px_rgba(7,15,43,0.2)] border border-white/5 select-none">
                    {/* Gold brush stroke / vectors inside banner */}
                    <div className="absolute top-0 right-0 w-48 h-full opacity-[0.12] pointer-events-none">
                        <svg className="w-full h-full text-[#B5945B] fill-current" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                            <path d="M 40 0 C 60 20, 80 50, 100 100 L 100 0 Z" />
                            <path d="M 0 100 C 40 80, 80 60, 100 100 Z" opacity="0.5" />
                        </svg>
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3.5">
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/"
                                    className="flex items-center gap-1.5 px-3.5 py-1 bg-[#FFCB05] text-[#070F2B] hover:bg-white hover:scale-105 border border-[#FFCB05] rounded-full transition-all duration-300 font-black uppercase tracking-wider text-[8.5px] shadow-md cursor-pointer"
                                >
                                    <ArrowLeft className="w-3 h-3 text-[#070F2B]" />
                                    Back to Home
                                </Link>
                                <span className="text-[9px] font-black uppercase tracking-widest text-[#FAF6F0]/60 bg-white/5 py-1 px-3 rounded-full border border-white/10">
                                    {category} Collection
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#FAF6F0]">
                                {getCategoryTitle(category)}
                            </h1>
                            <p className="text-xs md:text-sm text-white/60 font-semibold max-w-lg leading-relaxed">
                                {getCategoryDescription(category)}
                            </p>
                        </div>
                        
                        {/* stats badge */}
                        <div className="bg-white/5 backdrop-blur-xs border border-white/10 p-5 rounded-xl shrink-0 text-left md:text-right shadow-sm">
                            <span className="text-[9px] text-[#B5945B] font-bold uppercase tracking-wider block">Exclusive Zeynix Wear</span>
                            <span className="text-2xl font-black text-[#FAF6F0] block mt-0.5">{filteredProducts.length} Items</span>
                            <span className="text-[9.5px] text-white/40 block">Premium Fit & Fabric Quality</span>
                        </div>
                    </div>
                </div>

                {/* Controls Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-8">
                    <button
                        onClick={toggleFilters}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#070F2B] text-white border border-[#070F2B] rounded-xl hover:bg-[#B5945B] hover:border-[#B5945B] hover:text-[#070F2B] font-bold uppercase tracking-wider text-[10px] shadow-[2px_2px_0px_#B5945B] hover:shadow-[0px_0px_0px_#B5945B] transition-all cursor-pointer"
                    >
                        <Filter className="w-3.5 h-3.5" />
                        {showFilters ? 'Hide Filters' : 'Filter & Sort'}
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Products Grid */}
                    <div className="flex-1">
                        <ProductGrid
                            products={filteredProducts}
                        />
                    </div>
                </div>

                {/* Mobile Filter Overlay */}
                {showFilters && (
                    <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 animate-in fade-in duration-300">
                        <div className="absolute right-0 top-0 h-full w-80 bg-white p-4 overflow-y-auto shadow-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Filters</h3>
                                <button
                                    onClick={toggleFilters}
                                    className="p-2 hover:bg-gray-100 rounded"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
} 