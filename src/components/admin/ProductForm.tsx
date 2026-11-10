'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProductStore, useAdminStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colorClasses, PRODUCT_CONSTANTS } from '@/lib/constants';
import ImageUpload from './ImageUpload';

interface ProductFormData {
    title: string;
    brand: string;
    category: string;
    description: string;
    actualPrice: number;
    discountPrice: number;
    productFit: string;
    sizes: { size: string; inStock: boolean }[];
    images: string[];
    rating: number;
    featured: boolean;
    status: 'draft' | 'published' | 'archived';
    tags: string;
    launchDate: string;
}

interface ProductFormProps {
    productId?: string; // If provided, we're editing; if not, we're creating
    onSuccess?: () => void;
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CATEGORIES = [
    { id: 'casual', label: 'Streetwear / Casual' },
    { id: 'unisex', label: 'Unisex Collection' },
    { id: 't-shirts', label: 'T-Shirts' },
    { id: 'formal', label: 'Formal Wear' },
    { id: 'ethnic', label: 'Ethnic Wear' },
    { id: 'sports', label: 'Sports Wear' }
];
const PRODUCT_FITS = ['OVERSIZED FIT', 'CASUAL FIT', 'FORMAL FIT', 'CLASSIC FIT', 'SLIM FIT', 'RELAXED FIT'];

const DEFAULT_SIZES = [
    { size: 'XS', inStock: true },
    { size: 'S', inStock: true },
    { size: 'M', inStock: true },
    { size: 'L', inStock: true },
    { size: 'XL', inStock: true },
    { size: 'XXL', inStock: true }
];

export default function ProductForm({ productId, onSuccess }: ProductFormProps) {
    const router = useRouter();
    const { user } = useAdminStore();
    const {
        createProduct,
        updateProduct,
        getProduct,
        currentProduct,
        isLoading,
        error,
        clearError
    } = useProductStore();

    const [imageUrlInput, setImageUrlInput] = useState('');

    // Form state
    const [formData, setFormData] = useState<ProductFormData>({
        title: '',
        brand: 'Zeynix',
        category: 'casual',
        description: '',
        actualPrice: 1349,
        discountPrice: 699,
        productFit: 'OVERSIZED FIT',
        sizes: DEFAULT_SIZES,
        images: [],
        rating: 5,
        featured: false,
        status: 'published',
        tags: '',
        launchDate: ''
    });

    // Form validation errors
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

    // Load product data if editing
    useEffect(() => {
        if (productId && user) {
            getProduct(productId, user.id);
        }
    }, [productId, user, getProduct]);

    // Update form when product data loads
    useEffect(() => {
        if (currentProduct && productId) {
            setFormData({
                title: currentProduct.title || '',
                brand: currentProduct.brand || 'Zeynix',
                category: currentProduct.category || 'casual',
                description: currentProduct.description || '',
                actualPrice: currentProduct.actualPrice || 0,
                discountPrice: currentProduct.discountPrice || (currentProduct as any).price || 0,
                productFit: currentProduct.productFit || 'OVERSIZED FIT',
                sizes: (currentProduct.sizes && currentProduct.sizes.length > 0) ? currentProduct.sizes : DEFAULT_SIZES,
                images: currentProduct.images || [],
                rating: currentProduct.rating || 5,
                featured: currentProduct.featured || false,
                status: (currentProduct.status as any) || 'published',
                tags: currentProduct.tags?.join(', ') || '',
                launchDate: currentProduct.launchDate || ''
            });
        }
    }, [currentProduct, productId]);

    // Handle input changes
    const handleInputChange = (field: keyof ProductFormData, value: string | number | boolean | string[] | any) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: undefined }));
        }

        // Clear global error
        if (error) clearError();
    };

    // Handle size selection
    const handleSizeChange = (size: string, inStock: boolean) => {
        setFormData(prev => {
            const existingSize = prev.sizes.find(s => s.size === size);
            if (existingSize) {
                return {
                    ...prev,
                    sizes: prev.sizes.map(s => s.size === size ? { ...s, inStock } : s)
                };
            } else {
                return {
                    ...prev,
                    sizes: [...prev.sizes, { size, inStock }]
                };
            }
        });
    };

    // Validate form
    const validateForm = () => {
        const errors: Partial<Record<keyof ProductFormData, string>> = {};

        if (!formData.title.trim()) {
            errors.title = 'Product title is required';
        }

        if (!formData.category) {
            errors.category = 'Product category is required';
        }

        if (formData.actualPrice <= 0) {
            errors.actualPrice = 'Original price must be greater than 0';
        }

        if (formData.discountPrice <= 0) {
            errors.discountPrice = 'Discounted price must be greater than 0';
        }

        if (formData.discountPrice >= formData.actualPrice) {
            errors.discountPrice = 'Discounted price must be less than original price';
        }

        if (formData.sizes.length === 0) {
            errors.sizes = 'At least one size must be configured';
        }

        if (formData.images.length === 0) {
            errors.images = 'At least 1 product image is required';
        }

        if (formData.rating < 1 || formData.rating > 5) {
            errors.rating = 'Rating must be between 1 and 5';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !user) return;

        try {
            const productData = {
                ...formData,
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
                images: formData.images,
                discount: discountPercentage,
                isActive: true
            };

            if (productId) {
                // Update existing product
                await updateProduct(productId, productData, user.id);
            } else {
                // Create new product
                await createProduct(productData, user.id);
            }

            // Success callback or redirect
            if (onSuccess) {
                onSuccess();
            } else {
                router.push('/admin/products');
            }
        } catch (error) {
            // Error is handled by the store
            console.error('Product operation failed:', error);
        }
    };

    // Calculate discount percentage
    const discountPercentage = formData.actualPrice > 0
        ? Math.round(((formData.actualPrice - formData.discountPrice) / formData.actualPrice) * 100)
        : 0;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className={`text-2xl font-bold mb-6 ${colorClasses.primary.text}`}>
                    {productId ? 'Edit Product' : 'Add New Product'}
                </h2>

                {/* Global Error Display */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${colorClasses.primary.text}`}>
                                Product Title *
                            </label>
                            <Input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder="Enter product title"
                                className={formErrors.title ? 'border-red-500' : ''}
                                disabled={isLoading}
                            />
                            {formErrors.title && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                            )}
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${colorClasses.primary.text}`}>
                                Brand
                            </label>
                            <select
                                value={formData.brand}
                                onChange={(e) => handleInputChange('brand', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 !text-[#070F2B] bg-white font-medium cursor-pointer shadow-xs"
                                style={{ color: '#070F2B', backgroundColor: '#FFFFFF' }}
                                disabled={isLoading}
                            >
                                <option value="Zeynix" className="!text-[#070F2B] bg-white" style={{ color: '#070F2B', backgroundColor: '#FFFFFF' }}>Zeynix</option>
                                {/* Add more brands later */}
                            </select>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${colorClasses.primary.text}`}>
                                Category *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleInputChange('category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 !text-[#070F2B] bg-white font-medium cursor-pointer shadow-xs"
                                style={{ color: '#070F2B', backgroundColor: '#FFFFFF' }}
                                disabled={isLoading}
                            >
                                {CATEGORIES.map(category => (
                                    <option key={category.id} value={category.id} className="!text-[#070F2B] bg-white" style={{ color: '#070F2B', backgroundColor: '#FFFFFF' }}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${colorClasses.primary.text}`}>
                                Product Fit
                            </label>
                            <select
                                value={formData.productFit}
                                onChange={(e) => handleInputChange('productFit', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 !text-[#070F2B] bg-white font-medium cursor-pointer shadow-xs"
                                style={{ color: '#070F2B', backgroundColor: '#FFFFFF' }}
                                disabled={isLoading}
                            >
                                {PRODUCT_FITS.map(fit => (
                                    <option key={fit} value={fit} className="!text-[#070F2B] bg-white" style={{ color: '#070F2B', backgroundColor: '#FFFFFF' }}>{fit}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${colorClasses.primary.text}`}>
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Enter product description"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-[#070F2B] text-[#070F2B] bg-white"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${colorClasses.primary.text}`}>
                                Original Price (₹) *
                            </label>
                            <Input
                                type="number"
                                value={formData.actualPrice}
                                onChange={(e) => handleInputChange('actualPrice', parseInt(e.target.value) || 0)}
                                placeholder="0"
                                min="0"
                                step="1"
                                className={formErrors.actualPrice ? 'border-red-500' : ''}
                                disabled={isLoading}
                            />
                            {formErrors.actualPrice && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.actualPrice}</p>
                            )}
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${colorClasses.primary.text}`}>
                                Discounted Price (₹) *
                            </label>
                            <Input
                                type="number"
                                value={formData.discountPrice}
                                onChange={(e) => handleInputChange('discountPrice', parseInt(e.target.value) || 0)}
                                placeholder="0"
                                min="0"
                                step="1"
                                className={formErrors.discountPrice ? 'border-red-500' : ''}
                                disabled={isLoading}
                            />
                            {formErrors.discountPrice && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.discountPrice}</p>
                            )}
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${colorClasses.primary.text}`}>
                                Discount Percentage
                            </label>
                            <div className={`px-3 py-2 bg-gray-100 border border-gray-300 rounded-md ${colorClasses.primary.text} font-medium`}>
                                {discountPercentage}%
                            </div>
                        </div>
                    </div>

                    {/* Sizes and Stock */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${colorClasses.primary.text}`}>
                            Product Sizes and Stock *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {AVAILABLE_SIZES.map(size => {
                                const sizeData = formData.sizes.find(s => s.size === size);
                                const inStock = sizeData?.inStock || false;

                                return (
                                    <div key={size} className="border rounded-lg p-3">
                                        <div className={`text-center font-medium mb-2 ${colorClasses.primary.text}`}>{size}</div>
                                        <div className="space-y-2">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name={`size-${size}`}
                                                    checked={inStock}
                                                    onChange={() => handleSizeChange(size, true)}
                                                    className="mr-2"
                                                    disabled={isLoading}
                                                />
                                                <span className={`${colorClasses.primary.text}`}>In Stock</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name={`size-${size}`}
                                                    checked={!inStock}
                                                    onChange={() => handleSizeChange(size, false)}
                                                    className="mr-2"
                                                    disabled={isLoading}
                                                />
                                                <span className={`${colorClasses.primary.text}`}>Out of Stock</span>
                                            </label>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {formErrors.sizes && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.sizes}</p>
                        )}
                    </div>

                    {/* Images */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className={`block text-sm font-medium ${colorClasses.primary.text}`}>
                                Product Images * (At least 1 image)
                            </label>
                            <span className="text-xs text-gray-500 font-medium">
                                {formData.images.length} / 5 uploaded
                            </span>
                        </div>

                        {/* Existing Images Thumbnail Preview */}
                        {formData.images.length > 0 && (
                            <div className="flex flex-wrap gap-3 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                {formData.images.map((img, index) => (
                                    <div key={index} className="relative group w-20 h-24 rounded-md overflow-hidden border border-gray-300 bg-white shadow-xs">
                                        <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-contain" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updated = formData.images.filter((_, i) => i !== index);
                                                handleInputChange('images', updated);
                                            }}
                                            className="absolute top-1 right-1 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-xs opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                                            title="Remove image"
                                        >
                                            ×
                                        </button>
                                        {index === 0 && (
                                            <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[9px] text-white text-center font-bold uppercase py-0.5">
                                                Main
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <ImageUpload
                            images={formData.images}
                            onImagesChange={(newImages: string[]) => handleInputChange('images', newImages)}
                            disabled={isLoading}
                            maxImages={5}
                            userId={user?.id || ''}
                        />

                        {/* Direct Image Path/URL Input */}
                        <div className="flex gap-2 mt-2">
                            <Input
                                type="text"
                                placeholder="Or enter image URL / path (e.g. /images/products/...)"
                                value={imageUrlInput}
                                onChange={(e) => setImageUrlInput(e.target.value)}
                                className="flex-1 text-xs"
                                disabled={isLoading || formData.images.length >= 5}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    if (imageUrlInput.trim() && formData.images.length < 5) {
                                        handleInputChange('images', [...formData.images, imageUrlInput.trim()]);
                                        setImageUrlInput('');
                                    }
                                }}
                                disabled={!imageUrlInput.trim() || formData.images.length >= 5 || isLoading}
                                className="text-xs cursor-pointer"
                            >
                                + Add URL
                            </Button>
                        </div>

                        {formErrors.images && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.images}</p>
                        )}
                    </div>

                    {/* Additional Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${colorClasses.primary.text}`}>
                                Rating (1-5)
                            </label>
                            <Input
                                type="number"
                                value={formData.rating}
                                onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || 5)}
                                min="1"
                                step="0.1"
                                max="5"
                                className={formErrors.rating ? 'border-red-500' : ''}
                                disabled={isLoading}
                            />
                            {formErrors.rating && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.rating}</p>
                            )}
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${colorClasses.primary.text}`}>
                                Visibility &amp; Status *
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleInputChange('status', e.target.value as 'draft' | 'published' | 'archived')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 !text-[#070F2B] bg-white font-medium cursor-pointer shadow-xs"
                                style={{ color: '#070F2B', backgroundColor: '#FFFFFF' }}
                                disabled={isLoading}
                            >
                                <option value="published" className="!text-[#070F2B] bg-white" style={{ color: '#070F2B', backgroundColor: '#FFFFFF' }}>🟢 Live on Store (Published)</option>
                                <option value="draft" className="!text-[#070F2B] bg-white" style={{ color: '#070F2B', backgroundColor: '#FFFFFF' }}>🟡 Hidden from Store (Draft)</option>
                                <option value="archived" className="!text-[#070F2B] bg-white" style={{ color: '#070F2B', backgroundColor: '#FFFFFF' }}>📦 Archived</option>
                            </select>
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="flex items-center space-x-6">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) => handleInputChange('featured', e.target.checked)}
                                className="mr-2"
                                disabled={isLoading}
                            />
                            <span className={`text-sm font-medium ${colorClasses.primary.text}`}>Featured Product</span>
                        </label>
                    </div>

                    {/* Optional Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${colorClasses.primary.text}`}>
                                Tags (comma-separated)
                            </label>
                            <Input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => handleInputChange('tags', e.target.value)}
                                placeholder="casual, comfortable, trendy"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        <Button
                            type="button"
                            onClick={() => router.back()}
                            variant="outline"
                            className="cursor-pointer"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="cursor-pointer"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? (productId ? 'Updating...' : 'Creating...')
                                : (productId ? 'Update Product' : 'Create Product')
                            }
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
