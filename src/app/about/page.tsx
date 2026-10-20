'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
    Sparkles, 
    Shield, 
    ArrowRight, 
    Play, 
    Pause, 
    Volume2, 
    VolumeX, 
    Maximize2,
    Layers,
    Cpu,
    CheckCircle2,
    Palette,
    Scissors,
    Sparkle,
    Quote,
    Scan
} from 'lucide-react';

export default function AboutPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleFullscreen = () => {
        if (!videoRef.current) return;
        if (videoRef.current.requestFullscreen) {
            videoRef.current.requestFullscreen();
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#070F2B] flex flex-col font-sans selection:bg-[#FFCB05] selection:text-[#070F2B] overflow-x-hidden">
            <Header />

            <main className="flex-1">
                {/* 1. HERO SECTION */}
                <section className="bg-[#070F2B] text-white py-12 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 border-b border-white/10 relative overflow-hidden">
                    {/* Background ambient lighting */}
                    <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-[#FFCB05]/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-64 sm:w-80 h-64 sm:h-80 bg-[#B5945B]/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-5xl mx-auto text-center space-y-4 sm:space-y-6 relative z-10">
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/15 text-[#FFCB05] text-[10px] sm:text-[11px] font-black uppercase tracking-widest">
                            <Sparkle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFCB05] shrink-0" />
                            <span>The Zeynix Atelier Story & Philosophy</span>
                        </div>

                        <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#FAF6F0] leading-[1.15]">
                            Engineered In Our Atelier. <br className="hidden sm:block" />
                            <span className="text-[#FFCB05]">Defined By Precision Craft.</span>
                        </h1>

                        <p className="text-xs sm:text-sm md:text-base text-white/75 max-w-2xl mx-auto font-medium leading-relaxed px-2">
                            Born out of a genuine rebellion against flimsy fast fashion, Zeynix represents the intersection of heavy organic textiles, in-house print mastery, and bold architectural streetwear.
                        </p>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-4 sm:pt-6 max-w-3xl mx-auto">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 sm:p-4 text-center backdrop-blur-sm">
                                <span className="block text-xl sm:text-3xl font-black text-[#FFCB05]">240+</span>
                                <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-white/70 block mt-0.5">GSM Combed Cotton</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 sm:p-4 text-center backdrop-blur-sm">
                                <span className="block text-xl sm:text-3xl font-black text-[#FFCB05]">100%</span>
                                <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-white/70 block mt-0.5">In-House Manufacturing</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 sm:p-4 text-center backdrop-blur-sm">
                                <span className="block text-xl sm:text-3xl font-black text-[#FFCB05]">3-Day</span>
                                <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-white/70 block mt-0.5">Flash Delivery</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 sm:p-4 text-center backdrop-blur-sm">
                                <span className="block text-xl sm:text-3xl font-black text-[#FFCB05]">0%</span>
                                <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-white/70 block mt-0.5">Graphic Peel or Fade</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. THE 15-SECOND MANUFACTURING VIDEO SHOWCASE */}
                <section className="py-10 sm:py-16 md:py-20 px-3.5 sm:px-6 md:px-8 max-w-6xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 space-y-1.5 sm:space-y-2">
                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#B5945B] block">
                            Behind The Seams
                        </span>
                        <h2 className="text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-[#070F2B]">
                            Watch How We Manufacture & Develop
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed px-2">
                            Every single Zeynix silhouette starts from raw organic yarns and passes through our proprietary ink compounding and precision tailoring machines.
                        </p>
                    </div>

                    <div className="-mx-2 sm:mx-0 bg-[#070F2B] rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-2xl border border-[#070F2B]/10 overflow-hidden relative">
                        {/* Header bar above video */}
                        <div className="flex items-center justify-between pb-2.5 px-1 text-white">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#FFCB05] animate-pulse" />
                                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#FFCB05]">
                                    15s Atelier Reel • Cinema View
                                </span>
                            </div>
                            <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest hidden sm:inline-block">
                                Zeynix Workshop
                            </span>
                        </div>

                        {/* Large Cinema Video Frame with Ambient Lighting */}
                        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-black w-full border border-white/10 shadow-2xl h-[280px] xs:h-[320px] sm:h-[420px] md:h-[480px] flex items-center justify-center group">
                            {/* Ambient glowing video backdrop */}
                            <video
                                src="/videos/our-story.mp4"
                                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125 pointer-events-none"
                                autoPlay
                                loop
                                muted
                                playsInline
                            />

                            {/* Main Active Video */}
                            <video
                                ref={videoRef}
                                src="/videos/our-story.mp4"
                                className={`relative z-10 w-full h-full ${fitMode === 'cover' ? 'object-cover' : 'object-contain'} transition-all duration-300 drop-shadow-2xl`}
                                autoPlay
                                loop
                                muted={isMuted}
                                playsInline
                            />
                        </div>

                        {/* Sleek Controls Bar */}
                        <div className="mt-3 flex items-center justify-between bg-white/5 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-white/10 text-white">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <button
                                    onClick={togglePlay}
                                    className="p-1.5 sm:p-2 rounded-lg bg-[#FFCB05] text-[#070F2B] hover:bg-white transition-all cursor-pointer font-bold shadow-md"
                                    title={isPlaying ? 'Pause' : 'Play'}
                                    aria-label={isPlaying ? 'Pause' : 'Play'}
                                >
                                    {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />}
                                </button>

                                <button
                                    onClick={toggleMute}
                                    className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all cursor-pointer text-white"
                                    title={isMuted ? 'Unmute' : 'Mute'}
                                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                                >
                                    {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                </button>

                                <span className="text-[11px] sm:text-xs font-semibold text-white/80">
                                    {isPlaying ? 'Playing' : 'Paused'}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setFitMode(fitMode === 'contain' ? 'cover' : 'contain')}
                                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#FFCB05]/15 hover:bg-[#FFCB05]/25 border border-[#FFCB05]/40 text-[#FFCB05] transition-all cursor-pointer text-[10px] sm:text-xs font-bold shadow-sm"
                                    title={fitMode === 'contain' ? 'Enlarge Video to Fill Card' : 'Fit Entire Panoramic Frame'}
                                >
                                    <Scan className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    <span>{fitMode === 'contain' ? 'Enlarge Video' : 'Fit Full Frame'}</span>
                                </button>

                                <button
                                    onClick={handleFullscreen}
                                    className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all cursor-pointer text-white"
                                    title="Fullscreen"
                                    aria-label="Fullscreen"
                                >
                                    <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Video highlights footer */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-5 pt-3 sm:pt-4 border-t border-white/10 text-white">
                            <div className="flex items-start gap-2.5 sm:gap-3">
                                <div className="p-1.5 sm:p-2 rounded-lg bg-[#FFCB05]/10 text-[#FFCB05] shrink-0 mt-0.5">
                                    <Scissors className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <div>
                                    <h4 className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wide text-white">Precision Cut & Stitch</h4>
                                    <p className="text-[10px] sm:text-[11px] text-white/60 leading-relaxed mt-0.5">Dual-needle lock-stitched seams designed to retain silhouette integrity forever.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 sm:gap-3">
                                <div className="p-1.5 sm:p-2 rounded-lg bg-[#FFCB05]/10 text-[#FFCB05] shrink-0 mt-0.5">
                                    <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <div>
                                    <h4 className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wide text-white">Multi-Layer Inks</h4>
                                    <p className="text-[10px] sm:text-[11px] text-white/60 leading-relaxed mt-0.5">High-viscosity pigment formulas crafted to survive hundreds of cycles.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 sm:gap-3">
                                <div className="p-1.5 sm:p-2 rounded-lg bg-[#FFCB05]/10 text-[#FFCB05] shrink-0 mt-0.5">
                                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <div>
                                    <h4 className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wide text-white">5-Point Quality Gate</h4>
                                    <p className="text-[10px] sm:text-[11px] text-white/60 leading-relaxed mt-0.5">Every piece individually inspected before receiving its authentic Zeynix tag.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. DUAL MANUFACTURING PHOTO SHOWCASE & CRAFT STORY */}
                <section className="py-12 sm:py-20 bg-white border-y border-gray-200">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 space-y-12 sm:space-y-16">
                        <div className="text-center max-w-2xl mx-auto space-y-1.5 sm:space-y-2">
                            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#B5945B] block">
                                The Dual-Atelier Approach
                            </span>
                            <h2 className="text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-[#070F2B]">
                                How We Develop Our Products
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed px-2">
                                True luxury isn’t outsourced. We merge the timeless tactile heritage of hand-pulled screen printing with industrial-grade digital direct-to-film machinery.
                            </p>
                        </div>

                        {/* Craft Feature 1: Manual Screen Printing Atelier */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
                            <div className="lg:col-span-6 relative">
                                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border-2 sm:border-4 border-white bg-gray-100 group">
                                    <div className="aspect-[16/10] sm:aspect-[4/3] relative">
                                        <Image
                                            src="/images/about/screen-printing-atelier.jpg"
                                            alt="Zeynix Screen Printing Carousel Atelier"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                        />
                                    </div>
                                    <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-[#070F2B] text-[#FFCB05] px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-md">
                                        Craft 01 • The Screen Carousel
                                    </div>
                                </div>
                                <div className="absolute -bottom-3 -right-3 w-full h-full border-2 border-[#B5945B]/30 rounded-2xl -z-10 hidden sm:block" />
                            </div>

                            <div className="lg:col-span-6 space-y-3 sm:space-y-4">
                                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-md bg-[#070F2B]/5 text-[#B5945B] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                                    <Palette className="w-3.5 h-3.5 shrink-0" />
                                    <span>Tactile Screen Printing</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-[#070F2B] leading-snug">
                                    Hand-Pulled Screens & High-Density Puff Formulations
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                                    Our manual multi-arm carousels allow our print artisans to meticulously register each color layer. Using proprietary water-based and high-density plastisol emulsions, we create rich tactile prints that fuse directly into the fibers of our 240+ GSM cotton rather than sitting stiffly on top.
                                </p>

                                <div className="space-y-2 pt-1 sm:pt-2">
                                    <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-gray-700">
                                        <CheckCircle2 className="w-4 h-4 text-[#B5945B] shrink-0" />
                                        <span>Micro-mesh screens exposed with precision ultraviolet cure</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-gray-700">
                                        <CheckCircle2 className="w-4 h-4 text-[#B5945B] shrink-0" />
                                        <span>3D puff ink detailing for textured, elevated typography</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-gray-700">
                                        <CheckCircle2 className="w-4 h-4 text-[#B5945B] shrink-0" />
                                        <span>High-heat tunnel curing ensuring zero graphic cracking</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Craft Feature 2: High-Definition Digital & DTF Machine */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
                            <div className="lg:col-span-6 space-y-3 sm:space-y-4 order-2 lg:order-1">
                                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-md bg-[#070F2B]/5 text-[#B5945B] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                                    <Cpu className="w-3.5 h-3.5 shrink-0" />
                                    <span>Next-Gen Print Tech</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-[#070F2B] leading-snug">
                                    Industrial DTF Direct-To-Film & Micro-Dot Clarity
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                                    For our complex, photorealistic illustrations and gradient-heavy streetwear graphics, we employ industrial wide-format digital DTF technology. This method utilizes micro-piezo print heads that jet high-pigment eco-certified inks onto specialized carrier films before heat-fusing them onto heavyweight garments.
                                </p>

                                <div className="space-y-2 pt-1 sm:pt-2">
                                    <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-gray-700">
                                        <CheckCircle2 className="w-4 h-4 text-[#B5945B] shrink-0" />
                                        <span>Ultra-high DPI color resolution for photorealistic gradients</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-gray-700">
                                        <CheckCircle2 className="w-4 h-4 text-[#B5945B] shrink-0" />
                                        <span>Polymer powder underbase that flexes and breathes with the fabric</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-gray-700">
                                        <CheckCircle2 className="w-4 h-4 text-[#B5945B] shrink-0" />
                                        <span>Wash-tested against fading across 50+ rigorous laundering cycles</span>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-6 relative order-1 lg:order-2">
                                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border-2 sm:border-4 border-white bg-gray-100 group">
                                    <div className="aspect-[16/10] sm:aspect-[4/3] relative">
                                        <Image
                                            src="/images/about/digital-dtf-printing.jpg"
                                            alt="Zeynix Digital DTF Precision Printing Machine"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                        />
                                    </div>
                                    <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-[#070F2B] text-[#FFCB05] px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-md">
                                        Tech 02 • Digital Precision
                                    </div>
                                </div>
                                <div className="absolute -bottom-3 -left-3 w-full h-full border-2 border-[#B5945B]/30 rounded-2xl -z-10 hidden sm:block" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. THE 4-STEP PRODUCT DEVELOPMENT CYCLE */}
                <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-1.5 sm:space-y-2">
                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#B5945B] block">
                            Our Methodology
                        </span>
                        <h2 className="text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-[#070F2B]">
                            The 4 Stages of Every Zeynix Drop
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow relative">
                            <span className="text-2xl sm:text-3xl font-black text-[#070F2B]/10 absolute top-4 right-4">01</span>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#070F2B] text-[#FFCB05] flex items-center justify-center font-black text-sm mb-3 sm:mb-4">
                                <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#070F2B]">Yarn & GSM Sourcing</h3>
                            <p className="text-[11px] sm:text-xs text-gray-500 font-semibold leading-relaxed mt-1.5 sm:mt-2">
                                We select long-staple organic cotton fibers and weave them at a high-density 240+ GSM weight for structured draping.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow relative">
                            <span className="text-2xl sm:text-3xl font-black text-[#070F2B]/10 absolute top-4 right-4">02</span>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#070F2B] text-[#FFCB05] flex items-center justify-center font-black text-sm mb-3 sm:mb-4">
                                <Scissors className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#070F2B]">Pattern Architecture</h3>
                            <p className="text-[11px] sm:text-xs text-gray-500 font-semibold leading-relaxed mt-1.5 sm:mt-2">
                                Drop shoulders, boxy chest cuts, and reinforced rib knits are engineered for modern, relaxed streetwear proportions.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow relative">
                            <span className="text-2xl sm:text-3xl font-black text-[#070F2B]/10 absolute top-4 right-4">03</span>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#070F2B] text-[#FFCB05] flex items-center justify-center font-black text-sm mb-3 sm:mb-4">
                                <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#070F2B]">Dual Print Fusion</h3>
                            <p className="text-[11px] sm:text-xs text-gray-500 font-semibold leading-relaxed mt-1.5 sm:mt-2">
                                Silkscreen inks and DTF digital transfers are combined in-house to achieve depth, vibrancy, and wash durability.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow relative">
                            <span className="text-2xl sm:text-3xl font-black text-[#070F2B]/10 absolute top-4 right-4">04</span>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#070F2B] text-[#FFCB05] flex items-center justify-center font-black text-sm mb-3 sm:mb-4">
                                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#070F2B]">QC & Express Dispatch</h3>
                            <p className="text-[11px] sm:text-xs text-gray-500 font-semibold leading-relaxed mt-1.5 sm:mt-2">
                                Hand-pressed, inspected for stitch tension, packed in protective sleeves, and dispatched within 3 business days.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 5. DIRECTOR SPOTLIGHT SECTION */}
                <section className="py-12 sm:py-20 md:py-24 bg-[#070F2B] text-white relative overflow-hidden border-t border-white/10">
                    {/* Ambient subtle glow */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-[#FFCB05]/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                        <div className="bg-gradient-to-br from-[#0c1844] to-[#070F2B] rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-white/15 shadow-2xl relative">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 md:gap-12 items-center">
                                {/* Director Portrait Card */}
                                <div className="md:col-span-5 flex flex-col items-center text-center">
                                    <div className="relative w-44 sm:w-56 md:w-64 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-[#FFCB05] group">
                                        <Image
                                            src="/images/about/director.jpg"
                                            alt="Tanishq Sandeep Wankhede - Director, Zeynix"
                                            fill
                                            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 200px, 280px"
                                            priority
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#070F2B] via-transparent to-transparent opacity-30" />
                                    </div>

                                    {/* Name & Title Under Photo */}
                                    <div className="mt-3.5 sm:mt-4 space-y-1">
                                        <h3 className="text-base sm:text-xl font-black uppercase tracking-tight text-white">
                                            Tanishq Sandeep Wankhede
                                        </h3>
                                        <p className="text-[11px] sm:text-xs font-bold text-[#FFCB05] uppercase tracking-widest">
                                            Director & Founder
                                        </p>
                                        <span className="text-[10px] sm:text-[11px] text-white/50 block font-mono">
                                            Zeynix Clothing & Print Atelier
                                        </span>
                                    </div>
                                </div>

                                {/* Director's Vision & Quote */}
                                <div className="md:col-span-7 space-y-4 sm:space-y-5">
                                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full bg-[#FFCB05]/10 border border-[#FFCB05]/30 text-[#FFCB05] text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                                        <Quote className="w-3 h-3 shrink-0" />
                                        <span>From The Director&apos;s Desk</span>
                                    </div>

                                    <h2 className="text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-[#FAF6F0] leading-snug">
                                        &ldquo;We don&apos;t just make clothing. We engineer the fit, feel, and confidence of Indian streetwear.&rdquo;
                                    </h2>

                                    <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-white/80 font-medium leading-relaxed border-l-2 border-[#FFCB05] pl-3 sm:pl-4">
                                        <p>
                                            When we founded Zeynix, our goal was clear: bridge the gap between premium global luxury craftsmanship and accessible, high-energy streetwear culture.
                                        </p>
                                        <p>
                                            Instead of relying on third-party manufacturers, we invested heavily into our own in-house development and print atelier. By controlling every single step—from sourcing heavy 240+ GSM combed cotton to hand-pulling screen prints and running high-precision DTF presses—we guarantee that every garment carrying the Zeynix name is crafted without compromise.
                                        </p>
                                        <p>
                                            Thank you for being part of our journey. When you wear Zeynix, you are wearing dedication, resilience, and genuine craft.
                                        </p>
                                    </div>

                                    <div className="pt-1 sm:pt-2 grid grid-cols-2 gap-2 sm:flex sm:gap-4">
                                        <div className="bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2">
                                            <span className="block text-[9px] sm:text-[10px] uppercase font-bold text-white/60">Core Focus</span>
                                            <span className="text-[11px] sm:text-xs font-black text-[#FFCB05]">In-House Craftsmanship</span>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2">
                                            <span className="block text-[9px] sm:text-[10px] uppercase font-bold text-white/60">Commitment</span>
                                            <span className="text-[11px] sm:text-xs font-black text-[#FFCB05]">Zero-Compromise GSM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. CALL TO ACTION */}
                <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-8 pb-24 sm:pb-20 max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#B5945B] block">
                        Experience The Craft
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#070F2B]">
                        Ready To Wear The Luxury?
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 font-semibold max-w-xl mx-auto leading-relaxed px-2">
                        Explore our latest drops crafted in 240+ GSM combed organic cotton, or create your own custom graphic garments in our in-house Print Studio.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                        <Link
                            href="/products/casual"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#070F2B] text-white py-3 sm:py-3.5 px-6 sm:px-8 font-bold uppercase tracking-wider text-xs shadow-[3px_3px_0px_#B5945B] hover:bg-[#B5945B] hover:text-[#070F2B] transition-all cursor-pointer border border-[#070F2B]"
                        >
                            <span>Explore Our Atelier Fits</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                            href="/print-studio"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#070F2B] py-3 sm:py-3.5 px-6 sm:px-8 font-bold uppercase tracking-wider text-xs border-2 border-[#070F2B] shadow-[3px_3px_0px_#070F2B] hover:bg-[#070F2B] hover:text-white transition-all cursor-pointer"
                        >
                            <span>Custom Print Studio</span>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}