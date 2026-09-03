'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {/* Page Header */}
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#B5945B] block mb-1">
                        Get In Touch
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black text-[#070F2B] uppercase tracking-tight">
                        Contact Zeynix Atelier
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-2 leading-relaxed">
                        Have a question about our custom printing studio, sizing, or 30-minute delivery? Reach out to our atelier team.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Contact Information Cards */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="bg-[#070F2B] text-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl border border-white/5">
                            <h3 className="text-lg font-extrabold uppercase tracking-wide text-white">
                                Atelier Headquarters
                            </h3>

                            <div className="space-y-4 text-xs">
                                <div className="flex items-start gap-3.5">
                                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#FFCB05] shrink-0">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Location</h4>
                                        <p className="text-white/60 mt-0.5 leading-relaxed">
                                            Zeynix Design Studio, Mumbai / Delhi NCR, India
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#FFCB05] shrink-0">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Email Support</h4>
                                        <p className="text-white/60 mt-0.5">concierge@zeynix.in</p>
                                        <p className="text-[10px] text-white/40">Bespoke: print@zeynix.in</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#FFCB05] shrink-0">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Operating Hours</h4>
                                        <p className="text-white/60 mt-0.5">Mon – Sat: 9:00 AM – 9:00 PM IST</p>
                                        <p className="text-[10px] text-white/40">30-min express delivery active during business hours</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <span className="text-[10px] font-bold text-[#FFCB05] uppercase tracking-wider block">
                                    Average response time: &lt; 2 hours
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                            {submitted ? (
                                <div className="text-center py-10 space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto shadow-sm">
                                        <MessageSquare className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-black text-[#070F2B] uppercase">Message Received</h3>
                                    <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                                        Thank you for contacting Zeynix. Our atelier representative will get back to you shortly.
                                    </p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="bg-[#070F2B] text-white py-2.5 px-6 font-bold uppercase tracking-wider text-xs shadow-xs hover:bg-[#B5945B] hover:text-[#070F2B] transition-colors"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                                Your Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Alex Morgan"
                                                className="w-full text-xs px-3.5 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#070F2B] bg-gray-50 focus:bg-white transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="alex@example.com"
                                                className="w-full text-xs px-3.5 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#070F2B] bg-gray-50 focus:bg-white transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                            Subject / Inquiry Type
                                        </label>
                                        <select className="w-full text-xs px-3.5 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#070F2B] bg-gray-50 focus:bg-white transition-colors cursor-pointer">
                                            <option>Order Status & Tracking</option>
                                            <option>Bespoke Custom Printing (B2B)</option>
                                            <option>30-Min Delivery Query</option>
                                            <option>Returns & Exchanges</option>
                                            <option>Other Question</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                            Message
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            placeholder="Tell us how we can help you..."
                                            className="w-full text-xs px-3.5 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#070F2B] bg-gray-50 focus:bg-white transition-colors"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto bg-[#070F2B] text-white py-3.5 px-8 font-bold uppercase tracking-wider text-xs shadow-[3px_3px_0px_#B5945B] hover:shadow-[0px_0px_0px_#B5945B] hover:bg-[#B5945B] hover:text-[#070F2B] border border-[#070F2B] hover:border-[#B5945B] transition-all duration-300 cursor-pointer inline-flex items-center justify-center gap-2"
                                    >
                                        Send Message
                                        <Send className="w-3.5 h-3.5" />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}