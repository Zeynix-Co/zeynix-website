import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { colorClasses } from '@/lib/constants';

interface Order {
    id: string;
    date: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    items: number;
    trackingNumber?: string;
}

const mockOrders: Order[] = [
    {
        id: "ORD-2024-001",
        date: "2024-01-15",
        status: "delivered",
        total: 1497,
        items: 3,
        trackingNumber: "TRK123456789"
    },
    {
        id: "ORD-2024-002",
        date: "2024-01-12",
        status: "shipped",
        total: 899,
        items: 2,
        trackingNumber: "TRK987654321"
    },
    {
        id: "ORD-2024-003",
        date: "2024-01-10",
        status: "processing",
        total: 2499,
        items: 4
    },
    {
        id: "ORD-2024-004",
        date: "2024-01-08",
        status: "pending",
        total: 699,
        items: 1
    },
    {
        id: "ORD-2024-005",
        date: "2024-01-05",
        status: "cancelled",
        total: 1299,
        items: 2
    }
];

const getStatusIcon = (status: Order['status']) => {
    switch (status) {
        case 'pending':
            return <Clock className="w-5 h-5 text-yellow-500" />;
        case 'processing':
            return <Package className="w-5 h-5 text-blue-500" />;
        case 'shipped':
            return <Package className="w-5 h-5 text-purple-500" />;
        case 'delivered':
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'cancelled':
            return <XCircle className="w-5 h-5 text-red-500" />;
        default:
            return <Clock className="w-5 h-5 text-gray-500" />;
    }
};

const getStatusColor = (status: Order['status']) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'processing':
            return 'bg-blue-100 text-blue-800';
        case 'shipped':
            return 'bg-purple-100 text-purple-800';
        case 'delivered':
            return 'bg-green-100 text-green-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default function OrdersPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className={`text-3xl font-bold ${colorClasses.primary.text} mb-2`}>My Orders</h1>
                        <p className="text-gray-600">Track your orders and view order history</p>
                    </div>

                    {/* Orders List */}
                    <div className="space-y-6">
                        {mockOrders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                                {/* Order Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800">{order.id}</h3>
                                        <p className="text-sm text-gray-500">Ordered on {new Date(order.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(order.status)}
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Details */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Items</p>
                                        <p className="font-semibold text-gray-500">{order.items} items</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total</p>
                                        <p className="font-semibold text-gray-500">₹{order.total}</p>
                                    </div>
                                    {order.trackingNumber && (
                                        <div>
                                            <p className="text-sm text-gray-500">Tracking</p>
                                            <p className="font-semibold text-blue-600">{order.trackingNumber}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button className={`px-4 py-2 rounded-md text-sm ${colorClasses.primary.bg} text-white hover:opacity-90 transition-opacity`}>
                                        View Details
                                    </button>
                                    {order.status === 'shipped' && (
                                        <button className="px-4 py-2 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                                            Track Package
                                        </button>
                                    )}
                                    {order.status === 'delivered' && (
                                        <button className="px-4 py-2 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                                            Write Review
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {mockOrders.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
                            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                            <button className={`px-6 py-3 rounded-md ${colorClasses.primary.bg} text-white hover:opacity-90 transition-opacity`}>
                                Start Shopping
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
} 