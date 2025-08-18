'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProductStore, useAdminStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colorClasses, PRODUCT_CONSTANTS, PAGINATION } from '@/lib/constants';

interface ProductListProps {
    onEditProduct?: (productId: string) => void;
    onAddProduct?: () => void;
}

export default function ProductList({ onEditProduct, onAddProduct }: ProductListProps) {
    const router = useRouter();
    const { user } = useAdminStore();
    const {
        products,
        pagination,
        filters,
        isLoading,
        error,
        getAllProducts,
        deleteProduct,
        toggleProductStatus,
        setFilters,
        clearError
    } = useProductStore();

    // Local state for search input
    const [searchInput, setSearchInput] = useState(filters.search);

    // Load products on component mount
    useEffect(() => {
        if (user) {
            getAllProducts(user.id);
        }
    }, [user, getAllProducts]);

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== filters.search) {
                setFilters({ search: searchInput, page: 1 });
                if (user) {
                    getAllProducts(user.id, { search: searchInput, page: 1 });
                }
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput, filters.search, setFilters, getAllProducts, user]);

    // Handle filter changes
    const handleFilterChange = (filterType: 'category' | 'status', value: string) => {
        setFilters({ [filterType]: value, page: 1 });
        if (user) {
            getAllProducts(user.id, { [filterType]: value, page: 1 });
        }
    };

    // Handle pagination
    const handlePageChange = (page: number) => {
        setFilters({ page });
        if (user) {
            getAllProducts(user.id, { page });
        }
    };

    // Handle product deletion
    const handleDeleteProduct = async (productId: string) => {
        if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            try {
                if (user) {
                    await deleteProduct(productId, user.id);
                }
            } catch (error) {
                console.error('Failed to delete product:', error);
            }
        }
    };

    // Handle status toggle
    const handleStatusToggle = async (productId: string, currentStatus: string) => {
        try {
            if (user) {
                const newStatus = currentStatus === 'published' ? 'draft' : 'published';
                await toggleProductStatus(productId, newStatus, user.id);
            }
        } catch (error) {
            console.error('Failed to toggle product status:', error);
        }
    };

    // Handle edit product
    const handleEditProduct = (productId: string) => {
        if (onEditProduct) {
            onEditProduct(productId);
        } else {
            router.push(`/admin/products/edit/${productId}`);
        }
    };

    // Get status badge color
    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'published':
                return 'bg-green-100 text-green-800';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            case 'archived':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get category badge color
    const getCategoryBadgeColor = (category: string) => {
        switch (category) {
            case 'casual':
                return 'bg-blue-100 text-blue-800';
            case 'formal':
                return 'bg-purple-100 text-purple-800';
            case 'ethnic':
                return 'bg-orange-100 text-orange-800';
            case 'sports':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading && products.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Add Product Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className='flex justify-between items-center w-full'>
                    <div>
                        <h2 className={`text-2xl font-bold ${colorClasses.primary.text}`}>
                            Products ({pagination.total})
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Manage your product catalog
                        </p>
                    </div>

                    <div>
                        <Button
                            onClick={onAddProduct}
                            className="cursor-pointer"
                        >
                            + Add New Product
                        </Button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search Products
                        </label>
                        <Input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search by title"
                            className="w-full"
                        />
                    </div>

                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-[#070F2B] bg-white"
                        >
                            <option value="all" className="text-[#070F2B]">All</option>
                            {PRODUCT_CONSTANTS.categories.map(category => (
                                <option key={category} value={category} className="text-[#070F2B]">
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-[#070F2B] bg-white"
                        >
                            <option value="all" className="text-[#070F2B]">All</option>
                            {PRODUCT_CONSTANTS.statuses.map(status => (
                                <option key={status} value={status} className="text-[#070F2B]">
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Results per page */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Per Page
                        </label>
                        <select
                            value={pagination.limit}
                            onChange={(e) => {
                                setFilters({ limit: parseInt(e.target.value), page: 1 });
                                if (user) {
                                    getAllProducts(user.id, { limit: parseInt(e.target.value), page: 1 });
                                }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-[#070F2B] bg-white"
                        >
                            {PAGINATION.limits.map(limit => (
                                <option key={limit} value={limit} className="text-[#070F2B]">{limit}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span>{error}</span>
                        <button
                            onClick={clearError}
                            className="text-red-700 hover:text-red-900"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📦</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 mb-6">
                        {filters.search || filters.category !== 'all' || filters.status !== 'all'
                            ? 'Try adjusting your filters or search terms'
                            : 'Get started by adding your first product'
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            {/* Product Image */}
                            <div className="bg-gray-100 relative">
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.title}
                                        className="object-contain"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = ''; // Fallback image
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <span className="text-4xl">📷</span>
                                    </div>
                                )}

                                {/* Featured Badge */}
                                {product.featured && (
                                    <div className="absolute top-2 right-2">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                            ⭐ Featured
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                {/* Brand */}
                                <p className="text-sm text-gray-600 mt-1">
                                    {product.brand || 'Zeynix'}
                                </p>

                                <div className='flex items-center justify-between'>
                                    <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
                                        {product.title}
                                    </h3>
                                    {/* Rating */}
                                    <div className="flex items-center gap-1">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    key={star}
                                                    className={`text-sm ${star <= product.rating ? 'text-yellow-400' : 'text-gray-300'
                                                        }`}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600 ml-1">
                                            ({product.rating})
                                        </span>
                                    </div>
                                </div>




                                {/* Pricing */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg font-bold text-gray-900">
                                        ₹{product.discountPrice || product.actualPrice}
                                    </span>
                                    {product.actualPrice > product.discountPrice && (
                                        <>
                                            <span className="text-sm text-gray-500 line-through">
                                                ₹{product.actualPrice}
                                            </span>
                                            <span className="text-sm font-medium text-green-600">
                                                {product.discount}% OFF
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* Sizes */}
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 mb-1">Available Sizes:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {product.sizes.map((sizeData) => (
                                            <span
                                                key={sizeData.size}
                                                className={`px-2 py-1 text-xs rounded ${sizeData.inStock
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {sizeData.size} {sizeData.inStock ? '✓' : '✗'}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleEditProduct(product._id!)}
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 cursor-pointer"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => handleStatusToggle(product._id!, product.status)}
                                        variant="outline"
                                        size="sm"
                                        className="cursor-pointer"
                                    >
                                        {product.status === 'published' ? 'Draft' : 'Publish'}
                                    </Button>
                                    <Button
                                        onClick={() => handleDeleteProduct(product._id!)}
                                        variant="outline"
                                        size="sm"
                                        className="cursor-pointer text-red-600 border-red-600 hover:bg-red-50"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                    <Button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        variant="outline"
                        disabled={pagination.page <= 1}
                        className="cursor-pointer"
                    >
                        Previous
                    </Button>

                    <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                            const page = Math.max(1, Math.min(pagination.pages - 4, pagination.page - 2)) + i;
                            if (page > pagination.pages) return null;

                            return (
                                <Button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    variant={page === pagination.page ? "primary" : "outline"}
                                    size="sm"
                                    className="cursor-pointer"
                                >
                                    {page}
                                </Button>
                            );
                        })}
                    </div>

                    <Button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        variant="outline"
                        disabled={pagination.page >= pagination.pages}
                        className="cursor-pointer"
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Loading Overlay */}
            {isLoading && products.length > 0 && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Processing...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
