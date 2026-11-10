import type { IProduct } from '@/lib/models/Product';

// Product transformation utility for converting backend data structure to frontend format
export const transformProduct = (product: IProduct) => ({
    id: product._id?.toString() || '',
    name: product.name || product.title,
    slug: product.slug || product._id?.toString() || '',
    productId: product.productId || product._id?.toString() || '',
    brand: product.brand || 'Zeynix',
    price: product.price || product.discountPrice || product.actualPrice,
    originalPrice: product.originalPrice || product.actualPrice,
    rating: product.rating || 0,
    totalRatings: product.totalRatings || 0,
    image: product.mainImage || (product.images && product.images.length > 0 ? product.images[0] : '/images/products/placeholder.jpg'),
    mainImage: product.mainImage || (product.images && product.images.length > 0 ? product.images[0] : '/images/products/placeholder.jpg'),
    images: product.images || [],
    category: product.category === 'unisexual' ? 'unisex' : (product.category || 'unisex'),
    subcategory: product.subcategory || 't-shirts',
    size: product.sizes && product.sizes.length > 0 ? product.sizes.map((s) => s.size) : ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    label: product.productFit || 'CASUAL FIT',
    productFit: product.productFit || 'CASUAL FIT',
    description: product.description || '',
    inStock: product.sizes && product.sizes.length > 0 ? product.sizes.some((s) => s.inStock) : true,
    availableStock: product.availableStock || (product.sizes && product.sizes.length > 0 ? product.sizes.reduce((tot, s) => tot + (s.stock || 0), 0) : 100),
    featured: product.featured || false,
    discount: product.discount || 0,
    sizes: product.sizes || [],
    colors: product.colors || []
});

export const HALLOWEEN_SLUGS = [
    'spooky-boo-graveyard-ghost-cream-tee',
    'slashers-dream-play-scream-repeat-black-tee',
    'kawaii-pink-bow-ghost-halloween-white-tee',
    'mystic-haunted-mansion-harvest-moon-purple-tee',
    'halloween-rip-still-dead-tee',
    'spookie-peeking-cat-skeletons-tee',
    'halloween-i-scream-spooky-season-black-tee',
    'halloween-kawaii-pink-bow-ghosts-cherry-blossom-pink-tee'
];

export const isHalloweenSlug = (slug?: string | null): boolean => {
    if (!slug) return false;
    const s = slug.toLowerCase();
    return HALLOWEEN_SLUGS.includes(s) || s.includes('halloween');
};

// Base filter for active and published products (excluding hidden Halloween products from storefront)
export const getBaseProductFilter = () => ({
    isActive: true,
    status: 'published',
    slug: { $nin: HALLOWEEN_SLUGS }
});
