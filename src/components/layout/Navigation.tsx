'use client';

import { useState } from 'react';
import { Menu, X, User, ShoppingCart, Heart, Package, LogOut } from 'lucide-react';
import Link from 'next/link';
import { colorClasses, navigation } from '@/lib/constants';

interface MobileNavigationProps {
    isOpen: boolean;
    onClose: () => void;
    isAuthenticated?: boolean;
    user?: any;
    onLogout?: () => void;
}

export default function MobileNavigation({
    isOpen,
    onClose,
    isAuthenticated = false,
    user,
    onLogout
}: MobileNavigationProps) {
    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-40"
                    onClick={onClose}
                />
            )}

            {/* Mobile Menu */}
            <div className={`fixed top-0 right-0 h-full w-60 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out overflow-x-hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="p-6">
                    {/* Close Button */}
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full"
                        >
                            <X className={`w-6 h-6 ${colorClasses.primary.text}`} />
                        </button>
                    </div>

                    {/* User Menu Items */}
                    <div className="space-y-4 mb-6">
                        {isAuthenticated ? (
                            <>
                                {/* User is logged in */}
                                <Link
                                    href="/account"
                                    className="flex items-center space-x-3 p-3 hover:bg-yellow-50 rounded-lg"
                                    onClick={onClose}
                                >
                                    <User className={`w-5 h-5 ${colorClasses.primary.text}`} />
                                    <span className={colorClasses.primary.text}>{user?.name || 'Account'}</span>
                                </Link>

                                <Link
                                    href="/orders"
                                    className="flex items-center space-x-3 p-3 hover:bg-yellow-50 rounded-lg"
                                    onClick={onClose}
                                >
                                    <Package className={`w-5 h-5 ${colorClasses.primary.text}`} />
                                    <span className={colorClasses.primary.text}>Orders</span>
                                </Link>

                                {/* Cart - visible when authenticated */}
                                <Link
                                    href="/cart"
                                    className="flex items-center space-x-3 p-3 hover:bg-yellow-50 rounded-lg"
                                    onClick={onClose}
                                >
                                    <ShoppingCart className={`w-5 h-5 ${colorClasses.primary.text}`} />
                                    <span className={colorClasses.primary.text}>Cart</span>
                                </Link>

                                <Link
                                    href="/wishlist"
                                    className="flex items-center space-x-3 p-3 hover:bg-yellow-50 rounded-lg"
                                    onClick={onClose}
                                >
                                    <Heart className={`w-5 h-5 ${colorClasses.primary.text}`} />
                                    <span className={colorClasses.primary.text}>Wishlist</span>
                                </Link>

                                {/* Logout Button */}
                                <button
                                    onClick={() => {
                                        onLogout?.();
                                        onClose();
                                    }}
                                    className="w-full flex items-center space-x-3 p-3 hover:bg-red-50 rounded-lg text-red-600"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                {/* User is not logged in */}
                                <Link
                                    href="/login"
                                    className="flex items-center space-x-3 p-3 hover:bg-yellow-50 rounded-lg"
                                    onClick={onClose}
                                >
                                    <User className={`w-5 h-5 ${colorClasses.primary.text}`} />
                                    <span className={colorClasses.primary.text}>Login</span>
                                </Link>

                                <Link
                                    href="/register"
                                    className="flex items-center space-x-3 p-3 hover:bg-yellow-50 rounded-lg"
                                    onClick={onClose}
                                >
                                    <User className={`w-5 h-5 ${colorClasses.primary.text}`} />
                                    <span className={colorClasses.primary.text}>Register</span>
                                </Link>

                                <Link
                                    href="/wishlist"
                                    className="flex items-center space-x-3 p-3 hover:bg-yellow-50 rounded-lg"
                                    onClick={onClose}
                                >
                                    <Heart className={`w-5 h-5 ${colorClasses.primary.text}`} />
                                    <span className={colorClasses.primary.text}>Wishlist</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Horizontal Rule */}
                    <hr className="border-gray-200 mb-6" />

                    {/* Category Menu Items */}
                    <div className="space-y-2">
                        <p className={`${colorClasses.primary.text} font-bold`}>Shop by category</p>
                        {navigation.categories.map((category) => (
                            <Link
                                key={category.name}
                                href={category.href}
                                className={`block p-3 hover:bg-yellow-50 rounded-lg ${colorClasses.primary.text}`}
                                onClick={onClose}
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
} 