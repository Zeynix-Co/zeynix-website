interface ProductDetailPageProps {
    params: Promise<{
        category: string;
        productId: string;
    }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { category, productId } = await params;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Product Details</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">
                    Product details for {productId} in {category} category are yet to add.
                </p>
            </div>
        </div>
    );
} 