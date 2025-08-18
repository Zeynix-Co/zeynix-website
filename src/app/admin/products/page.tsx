'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductList from '@/components/admin/ProductList';
import ProductForm from '@/components/admin/ProductForm';
import { Button } from '@/components/ui/Button';
import { colorClasses } from '@/lib/constants';

export default function ProductsPage() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit'>('list');
    const [editingProductId, setEditingProductId] = useState<string | null>(null);

    // Handle edit product
    const handleEditProduct = (productId: string) => {
        setEditingProductId(productId);
        setViewMode('edit');
    };

    // Handle add product
    const handleAddProduct = () => {
        console.log('Switching to add mode');
        setViewMode('add');
    };

    // Handle success (after create/edit)
    const handleSuccess = () => {
        setViewMode('list');
        setEditingProductId(null);
        // Optionally refresh the product list
        window.location.reload();
    };

    // Handle back to list
    const handleBackToList = () => {
        setViewMode('list');
        setEditingProductId(null);
    };

    // Render based on view mode
    if (viewMode === 'add') {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Button
                            onClick={handleBackToList}
                            variant="outline"
                            className="mb-4 cursor-pointer"
                        >
                            ← Back to Products
                        </Button>
                        <h1 className={`text-3xl font-bold text-center ${colorClasses.primary.text}`}>
                            Add New Product
                        </h1>
                        <p className="text-gray-600 text-center mt-2">
                            Create a new product for your catalog
                        </p>
                    </div>

                    {/* Product Form */}
                    <ProductForm onSuccess={handleSuccess} />
                </div>
            </div>
        );
    }

    if (viewMode === 'edit') {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Button
                            onClick={handleBackToList}
                            variant="outline"
                            className="mb-4 cursor-pointer"
                        >
                            ← Back to Products
                        </Button>
                        <h1 className={`text-3xl font-bold ${colorClasses.primary.text}`}>
                            Edit Product
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Update product information
                        </p>
                    </div>

                    {/* Product Form */}
                    <ProductForm
                        productId={editingProductId!}
                        onSuccess={handleSuccess}
                    />
                </div>
            </div>
        );
    }

    // Default: List view
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold ${colorClasses.primary.text}`}>
                        Product Management
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage your product catalog, add new products, and update existing ones
                    </p>
                </div>

                {/* Product List */}
                <ProductList
                    onEditProduct={handleEditProduct}
                    onAddProduct={handleAddProduct}
                />
            </div>
        </div>
    );
}
