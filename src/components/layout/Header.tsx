'use client';

import { useState } from 'react';
import { Search, User, ShoppingCart, Menu, Heart, Package, Clock6Icon, LogOut, UserCheckIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { colors, colorClasses, navigation } from '@/lib/constants';
import MobileNavigation from './Navigation';
import { useAuthStore } from '@/store';
import CartIcon from '@/components/cart/CartIcon';
import WishlistIcon from '@/components/wishlist/WishlistIcon';
import SearchBar from './SearchBar';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        // Redirect to home page after logout
        window.location.href = '/';
    };

    return (
        <>
            <header className={`${colorClasses.primary.bg} text-white sticky top-0 z-30 shadow-lg`}>
                {/* Main Header */}
                <div className="md:mx-20 px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center space-x-4">
                            <Link href="/" className=" items-center">
                                <Image
                                    src="/images/logos/zeynix-logo-rbg.png"
                                    alt="Zeynix Logo"
                                    width={200}
                                    height={200}
                                    className="md:h-15 md:w-15 h-12 w-16 rounded-lg"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* Enhanced Search Bar */}
                        <div className="w-full mx-4 max-w-md">
                            <SearchBar />
                        </div>

                        {/* Desktop Navigation Icons - Hidden on mobile */}
                        <div className="hidden md:flex items-center space-x-6">
                            {isAuthenticated ? (
                                <>
                                    {/* User is logged in */}
                                    <Link
                                        href="/account"
                                        className={`flex flex-row items-center space-x-2 ${colorClasses.secondary.text} cursor-pointer hover:opacity-80 transition-opacity`}
                                    >
                                        <UserCheckIcon className={`w-6 h-6 mb-1 ${colorClasses.light.text}`} />
                                        <span className="text-md">{user?.name || 'Account'}</span>
                                    </Link>
                                    <Link
                                        href="/orders"
                                        className={`flex flex-row items-center space-x-2 ${colorClasses.secondary.text} cursor-pointer hover:opacity-80 transition-opacity`}
                                    >
                                        <Package className={`w-6 h-6 mb-1 ${colorClasses.light.text}`} />
                                        <span className="text-md">Orders</span>
                                    </Link>
                                    {/* Cart Icon - Only visible when authenticated */}
                                    <CartIcon />
                                    {/* Wishlist Icon - Only visible when authenticated */}
                                    <WishlistIcon />
                                    <button
                                        onClick={handleLogout}
                                        className={`flex flex-row items-center space-x-2 ${colorClasses.secondary.text} hover:opacity-80 transition-opacity cursor-pointer`}
                                    >
                                        <LogOut className={`w-6 h-6 mb-1 ${colorClasses.light.text}`} />
                                        <span className="text-md">Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* User is not logged in */}
                                    <Link
                                        href="/login"
                                        className={`flex flex-row items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer ${colorClasses.secondary.text}`}
                                    >
                                        <UserCheckIcon className={`w-6 h-6 mb-1 ${colorClasses.light.text}`} />
                                        <span className="text-md">Login</span>
                                    </Link>
                                    <Link
                                        href="/register"
                                        className={`flex flex-row items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer ${colorClasses.secondary.text}`}
                                    >
                                        <User className={`w-6 h-6 mb-1 ${colorClasses.light.text}`} />
                                        <span className="text-md">Register</span>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Hamburger Menu */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className={`p-2 ${colorClasses.secondary.text}`}
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Secondary Navigation - Hidden on mobile */}
                <div className={`hidden md:block ${colorClasses.secondary.bg} ${colorClasses.primary.text}`}>
                    <div className="container mx-auto px-4 py-2">
                        <div className="flex items-center justify-between">
                            <nav className="flex items-center space-x-8">
                                {navigation.categories.map((category) => (
                                    <Link
                                        key={category.name}
                                        href={category.href}
                                        className="font-medium"
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </nav>

                            <div className="flex items-center space-x-2">
                                <Link href="/wishlist" className="flex items-center space-x-2">
                                    <Heart className="w-6 h-6 mb-1" />
                                    <span className="font-medium">Wishlist</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation */}
            <MobileNavigation
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
            />
        </>
    );
}



