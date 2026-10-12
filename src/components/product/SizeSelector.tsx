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
        // Always show as in stock for now
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
        // Always show as in stock for now
        return 'In Stock';
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
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-700 w-full">
                            <h4 className="font-bold text-[#070F2B] mb-2 uppercase text-xs tracking-wider">
                                Drop Shoulder Oversized Fit (Inches)
                            </h4>
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                                    <div className="p-2 bg-white rounded-lg border border-gray-100">
                                        <span className="font-black text-[#070F2B]">S:</span> Length 28&quot;, Chest 40&quot;, Shoulder 23&quot;
                                    </div>
                                    <div className="p-2 bg-white rounded-lg border border-gray-100">
                                        <span className="font-black text-[#070F2B]">M:</span> Length 29&quot;, Chest 42&quot;, Shoulder 24&quot;
                                    </div>
                                    <div className="p-2 bg-white rounded-lg border border-gray-100">
                                        <span className="font-black text-[#070F2B]">L:</span> Length 30&quot;, Chest 44&quot;, Shoulder 25&quot;
                                    </div>
                                    <div className="p-2 bg-white rounded-lg border border-gray-100">
                                        <span className="font-black text-[#070F2B]">XL:</span> Length 31&quot;, Chest 46&quot;, Shoulder 26&quot;
                                    </div>
                                    <div className="p-2 bg-white rounded-lg border border-gray-100">
                                        <span className="font-black text-[#070F2B]">XXL:</span> Length 32&quot;, Chest 48&quot;, Shoulder 27&quot;
                                    </div>
                                </div>
                                <p className="text-gray-500 text-[11px] mt-2 font-medium">
                                    For the perfect fit, measure a t-shirt you already own from shoulder seam to hem and underarm to underarm.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Stock Information */}
            <div className="text-sm text-gray-600">
                <p>• Select your size to see availability</p>
                <p>• Flash delivery within 3 days</p>
            </div>
        </div>
    );
} 