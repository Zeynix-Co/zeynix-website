'use client';

import { Facebook, Instagram, Twitter, Mail, Truck, CreditCard, MapPin } from 'lucide-react';
import Link from 'next/link';
import { colors, colorClasses, brand } from '@/lib/constants';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#070F2B] text-[#FAF6F0] border-t border-white/10 pt-16 pb-8 select-none">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                
                {/* Footer Main Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 mb-12 text-sm">
                    
                    {/* Brand Column (Left) */}
                    <div className="sm:col-span-2 lg:col-span-3 space-y-4">
                        <span className="font-extrabold text-lg tracking-widest block text-white">
                            ZEYNIX
                        </span>
                        <p className="text-xs text-white/50 leading-relaxed font-semibold">
                            Premium streetwear casuals and bespoke print studio. Focused on finest cotton fabrics, tailored comfort, and clean minimalist silhouettes.
                        </p>
                        <div className="flex gap-3">
                            <a 
                                target="_blank" 
                                href="https://www.instagram.com/zeynix.in" 
                                rel="noopener noreferrer" 
                                className="p-2 bg-white/5 hover:bg-[#FFCB05] hover:text-[#070F2B] rounded-lg text-white transition-all shadow-sm"
                            >
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a 
                                target="_blank" 
                                href="https://facebook.com" 
                                rel="noopener noreferrer" 
                                className="p-2 bg-white/5 hover:bg-[#FFCB05] hover:text-[#070F2B] rounded-lg text-white transition-all shadow-sm"
                            >
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a 
                                target="_blank" 
                                href="https://twitter.com" 
                                rel="noopener noreferrer" 
                                className="p-2 bg-white/5 hover:bg-[#FFCB05] hover:text-[#070F2B] rounded-lg text-white transition-all shadow-sm"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Column 1: Shop (Atelier Fits) */}
                    <div className="sm:col-span-1 lg:col-span-2">
                        <h4 className="font-extrabold tracking-widest text-xs text-[#FFCB05] uppercase mb-4">
                            Shop Fits
                        </h4>
                        <ul className="space-y-2.5 text-white/70 text-xs font-semibold">
                            <li><Link href="/products/casual" className="hover:text-[#FFCB05] transition-colors">Streetwear Casuals</Link></li>
                            <li><Link href="/products/casual" className="hover:text-[#FFCB05] transition-colors">Oversized T-Shirts</Link></li>
                            <li><Link href="/products/casual" className="hover:text-[#FFCB05] transition-colors">Hoodies & Sweaters</Link></li>
                            <li><Link href="/products/casual" className="hover:text-[#FFCB05] transition-colors">Signature Graphics</Link></li>
                        </ul>
                    </div>

                    {/* Column 2: Customer Care */}
                    <div className="sm:col-span-1 lg:col-span-2">
                        <h4 className="font-extrabold tracking-widest text-xs text-[#FFCB05] uppercase mb-4">
                            Customer Care
                        </h4>
                        <ul className="space-y-2.5 text-white/70 text-xs font-semibold">
                            <li><Link href="/contact" className="hover:text-[#FFCB05] transition-colors">Contact Atelier</Link></li>
                            <li><Link href="/contact" className="hover:text-[#FFCB05] transition-colors">30-Min Delivery Zone</Link></li>
                            <li><Link href="/about" className="hover:text-[#FFCB05] transition-colors">Size Guide & Styling</Link></li>
                            <li><Link href="/return" className="hover:text-[#FFCB05] transition-colors">Returns & Refunds</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Atelier Story */}
                    <div className="sm:col-span-1 lg:col-span-2">
                        <h4 className="font-extrabold tracking-widest text-xs text-[#FFCB05] uppercase mb-4">
                            Atelier Story
                        </h4>
                        <ul className="space-y-2.5 text-white/70 text-xs font-semibold">
                            <li><Link href="/about" className="hover:text-[#FFCB05] transition-colors">Our Heritage</Link></li>
                            <li><Link href="/about" className="hover:text-[#FFCB05] transition-colors">Fabric Selection</Link></li>
                            <li><Link href="/privacy" className="hover:text-[#FFCB05] transition-colors">Privacy Charter</Link></li>
                            <li><Link href="/terms" className="hover:text-[#FFCB05] transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter Subscription (Right) */}
                    <div className="sm:col-span-1 lg:col-span-3 space-y-4">
                        <h4 className="font-extrabold tracking-widest text-xs text-[#FFCB05] uppercase">
                            Join the Atelier
                        </h4>
                        <p className="text-xs text-white/50 leading-relaxed font-semibold">
                            Subscribe to receive early lookbooks, streetwear drop notifications, and private sales.
                        </p>
                        <form className="flex items-stretch gap-2" onSubmit={(e) => e.preventDefault()}>
                            <input 
                                type="email" 
                                placeholder="Email address" 
                                className="bg-white/5 text-white placeholder-white/30 text-xs px-4 py-2.5 rounded-none border border-white/10 focus:outline-none focus:border-[#FFCB05] flex-1"
                            />
                            <button 
                                type="submit"
                                className="bg-[#FFCB05] text-[#070F2B] font-black uppercase text-[10px] tracking-wider px-4 py-2.5 hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[2px_2px_0px_#B5945B] hover:shadow-[0px_0px_0px_#B5945B]"
                            >
                                Join
                            </button>
                        </form>
                    </div>

                </div>

                {/* Footer Bottom copyright */}
                <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40 font-bold uppercase tracking-wider">
                    <p>© {currentYear} Zeynix.in. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/about" className="hover:text-white transition-colors">Atelier Shipping</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

