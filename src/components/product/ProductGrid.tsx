'use client';

import { useState, memo, useEffect, useRef } from 'react';
import { Grid, List, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Product } from '@/data/products';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/Button';

interface ProductGridProps {
    products: Product[];
    isLoading?: boolean;
    onLoadMore?: () => void;
    hasMore?: boolean;
    className?: string;
    enableInfiniteScroll?: boolean;
    productsPerPage?: number;
}

type ViewMode = 'grid' | 'list';

export default memo(function ProductGrid({
    products,
    isLoading = false,
    onLoadMore,
    hasMore = false,
    className = '',
    enableInfiniteScroll = false,
    productsPerPage = 8
}: ProductGridProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Update displayed products when products change
    useEffect(() => {
        if (enableInfiniteScroll) {
            setDisplayedProducts(products);
        } else {
            const totalPages = Math.ceil(products.length / productsPerPage);
            const startIndex = (currentPage - 1) * productsPerPage;
            const endIndex = startIndex + productsPerPage;
            setDisplayedProducts(products.slice(startIndex, endIndex));
        }
    }, [products, currentPage, enableInfiniteScroll, productsPerPage]);

    // Infinite scroll setup
    useEffect(() => {
        if (!enableInfiniteScroll || !onLoadMore || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading) {
                    onLoadMore();
                }
            },
            { threshold: 0.1 }
        );

        observerRef.current = observer;

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [enableInfiniteScroll, onLoadMore, hasMore, isLoading]);

    const totalPages = Math.ceil(products.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = enableInfiniteScroll ? displayedProducts : products.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Calculate visible section buttons (Maximum 3 section buttons shown at a time)
    const getVisiblePages = () => {
        if (totalPages <= 3) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        if (currentPage <= 3) {
            return [1, 2, 3];
        }
        const start = Math.min(currentPage - 1, totalPages - 2);
        return [start, start + 1, start + 2];
    };

    const visiblePages = getVisiblePages();

    const handleLoadMore = () => {
        if (onLoadMore) {
            onLoadMore();
        } else {
            setCurrentPage(prev => prev + 1);
        }
    };

    if (isLoading && products.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
        );
    }

    return (
        <div className={className}>
            {/* View Mode Toggle & Results Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
                <div className="flex items-center justify-between sm:justify-start space-x-3 sm:space-x-4">
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 sm:p-2 rounded-md transition-colors cursor-pointer ${viewMode === 'grid'
                                ? 'bg-[#070F2B] text-white shadow-xs'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                            aria-label="Grid view"
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 sm:p-2 rounded-md transition-colors cursor-pointer ${viewMode === 'list'
                                ? 'bg-[#070F2B] text-white shadow-xs'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                            aria-label="List view"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Results Count */}
                    <span className="text-xs sm:text-sm text-gray-600">
                        {startIndex + 1}-{Math.min(endIndex, products.length)} of {products.length} items
                    </span>
                </div>

                {/* Sort Options */}
                <div className="flex items-center justify-end space-x-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#070F2B]/60">Sort:</span>
                    <select className="text-[11px] font-black text-[#070F2B] bg-white border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#070F2B] cursor-pointer shadow-xs">
                        <option value="featured" className="text-[#070F2B] bg-white">Featured</option>
                        <option value="price-low" className="text-[#070F2B] bg-white">Price: Low to High</option>
                        <option value="price-high" className="text-[#070F2B] bg-white">Price: High to Low</option>
                        <option value="rating" className="text-[#070F2B] bg-white">Highest Rated</option>
                        <option value="newest" className="text-[#070F2B] bg-white">Newest First</option>
                    </select>
                </div>
            </div>

            {/* Products Grid/List - Mobile optimized */}
            <div className={`
                ${viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6'
                    : 'space-y-4'
                }
            `}>
                {currentProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>

            {/* Infinite Scroll Trigger */}
            {enableInfiniteScroll && hasMore && (
                <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
                    {isLoading && (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                            <span className="text-gray-600">Loading more products...</span>
                        </div>
                    )}
                </div>
            )}

            {/* Luxury Pagination Controls */}
            {!enableInfiniteScroll && totalPages > 1 && (
                <div className="mt-12 pt-8 border-t border-gray-200/80 flex flex-col items-center gap-4">
                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#070F2B]/5 border border-[#070F2B]/10 text-[11px] font-black uppercase tracking-wider text-[#070F2B]">
                        <span className="w-2 h-2 rounded-full bg-[#B5945B] animate-pulse" />
                        <span>Section {currentPage} of {totalPages}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">Showing {startIndex + 1}–{Math.min(endIndex, products.length)} of {products.length} Products</span>
                    </div>

                    {/* Section Switcher Buttons */}
                    <div className="flex items-center gap-2 sm:gap-3 select-none">
                        {/* Previous Section */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-[#070F2B] font-bold text-xs uppercase tracking-wider hover:border-[#B5945B] hover:text-[#B5945B] disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs active:scale-95 cursor-pointer"
                            aria-label="Previous Section"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Prev</span>
                        </button>

                        {/* Numbered Section Buttons (Window of 3 max) */}
                        {visiblePages.map((pageNum) => {
                            const isActive = currentPage === pageNum;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`relative min-w-[42px] h-[42px] px-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 ${
                                        isActive
                                            ? 'bg-[#070F2B] text-[#E5D7B5] shadow-[0_8px_20px_rgba(7,15,43,0.25)] border border-[#B5945B]/60 scale-105'
                                            : 'bg-white text-[#070F2B] border border-gray-200 hover:border-[#B5945B]/60 hover:text-[#B5945B] shadow-xs'
                                    }`}
                                >
                                    <span className="text-[10px] opacity-60 font-semibold sm:hidden">#</span>
                                    <span className="hidden sm:inline text-[9px] uppercase font-bold tracking-widest opacity-70">Sec</span>
                                    <span>{pageNum}</span>
                                </button>
                            );
                        })}

                        {/* Next Section */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-[#070F2B] font-bold text-xs uppercase tracking-wider hover:border-[#B5945B] hover:text-[#B5945B] disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs active:scale-95 cursor-pointer"
                            aria-label="Next Section"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Load More Button (Alternative to pagination) - Only if not using infinite scroll */}
            {!enableInfiniteScroll && hasMore && onLoadMore && (
                <div className="text-center mt-8">
                    <Button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        variant="outline"
                        className="px-8 py-3"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Load More Products'
                        )}
                    </Button>
                </div>
            )}

            {/* Loading State for Load More */}
            {isLoading && products.length > 0 && (
                <div className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600">Loading more products...</p>
                </div>
            )}
        </div>
    );
}); 