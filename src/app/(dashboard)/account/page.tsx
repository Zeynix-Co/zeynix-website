'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colorClasses } from '@/lib/constants';
import { User, Package, Settings, LogOut, Edit3, Lock, MapPin } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function UserDashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Profile edit form state
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    // Password change form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Mock orders data (will be replaced with API call)
    const [orders, setOrders] = useState([
        {
            id: '1',
            orderNumber: 'ORD-001',
            date: '2025-01-15',
            status: 'delivered',
            total: 1299,
            items: ['Kurta', 'Zeynix Oversized']
        },
        {
            id: '2',
            orderNumber: 'ORD-002',
            date: '2025-01-10',
            status: 'confirmed',
            total: 899,
            items: ['Kurta']
        }
    ]);

    useEffect(() => {
        if (user) {
            setProfileForm({
                name: user.name,
                email: user.email,
                phone: user.phone,
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // TODO: Implement profile update API call
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            setIsEditing(false);
            // TODO: Update user in store
        } catch (error) {
            console.error('Profile update failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // TODO: Implement password change API call
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            // TODO: Show success message
        } catch (error) {
            console.error('Password change failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                        <p className="text-gray-600">Manage your profile, orders, and account settings</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Navigation */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="space-y-4">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'profile'
                                            ? `${colorClasses.primary.bg} text-white`
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <User className="w-5 h-5" />
                                        <span>Profile</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab('orders')}
                                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'orders'
                                            ? `${colorClasses.primary.bg} text-white`
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Package className="w-5 h-5" />
                                        <span>Orders</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab('settings')}
                                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'settings'
                                            ? `${colorClasses.primary.bg} text-white`
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Settings className="w-5 h-5" />
                                        <span>Settings</span>
                                    </button>
                                </div>

                                <hr className="my-6" />

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                                        {!isEditing && (
                                            <Button
                                                onClick={() => setIsEditing(true)}
                                                variant="outline"
                                                className="flex items-center space-x-2"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                                <span>Edit Profile</span>
                                            </Button>
                                        )}
                                    </div>

                                    {isEditing ? (
                                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Full Name
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        value={profileForm.name}
                                                        onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                                                        className="w-full"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Email
                                                    </label>
                                                    <Input
                                                        type="email"
                                                        value={profileForm.email}
                                                        onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                                                        className="w-full"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Phone
                                                    </label>
                                                    <Input
                                                        type="tel"
                                                        value={profileForm.phone}
                                                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                                                        className="w-full"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex space-x-3">
                                                <Button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="flex items-center space-x-2"
                                                >
                                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setIsEditing(false)}
                                                    disabled={isLoading}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                                        Full Name
                                                    </label>
                                                    <p className="text-gray-900">{user?.name}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                                        Email
                                                    </label>
                                                    <p className="text-gray-900">{user?.email}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                                        Phone
                                                    </label>
                                                    <p className="text-gray-900">{user?.phone}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                                        Member Since
                                                    </label>
                                                    <p className="text-gray-900">January 2025</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Orders Tab */}
                            {activeTab === 'orders' && (
                                <div className="bg-white rounded-lg shadow p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>

                                    {orders.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500">No orders yet</p>
                                            <Button
                                                onClick={() => router.push('/products')}
                                                className="mt-4"
                                            >
                                                Start Shopping
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <div key={order.id} className="border rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">
                                                                {order.orderNumber}
                                                            </h3>
                                                            <p className="text-sm text-gray-500">
                                                                {new Date(order.date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-gray-900">
                                                                ₹{order.total}
                                                            </p>
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        <p>Items: {order.items.join(', ')}</p>
                                                    </div>
                                                    <div className="mt-3 pt-3 border-t">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.push(`/orders/${order.id}`)}
                                                        >
                                                            View Details
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Settings Tab */}
                            {activeTab === 'settings' && (
                                <div className="bg-white rounded-lg shadow p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>

                                    {/* Change Password */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <Lock className="w-5 h-5 mr-2" />
                                            Change Password
                                        </h3>

                                        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Current Password
                                                </label>
                                                <Input
                                                    type="password"
                                                    value={passwordForm.currentPassword}
                                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                                    className="w-full"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    New Password
                                                </label>
                                                <Input
                                                    type="password"
                                                    value={passwordForm.newPassword}
                                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                                    className="w-full"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Confirm New Password
                                                </label>
                                                <Input
                                                    type="password"
                                                    value={passwordForm.confirmPassword}
                                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                    className="w-full"
                                                    required
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={isLoading}
                                                className="flex items-center space-x-2"
                                            >
                                                {isLoading ? 'Changing Password...' : 'Change Password'}
                                            </Button>
                                        </form>
                                    </div>

                                    {/* Account Actions */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
                                        <div className="space-y-3">
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                Deactivate Account
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                Delete Account
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
} 