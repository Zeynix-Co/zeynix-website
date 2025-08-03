interface CategoryPageProps {
    params: Promise<{
        category: string;
    }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category } = await params;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 capitalize">{category} Products</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Products for {category} are yet to add.</p>
            </div>
        </div>
    );
} 