'use client';

import Image from 'next/image';
import { Instagram, Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import Link from 'next/link';

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
                            Premium streetwear and bespoke print atelier. Focused on finest cotton fabrics, tailored comfort, and clean minimalist silhouettes.
                        </p>
                        <div className="flex gap-3">
                            <a 
                                target="_blank" 
                                href="https://www.instagram.com/zeynix.in" 
                                rel="noopener noreferrer" 
                                aria-label="Instagram"
                                className="p-2 bg-white/5 hover:bg-[#FFCB05] hover:text-[#070F2B] rounded-lg text-white transition-all shadow-sm"
                            >
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a 
                                target="_blank" 
                                href="https://wa.me/917420930845" 
                                rel="noopener noreferrer" 
                                aria-label="WhatsApp"
                                className="p-2 bg-white/5 hover:bg-[#FFCB05] hover:text-[#070F2B] rounded-lg text-white transition-all shadow-sm"
                            >
                                <MessageSquare className="w-4 h-4" />
                            </a>
                            <a 
                                href="mailto:zeynix.co@gmail.com" 
                                aria-label="Email"
                                className="p-2 bg-white/5 hover:bg-[#FFCB05] hover:text-[#070F2B] rounded-lg text-white transition-all shadow-sm"
                            >
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Column 1: Shop (Atelier Fits) */}
                    <div className="sm:col-span-1 lg:col-span-2">
                        <h4 className="font-extrabold tracking-widest text-xs text-[#FFCB05] uppercase mb-4">
                            Shop Fits
                        </h4>
                        <ul className="space-y-2.5 text-white/70 text-xs font-semibold">
                            <li><Link href="/products/casual" className="hover:text-[#FFCB05] transition-colors">Streetwear Drops</Link></li>
                            <li><Link href="/products/casual" className="hover:text-[#FFCB05] transition-colors">Oversized T-Shirts</Link></li>
                            <li><Link href="/products/casual" className="hover:text-[#FFCB05] transition-colors">Hoodies & Sweaters</Link></li>
                            <li><Link href="/products/casual" className="hover:text-[#FFCB05] transition-colors">Signature Graphics</Link></li>
                            <li><Link href="/print-studio" className="hover:text-[#FFCB05] transition-colors">Print Studio</Link></li>
                        </ul>
                    </div>

                    {/* Column 2: Customer Care */}
                    <div className="sm:col-span-1 lg:col-span-2">
                        <h4 className="font-extrabold tracking-widest text-xs text-[#FFCB05] uppercase mb-4">
                            Customer Care
                        </h4>
                        <ul className="space-y-2.5 text-white/70 text-xs font-semibold">
                            <li><Link href="/contact" className="hover:text-[#FFCB05] transition-colors">Contact Atelier</Link></li>
                            <li><Link href="/contact" className="hover:text-[#FFCB05] transition-colors">3-Day Flash Delivery</Link></li>
                            <li><Link href="/about" className="hover:text-[#FFCB05] transition-colors">Size Guide & Styling</Link></li>
                            <li><Link href="/about" className="hover:text-[#FFCB05] transition-colors">Our Story</Link></li>
                            <li><Link href="/orders" className="hover:text-[#FFCB05] transition-colors">Track Order</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Store & Studio (Genuine Store Details) */}
                    <div className="sm:col-span-1 lg:col-span-3 space-y-3">
                        <h4 className="font-extrabold tracking-widest text-xs text-[#FFCB05] uppercase mb-4">
                            Store & Studio
                        </h4>
                        <div className="space-y-3 text-xs">
                            <div className="flex items-start gap-2.5 text-white/70">
                                <MapPin className="w-4 h-4 text-[#FFCB05] shrink-0 mt-0.5" />
                                <span className="leading-relaxed font-semibold text-[11px]">
                                    1st Floor, M Dange Caters, in front of Neelam Mess, LIT Road, Ram Nagar, Nagpur, Maharashtra - 440010
                                </span>
                            </div>
                            <div className="flex items-center gap-2.5 text-white/70">
                                <Mail className="w-4 h-4 text-[#FFCB05] shrink-0" />
                                <a href="mailto:zeynix.co@gmail.com" className="hover:text-[#FFCB05] transition-colors font-semibold text-[11px]">
                                    zeynix.co@gmail.com
                                </a>
                            </div>
                            <div className="flex items-center gap-2.5 text-white/70">
                                <Phone className="w-4 h-4 text-[#FFCB05] shrink-0" />
                                <a href="https://wa.me/917420930845" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFCB05] transition-colors font-semibold text-[11px]">
                                    +91 7420930845
                                </a>
                            </div>
                            <div className="flex items-center gap-2.5 text-white/70">
                                <Clock className="w-4 h-4 text-[#FFCB05] shrink-0" />
                                <span className="font-semibold text-[11px]">
                                    Mon – Sat: 10:00 AM – 6:30 PM IST
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Zeynix Logo (Right) */}
                    <div className="sm:col-span-1 lg:col-span-2 flex flex-col items-center justify-center space-y-2 text-center">
                        <Link href="/" className="inline-block group">
                            <Image 
                                src="/images/logos/zeynix-logo-rbg.png" 
                                alt="Zeynix Logo" 
                                width={180} 
                                height={180} 
                                className="w-24 sm:w-28 md:w-32 h-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_4px_16px_rgba(255,203,5,0.15)]"
                            />
                        </Link>
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#B5945B]">
                            Wear The Luxury
                        </span>
                    </div>

                </div>

                {/* Footer Bottom copyright */}
                <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40 font-bold uppercase tracking-wider">
                    <p>© {currentYear} Zeynix.in. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/about" className="hover:text-white transition-colors">Our Story</Link>
                        <Link href="/print-studio" className="hover:text-white transition-colors">Print Studio</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Contact Atelier</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

