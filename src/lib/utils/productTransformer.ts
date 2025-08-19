// Product transformation utility for converting backend data structure to frontend format
export const transformProduct = (product: any) => ({
    id: product._id.toString(),
    name: product.title,
    brand: product.brand || 'Zeynix',
    price: product.discountPrice || product.actualPrice,
    originalPrice: product.actualPrice,
    rating: product.rating || 0,
    image: product.images && product.images.length > 0 ? product.images[0] : '/images/products/placeholder.jpg',
    images: product.images || [],
    category: product.category || 'casual',
    size: product.sizes && product.sizes.length > 0 ? product.sizes.map((s: any) => s.size) : ['M', 'L', 'XL'],
    label: product.productFit || 'CASUAL FIT',
    description: product.description || '',
    inStock: product.sizes && product.sizes.length > 0 ? product.sizes.some((s: any) => s.inStock) : true,
    featured: product.featured || false,
    discount: product.discount || 0,
    sizes: product.sizes // Keep original sizes for detailed view
});

// Base filter for active and published products
export const getBaseProductFilter = () => ({
    isActive: true,
    status: 'published'
});
