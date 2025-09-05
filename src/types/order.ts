export interface OrderItem {
    productId: string;
    productTitle: string;
    productImage: string;
    size: string;
    quantity: number;
    price: number;
    total: number;
}

export interface ShippingAddress {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

export interface Order {
    id: string;
    userId: string;
    orderNumber: string;
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: ShippingAddress;
    status: 'pending_payment' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentMethod: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrderData {
    items: Array<{
        productId: string;
        size: string;
        quantity: number;
        price: number;
    }>;
    totalAmount: number;
    shippingAddress: ShippingAddress;
}

export interface OrderListResponse {
    success: boolean;
    data: {
        orders: Order[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    };
}

export interface OrderResponse {
    success: boolean;
    data: Order;
} 