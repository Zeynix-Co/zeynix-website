'use client';

import { useState } from 'react';
import { ChevronDown, Star, Heart, Filter } from 'lucide-react';
import { colorClasses } from '@/lib/constants';
import { mockProducts, calculateDiscount, Product } from '@/data/products';

const categories = ["All", "T-Shirts", "Shirts", "Jeans", "Pants", "Jackets"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const priceRanges = [
    { label: "Under ₹500", min: 0, max: 500 },
    { label: "₹500 - ₹1000", min: 500, max: 1000 },
    { label: "₹1000 - ₹2000", min: 1000, max: 2000 }
];

export default function FilterProducts() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
    const [showMoreProducts, setShowMoreProducts] = useState(false);

    const filteredProducts = mockProducts.filter(product => {
        const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;
        const sizeMatch = selectedSizes.length === 0 || selectedSizes.some(size => product.size.includes(size));
        const priceMatch = !selectedPriceRange || (() => {
            const range = priceRanges.find(r => r.label === selectedPriceRange);
            return range && product.price >= range.min && product.price <= range.max;
        })();

        return categoryMatch && sizeMatch && priceMatch;
    });

    const displayedProducts = showMoreProducts ? filteredProducts : filteredProducts.slice(0, 6);

    const toggleSize = (size: string) => {
        setSelectedSizes(prev =>
            prev.includes(size)
                ? prev.filter(s => s !== size)
                : [...prev, size]
        );
    };

    return (
        <div className="mx-auto">
            <div className="flex gap-4 md:flex-row md:gap-8">
                {/* Filter Sidebar - 1/4 width */}
                <div className="w-1/4">
                    <div className="bg-white rounded-lg shadow-mg border p-6 sticky top-20 md:top-36">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className={`text-lg font-semibold ${colorClasses.primary.text}`}>Filters</h3>
                            <Filter className={`w-5 h-5 ${colorClasses.primary.text}`} />
                        </div>

                        {/* Category Filter */}
                        <div className="mb-6">
                            <h4 className={`font-medium mb-3 ${colorClasses.primary.text}`}>Category</h4>
                            <div className="space-y-2">
                                {categories.map(category => (
                                    <label key={category} className={`flex items-center gap-2 cursor-pointer ${colorClasses.primary.text}`}>
                                        <input
                                            type="radio"
                                            name="category"
                                            value={category}
                                            checked={selectedCategory === category}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-sm">{category}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Size Filter */}
                        <div className="mb-6">
                            <h4 className={`font-medium mb-3 ${colorClasses.primary.text}`}>Size</h4>
                            <div className="grid md:grid-cols-3 gap-2">
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => toggleSize(size)}
                                        className={`px-3 py-2 text-sm rounded border transition-colors ${selectedSizes.includes(size)
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div className="mb-6">
                            <h4 className={`font-medium mb-3 ${colorClasses.primary.text}`}>Price Range</h4>
                            <div className="space-y-2">
                                {priceRanges.map(range => (
                                    <label key={range.label} className={`flex items-center gap-2 cursor-pointer ${colorClasses.primary.text}`}>
                                        <input
                                            type="radio"
                                            name="priceRange"
                                            value={range.label}
                                            checked={selectedPriceRange === range.label}
                                            onChange={(e) => setSelectedPriceRange(e.target.value)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-sm">{range.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Clear Filters */}
                        <button
                            onClick={() => {
                                setSelectedCategory("All");
                                setSelectedSizes([]);
                                setSelectedPriceRange("");
                            }}
                            className={`w-full p-1 md:py-2 md:px-4 border border-gray-300 rounded-md text-sm hover:border-blue-600 transition-colors ${colorClasses.primary.text}`}
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Products Grid - 3/4 width */}
                <div className="w-3/4">
                    {/* Results Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Trending Products</h2>
                            <p className="text-gray-600">{filteredProducts.length} products found</p>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedProducts.map(product => (
                            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Product Image */}
                                <div className="relative h-64 bg-gray-200">
                                    {product.label && (
                                        <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                            {product.label}
                                        </div>
                                    )}
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        Product Image {product.id}
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="p-4">
                                    {/* Rating */}
                                    <div className="flex items-center mb-2">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                                    </div>

                                    {/* Brand and Name */}
                                    <div className="mb-2">
                                        <p className="font-semibold text-sm text-gray-800">{product.brand}</p>
                                        <p className="text-sm text-gray-600 truncate">{product.name}</p>
                                    </div>

                                    {/* Price and Like */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg text-black">₹{product.price}</span>
                                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                                            <span className="text-xs text-green-600 font-semibold">
                                                {calculateDiscount(product.originalPrice, product.price)}% OFF
                                            </span>
                                        </div>
                                        <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* View More Button */}
                    {filteredProducts.length > 6 && (
                        <div className="text-center mt-8">
                            <button
                                onClick={() => setShowMoreProducts(!showMoreProducts)}
                                className={`px-8 py-3 rounded-md transition-colors ${showMoreProducts
                                    ? `${colorClasses.primary.bg} text-white hover:opacity-90`
                                    : `${colorClasses.primary.bg} text-white hover:opacity-90`
                                    }`}
                            >
                                {showMoreProducts ? 'Show Less' : 'View More'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 