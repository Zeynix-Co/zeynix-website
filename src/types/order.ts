export interface Order {
    id: string;
    userId: string;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrderData {
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
    totalAmount: number;
} 