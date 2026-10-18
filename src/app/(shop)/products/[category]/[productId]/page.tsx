import ProductDetailView from '@/components/product/ProductDetailView';
import { getProductBySlugOrId } from '@/lib/services/productService';
import type { Metadata } from 'next';

interface ProductDetailPageProps {
    params: Promise<{
        category: string;
        productId: string;
    }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
    const { productId } = await params;
    const product = await getProductBySlugOrId(productId);

    if (product) {
        return {
            title: `${product.name || product.title} | ZEYNIX Luxury Streetwear`,
            description: product.description || `Explore the ${product.name} by ZEYNIX. Premium oversized cut luxury streetwear.`,
            openGraph: {
                title: product.name,
                description: product.description,
                images: product.images || [product.image]
            }
        };
    }

    const formattedTitle = productId
        ? productId
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        : 'Product Details';

    return {
        title: `${formattedTitle} | ZEYNIX Luxury Streetwear`,
        description: `Explore the ${formattedTitle} by ZEYNIX. Premium oversized cut, heavyweight French Terry cotton, and signature minimalist luxury streetwear design.`,
    };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { category, productId } = await params;
    const initialProduct = await getProductBySlugOrId(productId);

    return (
        <ProductDetailView
            productIdOrSlug={productId}
            categoryParam={category}
            initialProduct={initialProduct}
        />
    );
}