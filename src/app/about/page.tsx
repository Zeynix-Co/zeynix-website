'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Award, Sparkles, Shield, Compass, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-[#070F2B] text-white py-14 sm:py-20 px-4 md:px-8 border-b border-white/10 relative overflow-hidden">
                    <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#FFCB05] block">
                            Our Heritage & Vision
                        </span>
                        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#FAF6F0]">
                            Wear The Luxury. <br className="hidden sm:block" />Feel The Craft.
                        </h1>
                        <p className="text-xs sm:text-sm text-white/70 max-w-xl mx-auto font-medium leading-relaxed">
                            Born out of passion for bespoke silhouettes, premium organic cotton, and contemporary streetwear aesthetics, Zeynix redefines everyday casuals with intentional tailoring.
                        </p>
                    </div>
                </section>

                {/* Values & Pillars */}
                <section className="py-12 sm:py-16 px-4 md:px-8 max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-[#070F2B]/5 text-[#B5945B] flex items-center justify-center">
                                <Award className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-extrabold uppercase tracking-wide text-[#070F2B]">
                                240+ GSM Organic Cotton
                            </h3>
                            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                                We source heavy-density organic combed cotton that delivers maximum comfort, breathability, and structural drape wash after wash.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-[#070F2B]/5 text-[#B5945B] flex items-center justify-center">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-extrabold uppercase tracking-wide text-[#070F2B]">
                                Bespoke Screen Printing
                            </h3>
                            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                                Our in-house atelier combines state-of-the-art screen printing, puff embroidery, and high-density inks for long-lasting vibrant graphics.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-3 sm:col-span-2 lg:col-span-1">
                            <div className="w-12 h-12 rounded-xl bg-[#070F2B]/5 text-[#B5945B] flex items-center justify-center">
                                <Compass className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-extrabold uppercase tracking-wide text-[#070F2B]">
                                30-Minute Hyperlocal Drop
                            </h3>
                            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                                Experience instant streetwear gratification with express door-to-door fulfillment in active metropolitan hubs.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2.5 bg-[#070F2B] text-white py-3.5 px-8 font-bold uppercase tracking-wider text-xs shadow-[3px_3px_0px_#B5945B] hover:bg-[#B5945B] hover:text-[#070F2B] transition-all cursor-pointer border border-[#070F2B]"
                        >
                            Explore Our Atelier Fits
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}