'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, User, Menu, Package, LogOut, UserCheckIcon, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { navigation } from '@/lib/constants';
import MobileNavigation from './Navigation';
import { useAuthStore } from '@/store';
import CartIcon from '@/components/cart/CartIcon';
import WishlistIcon from '@/components/wishlist/WishlistIcon';
import SearchBar from './SearchBar';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    
    const { user, isAuthenticated, logout } = useAuthStore();
    const profileRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    // Scroll listener for sticky frosted glass effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Click outside listener for profile dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <header 
                className={`sticky top-0 z-40 transition-all duration-300 w-full border-b ${
                    isScrolled 
                        ? 'bg-[#070F2B]/95 backdrop-blur-md shadow-2xl py-1 border-white/15' 
                        : 'bg-[#070F2B] py-2 border-white/5'
                }`}
            >
                <div className="container mx-auto px-3 sm:px-4 md:px-8">
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                        {/* Logo (Left) */}
                        <div className="flex items-center shrink-0">
                            <Link href="/" className="flex items-center">
                                <Image
                                    src="/images/logos/zeynix-logo-rbg.png"
                                    alt="Zeynix Logo"
                                    width={200}
                                    height={65}
                                    className="h-11 sm:h-14 md:h-20 w-auto rounded-lg object-contain"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* Centered Category Navigation (Desktop Center) */}
                        <nav className="hidden lg:flex items-center justify-center space-x-12 text-base font-bold tracking-wider uppercase flex-1">
                            {navigation.categories.map((category) => (
                                <Link
                                    key={category.name}
                                    href={category.href}
                                    className="relative text-white/95 hover:text-[#FFCB05] transition-colors py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#FFCB05] hover:after:w-full after:transition-all after:duration-300"
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Actions (Desktop & Mobile Right) */}
                        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 shrink-0">
                            
                            {/* Unified Search Toggle Icon (Desktop & Mobile) */}
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="p-1.5 sm:p-2 text-white hover:text-[#FFCB05] transition-colors focus:outline-none cursor-pointer"
                                aria-label="Toggle Search"
                            >
                                {isSearchOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Search className="w-5 h-5 sm:w-6 sm:h-6" />}
                            </button>

                            {/* Wishlist Icon */}
                            <WishlistIcon 
                                showText={false} 
                                className="relative p-1.5 sm:p-2 text-white hover:text-[#FFCB05] transition-colors duration-200 cursor-pointer" 
                                iconClassName="w-5 h-5 sm:w-6 sm:h-6" 
                            />

                            {/* Cart Icon */}
                            <CartIcon 
                                showText={false} 
                                className="relative p-1.5 sm:p-2 text-white hover:text-[#FFCB05] transition-colors duration-200 flex items-center cursor-pointer" 
                                iconClassName="w-5 h-5 sm:w-6 sm:h-6" 
                            />

                            {/* Divider (Desktop Only) */}
                            <span className="hidden md:block h-6 w-[1px] bg-white/20"></span>

                            {/* Profile Dropdown (Desktop Only) */}
                            <div className="hidden md:block relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-1.5 p-2 text-white hover:text-[#FFCB05] transition-colors duration-200 cursor-pointer focus:outline-none rounded-lg hover:bg-white/5"
                                >
                                    <User className="w-6 h-6" />
                                    {isAuthenticated && (
                                        <span className="max-w-[100px] truncate text-sm font-semibold">
                                            {user?.name.split(' ')[0]}
                                        </span>
                                    )}
                                </button>
                                
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-52 bg-[#070F2B] border border-white/10 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-md bg-opacity-95 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        {isAuthenticated ? (
                                            <>
                                                <div className="px-4 py-2.5 border-b border-white/10">
                                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Signed in as</p>
                                                    <p className="text-sm font-semibold truncate text-[#FFCB05]">{user?.name}</p>
                                                </div>
                                                <Link
                                                    href="/account"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center space-x-3 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                                                >
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    <span>My Profile</span>
                                                </Link>
                                                <Link
                                                    href="/orders"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center space-x-3 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                                                >
                                                    <Package className="w-4 h-4 text-gray-400" />
                                                    <span>My Orders</span>
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setIsProfileOpen(false);
                                                        handleLogout();
                                                    }}
                                                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span>Logout</span>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    href="/login"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center space-x-3 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                                                >
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    <span>Login</span>
                                                </Link>
                                                <Link
                                                    href="/register"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center space-x-3 px-4 py-2.5 text-sm text-[#FFCB05] hover:bg-white/10 transition-colors"
                                                >
                                                    <UserCheckIcon className="w-4 h-4" />
                                                    <span>Register</span>
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Mobile Hamburger Menu (Hidden on Desktop) */}
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="md:hidden p-2 text-white hover:text-[#FFCB05] transition-colors focus:outline-none cursor-pointer"
                                aria-label="Open Menu"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Unified Search Dropdown Overlay */}
                    {isSearchOpen && (
                        <div className="mt-4 pb-2 pt-3 border-t border-white/10 animate-in slide-in-from-top duration-200">
                            <div className="max-w-2xl mx-auto">
                                <SearchBar />
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Mobile Navigation Drawer */}
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
