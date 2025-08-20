'use client';

import { useState, useRef, useCallback } from 'react';
import { useUploadStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { colorClasses } from '@/lib/constants';

interface ImageUploadProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    disabled?: boolean;
    maxImages?: number;
    userId: string;
}

export default function ImageUpload({
    images,
    onImagesChange,
    disabled = false,
    maxImages = 5,
    userId
}: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadImage, isUploading, error, clearError } = useUploadStore();
    const [dragActive, setDragActive] = useState(false);

    const handleFileSelect = useCallback(async (files: FileList) => {
        if (disabled || isUploading) return;

        const fileArray = Array.from(files);
        const imageFiles = fileArray.filter(file =>
            file.type.startsWith('image/') &&
            ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
        );

        if (imageFiles.length === 0) {
            alert('Please select valid image files (JPEG, PNG, WebP)');
            return;
        }

        if (images.length + imageFiles.length > maxImages) {
            alert(`Maximum ${maxImages} images allowed`);
            return;
        }

        try {
            clearError();

            for (const file of imageFiles) {
                const uploadedImage = await uploadImage(file, userId);
                onImagesChange([...images, uploadedImage.secure_url]);
            }

            // Reset the file input to prevent the dialog from reopening
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
    }, [images, onImagesChange, disabled, isUploading, maxImages, uploadImage, clearError, userId]);

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFileSelect(e.target.files);
        }
    };

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files);
        }
    }, [handleFileSelect]);

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            {/* Error Display */}
            {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
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

            {/* Upload Area */}
            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={!disabled ? openFileDialog : undefined}
            >
                <div className="space-y-2">
                    <div className="text-4xl">📷</div>
                    <p className={`text-lg font-medium ${colorClasses.primary.text}`}>
                        {dragActive ? 'Drop images here' : 'Click to upload or drag & drop'}
                    </p>
                    <p className="text-sm text-gray-500">
                        Supports JPEG, PNG, WebP (Max {maxImages} images, 10MB each)
                    </p>
                    {!disabled && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={openFileDialog}
                            disabled={isUploading}
                            className="mt-2"
                        >
                            {isUploading ? 'Uploading...' : 'Choose Images'}
                        </Button>
                    )}
                </div>
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={disabled || isUploading}
            />

            {/* Image Previews */}
            {images.filter(img => img && img.trim()).length > 0 && (
                <div className="space-y-3">
                    <h4 className={`font-medium ${colorClasses.primary.text}`}>
                        Uploaded Images ({images.filter(img => img && img.trim()).length}/{maxImages})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.filter(img => img && img.trim()).map((image, index) => (
                            <div key={index} className="relative group">
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={image}
                                        alt={`Product image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            target.nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                    <div className="hidden w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                        <div className="text-center">
                                            <span className="text-2xl block mb-1">📷</span>
                                            <span className="text-xs text-gray-500">Image failed to load</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Remove Button */}
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    disabled={disabled}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    ×
                                </button>

                                {/* Image Number */}
                                <div className="absolute top-2 left-2 w-6 h-6 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                    {index + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Uploading...</span>
                        <span>Please wait</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                    </div>
                </div>
            )}
        </div>
    );
}
