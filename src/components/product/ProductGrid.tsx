'use client';

import { useState, memo } from 'react';
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
}

type ViewMode = 'grid' | 'list';

export default memo(function ProductGrid({
    products,
    isLoading = false,
    onLoadMore,
    hasMore = false,
    className = ''
}: ProductGridProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = viewMode === 'grid' ? 12 : 8;

    const totalPages = Math.ceil(products.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Results Count */}
                    <span className="text-sm text-gray-600">
                        Showing {startIndex + 1}-{Math.min(endIndex, products.length)} of {products.length} products
                    </span>
                </div>

                {/* Sort Options */}
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                        <option value="newest">Newest First</option>
                    </select>
                </div>
            </div>

            {/* Products Grid/List */}
            <div className={`
                ${viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-8">
                    {/* Previous Page */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }

                        return (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-3 py-2 border rounded-md transition-colors ${currentPage === pageNum
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    {/* Next Page */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Load More Button (Alternative to pagination) */}
            {hasMore && onLoadMore && (
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