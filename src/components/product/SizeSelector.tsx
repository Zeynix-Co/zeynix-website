'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface Size {
    size: string;
    stock: number;
    inStock: boolean;
}

interface SizeSelectorProps {
    sizes: Size[];
    selectedSize: string;
    onSizeSelect: (size: string) => void;
    showStockStatus?: boolean;
}

export default function SizeSelector({
    sizes,
    selectedSize,
    onSizeSelect,
    showStockStatus = true
}: SizeSelectorProps) {
    const [showSizeGuide, setShowSizeGuide] = useState(false);

    const getSizeStatus = (size: Size) => {
        if (!size.inStock) return 'out-of-stock';
        if (size.stock <= 5) return 'low-stock';
        return 'in-stock';
    };

    const getSizeStatusColor = (status: string) => {
        switch (status) {
            case 'out-of-stock':
                return 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed';
            case 'low-stock':
                return 'border-orange-300 bg-orange-50 text-orange-700 hover:border-orange-400';
            case 'in-stock':
                return 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50';
            default:
                return 'border-gray-300 bg-white text-gray-700 hover:border-gray-400';
        }
    };

    const getSizeStatusText = (status: string, stock: number) => {
        switch (status) {
            case 'out-of-stock':
                return 'Out of Stock';
            case 'low-stock':
                return `Only ${stock} left`;
            case 'in-stock':
                return stock > 10 ? 'In Stock' : `${stock} available`;
            default:
                return '';
        }
    };

    return (
        <div className="space-y-4">
            {/* Size Selection Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Select Size</h3>
                <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Size Guide
                </button>
            </div>

            {/* Size Grid */}
            <div className="grid grid-cols-3 gap-3">
                {sizes.map((sizeData) => {
                    const status = getSizeStatus(sizeData);
                    const isSelected = selectedSize === sizeData.size;
                    const isDisabled = status === 'out-of-stock';

                    return (
                        <button
                            key={sizeData.size}
                            onClick={() => !isDisabled && onSizeSelect(sizeData.size)}
                            disabled={isDisabled}
                            className={`
                                p-3 border-2 rounded-lg text-center font-medium transition-all relative
                                ${isSelected
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : getSizeStatusColor(status)
                                }
                                ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                            `}
                        >
                            {sizeData.size}

                            {/* Stock Status Badge */}
                            {showStockStatus && status !== 'in-stock' && (
                                <div className="absolute -top-2 -right-2">
                                    <div className={`
                                        px-2 py-1 text-xs font-medium rounded-full
                                        ${status === 'out-of-stock'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-orange-100 text-orange-800'
                                        }
                                    `}>
                                        {getSizeStatusText(status, sizeData.stock)}
                                    </div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Size Guide Modal */}
            {showSizeGuide && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-700">
                            <h4 className="font-medium mb-2">Size Guide</h4>
                            <div className="space-y-2">
                                <div className="grid grid-cols-3 gap-4 text-xs">
                                    <div>
                                        <span className="font-medium">M:</span> Chest 38-40", Waist 32-34"
                                    </div>
                                    <div>
                                        <span className="font-medium">L:</span> Chest 40-42", Waist 34-36"
                                    </div>
                                    <div>
                                        <span className="font-medium">XL:</span> Chest 42-44", Waist 36-38"
                                    </div>
                                    <div>
                                        <span className="font-medium">XXL:</span> Chest 44-46", Waist 38-40"
                                    </div>
                                    <div>
                                        <span className="font-medium">XXXL:</span> Chest 46-48", Waist 40-42"
                                    </div>
                                </div>
                                <p className="text-gray-600 mt-2">
                                    Measurements are approximate. For best fit, measure your chest and waist.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Stock Information */}
            <div className="text-sm text-gray-600">
                <p>• Select your size to see availability</p>
                <p>• Free returns within 30 days</p>
            </div>
        </div>
    );
} 