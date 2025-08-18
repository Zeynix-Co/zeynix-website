'use client';

import OrderList from '@/components/admin/OrderList';
import { colorClasses } from '@/lib/constants';

export default function OrdersPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold ${colorClasses.primary.text}`}>
                        Order Management
                    </h1>
                    <p className="text-gray-600 mt-2">
                        View and manage customer orders, track delivery status, and update order information
                    </p>
                </div>

                {/* Order List */}
                <OrderList />
            </div>
        </div>
    );
}
