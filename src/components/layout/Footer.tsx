'use client';

import { Facebook, Instagram, Twitter, Mail, Truck, CreditCard, MapPin } from 'lucide-react';
import Link from 'next/link';
import { colors, colorClasses, brand } from '@/lib/constants';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`${colorClasses.primary.bg} ${colorClasses.light.text}`}>
            <div className="container mx-auto px-4 py-8">
                {/* Logo Section */}
                <div className="mx-auto flex flex-col items-center justify-center space-x-2">
                    <div className={`${colorClasses.secondary.text} font-bold  flex flex-col items-center justify-center`}>
                        <img className='rounded-xl' src={brand.logo} alt={brand.name} width={100} height={100} />
                    </div>
                    <p className="text-xl mb-4 text-center">
                        {brand.description}
                    </p>
                </div>


                <div className="md:flex md:flex-row flex-col items-start justify-center space-y-6 md:space-x-48">


                    {/* Customer Service */}
                    <div>
                        <h3 className={`${colorClasses.secondary.text} font-bold text-lg mb-2`}>CUSTOMER SERVICE</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/contact" className={`hover:${colorClasses.secondary.text} transition-colors`}>Contact Us</Link></li>
                            <li><Link href="/track-order" className={`hover:${colorClasses.secondary.text} transition-colors`}>Track Order</Link></li>
                            <li><Link href="/return" className={`hover:${colorClasses.secondary.text} transition-colors`}>Return Order</Link></li>
                            <li><Link href="/cancel" className={`hover:${colorClasses.secondary.text} transition-colors`}>Cancel Order</Link></li>
                        </ul>
                        <div className="mt-1 space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                                <Truck className={`w-4 h-4 ${colorClasses.secondary.text}`} />
                                <span>7 Days Return Policy*</span>
                            </div>
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className={`${colorClasses.secondary.text} font-bold text-lg mb-2`}>COMPANY</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className={`hover:${colorClasses.secondary.text} transition-colors`}>About Us</Link></li>
                            <li><Link href="/privacy" className={`hover:${colorClasses.secondary.text} transition-colors`}>Privacy Policy</Link></li>
                            <li><Link href="/terms" className={`hover:${colorClasses.secondary.text} transition-colors`}>Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    {/* Connect & Download */}
                    <div>
                        <h3 className={`${colorClasses.secondary.text} font-bold text-lg mb-2`}>CONNECT WITH US</h3>
                        <div className="space-y-4">
                            {/* Social Media */}
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center space-x-2">
                                    <MapPin className={`w-4 h-4 ${colorClasses.secondary.text}`} />
                                    <a target='_blank' href='https://www.instagram.com/_zeynix._/'>
                                        <span>Visit us</span></a>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Instagram className={`w-4 h-4 ${colorClasses.secondary.text}`} />
                                    <a target='_blank' href='https://www.instagram.com/_zeynix._/'>
                                        <span>Follow us</span></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-4 border-t border-gray-700 text-center text-sm text-gray-400">
                    © {currentYear} Zeynix.in | All Rights Reserved
                </div>
            </div>
        </footer>
    );
}

