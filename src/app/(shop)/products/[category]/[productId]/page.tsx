import ProductDetailView from '@/components/product/ProductDetailView';
import type { Metadata } from 'next';

interface ProductDetailPageProps {
    params: Promise<{
        category: string;
        productId: string;
    }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
    const { productId } = await params;
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

    return (
        <ProductDetailView
            productIdOrSlug={productId}
            categoryParam={category}
        />
    );
}