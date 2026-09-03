'use client';

import { X, User, ShoppingCart, Heart, Package, LogOut, ShoppingBag, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { navigation } from '@/lib/constants';

interface NavigationProps {
    isOpen: boolean;
    onClose: () => void;
    isAuthenticated: boolean;
    user: {
        name: string;
        email: string;
    } | null;
    onLogout: () => void;
}

export default function MobileNavigation({
    isOpen,
    onClose,
    isAuthenticated = false,
    user,
    onLogout
}: NavigationProps) {
    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 backdrop-blur-md bg-black/60 z-40 transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Mobile Menu Slide-out Drawer */}
            <div 
                className={`fixed top-0 right-0 h-[100dvh] max-h-[100dvh] w-[85vw] max-w-xs sm:w-80 bg-[#070F2B] text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-white/10 flex flex-col overflow-hidden ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header: Title and Close Button (Fixed Top) */}
                <div className="shrink-0 flex items-center justify-between p-5 sm:p-6 border-b border-white/10">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Navigation</span>
                        <span className="text-lg font-bold text-white tracking-wide">ZEYNIX</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer focus:outline-none"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                {/* User Greeting Banner (Fixed Top) */}
                <div className="shrink-0 px-5 sm:px-6 py-4 bg-[#00274C]/30 border-b border-white/5">
                    {isAuthenticated ? (
                        <div>
                            <p className="text-xs text-gray-400">Welcome back,</p>
                            <p className="text-base font-bold text-[#FFCB05] truncate">{user?.name}</p>
                            <p className="text-xs text-white/50 truncate mt-0.5">{user?.email}</p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm font-semibold text-white">Experience premium luxury fashion.</p>
                            <p className="text-xs text-[#FFCB05] mt-0.5 font-medium">Join us today</p>
                        </div>
                    )}
                </div>

                {/* Scrollable Navigation Body */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-6">
                    <div className="space-y-3">
                        <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Categories</p>
                        <div className="grid gap-1.5">
                            {navigation.categories.map((category) => (
                                <Link
                                    key={category.name}
                                    href={category.href}
                                    className="flex items-center space-x-3 p-2.5 hover:bg-white/5 rounded-xl transition-all duration-200 group border-l-2 border-transparent hover:border-[#FFCB05]"
                                    onClick={onClose}
                                >
                                    <ShoppingBag className="w-5 h-5 text-white/60 group-hover:text-[#FFCB05] transition-colors shrink-0" />
                                    <span className="text-sm font-semibold tracking-wide text-white/90 group-hover:text-white">{category.name}</span>
                                </Link>
                            ))}
                            <Link
                                href="/products"
                                className="flex items-center space-x-3 p-2.5 hover:bg-white/5 rounded-xl transition-all duration-200 group border-l-2 border-transparent hover:border-[#FFCB05]"
                                onClick={onClose}
                            >
                                <ShoppingBag className="w-5 h-5 text-white/60 group-hover:text-[#FFCB05] transition-colors shrink-0" />
                                <span className="text-sm font-semibold tracking-wide text-[#FFCB05] group-hover:text-white">View All Products</span>
                            </Link>
                        </div>
                    </div>

                    {/* User Account / Navigation Actions */}
                    <div className="space-y-3">
                        <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Account & Actions</p>
                        <div className="grid gap-1.5">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/account"
                                        className="flex items-center space-x-3 p-2.5 hover:bg-white/5 rounded-xl transition-all duration-200 group border-l-2 border-transparent hover:border-[#FFCB05]"
                                        onClick={onClose}
                                    >
                                        <User className="w-5 h-5 text-white/60 group-hover:text-[#FFCB05] transition-colors shrink-0" />
                                        <span className="text-sm font-semibold text-white/90 group-hover:text-white">My Profile</span>
                                    </Link>

                                    <Link
                                        href="/orders"
                                        className="flex items-center space-x-3 p-2.5 hover:bg-white/5 rounded-xl transition-all duration-200 group border-l-2 border-transparent hover:border-[#FFCB05]"
                                        onClick={onClose}
                                    >
                                        <Package className="w-5 h-5 text-white/60 group-hover:text-[#FFCB05] transition-colors shrink-0" />
                                        <span className="text-sm font-semibold text-white/90 group-hover:text-white">My Orders</span>
                                    </Link>

                                    <Link
                                        href="/cart"
                                        className="flex items-center space-x-3 p-2.5 hover:bg-white/5 rounded-xl transition-all duration-200 group border-l-2 border-transparent hover:border-[#FFCB05]"
                                        onClick={onClose}
                                    >
                                        <ShoppingCart className="w-5 h-5 text-white/60 group-hover:text-[#FFCB05] transition-colors shrink-0" />
                                        <span className="text-sm font-semibold text-white/90 group-hover:text-white">Shopping Cart</span>
                                    </Link>

                                    <Link
                                        href="/wishlist"
                                        className="flex items-center space-x-3 p-2.5 hover:bg-white/5 rounded-xl transition-all duration-200 group border-l-2 border-transparent hover:border-[#FFCB05]"
                                        onClick={onClose}
                                    >
                                        <Heart className="w-5 h-5 text-white/60 group-hover:text-[#FFCB05] transition-colors shrink-0" />
                                        <span className="text-sm font-semibold text-white/90 group-hover:text-white">Wishlist</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/wishlist"
                                        className="flex items-center space-x-3 p-2.5 hover:bg-white/5 rounded-xl transition-all duration-200 group border-l-2 border-transparent hover:border-[#FFCB05]"
                                        onClick={onClose}
                                    >
                                        <Heart className="w-5 h-5 text-white/60 group-hover:text-[#FFCB05] transition-colors shrink-0" />
                                        <span className="text-sm font-semibold text-white/90 group-hover:text-white">Wishlist</span>
                                    </Link>
                                    <Link
                                        href="/cart"
                                        className="flex items-center space-x-3 p-2.5 hover:bg-white/5 rounded-xl transition-all duration-200 group border-l-2 border-transparent hover:border-[#FFCB05]"
                                        onClick={onClose}
                                    >
                                        <ShoppingCart className="w-5 h-5 text-white/60 group-hover:text-[#FFCB05] transition-colors shrink-0" />
                                        <span className="text-sm font-semibold text-white/90 group-hover:text-white">Cart</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Drawer Action (Auth / Logout) (Pinned Bottom) */}
                <div className="shrink-0 p-4 sm:p-6 border-t border-white/10 bg-[#00274C]/30">
                    {isAuthenticated ? (
                        <button
                            onClick={() => {
                                onLogout?.();
                                onClose();
                            }}
                            className="w-full flex items-center justify-center space-x-3 p-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all duration-300 font-semibold cursor-pointer border border-red-500/20"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                href="/login"
                                className="flex items-center justify-center space-x-1.5 p-3 border border-white/20 hover:border-white rounded-xl text-center text-sm font-semibold transition-all duration-200"
                                onClick={onClose}
                            >
                                <LogIn className="w-4 h-4" />
                                <span>Login</span>
                            </Link>
                            <Link
                                href="/register"
                                className="flex items-center justify-center space-x-1.5 p-3 bg-[#FFCB05] hover:bg-[#FFCB05]/90 text-[#070F2B] rounded-xl text-center text-sm font-bold transition-all duration-200"
                                onClick={onClose}
                            >
                                <UserPlus className="w-4 h-4" />
                                <span>Register</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}