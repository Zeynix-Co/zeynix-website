'use client';

import Link from 'next/link';
import Image from 'next/image';

const categories = [
    {
        name: 'Formal',
        image: '/images/category-formal.jpg',
        href: '/products/formal'
    },
    {
        name: 'Casual',
        image: '/images/category-casual.jpg',
        href: '/products/casual'
    },
    {
        name: 'Ethnic',
        image: '/images/category-ethnic.jpg',
        href: '/products/ethnic'
    }
];

export default function HeroSection() {
    return (
        <section 
            className="relative w-full h-[320px] xs:h-[380px] sm:h-[480px] md:h-[550px] lg:h-[calc(100vh-80px)] min-h-[300px] max-h-[850px] bg-[#FCF8DD] overflow-hidden"
            aria-label="Hero Section"
        >
            {/* Background Image using Next.js Image for optimal performance and quality */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src="/images/zeynix-hero.png"
                    alt="Zeynix Hero Background"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center select-none"
                    quality={100}
                />
                {/* Subtle overlay to enhance contrast if needed */}
                <div className="absolute inset-0 bg-white/[0.02]" />
            </div>

            {/* Central Categories Container */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-full max-w-[340px] xs:max-w-[420px] sm:max-w-xl md:max-w-3xl lg:max-w-4xl px-4">
                    <div className="grid grid-cols-3 gap-2.5 xs:gap-3 sm:gap-4 md:gap-6 lg:gap-8 justify-center">
                        {categories.map((category) => (
                            <Link
                                key={category.name}
                                href={category.href}
                                className="relative block w-full h-[110px] xs:h-[130px] sm:h-[180px] md:h-[260px] lg:h-[320px] xl:h-[380px] rounded-lg sm:rounded-2xl overflow-hidden border border-white/20 shadow-md hover:border-[#FFCB05]/50 hover:shadow-[0_15px_30px_rgba(255,203,5,0.15)] hover:-translate-y-2 transition-all duration-500 group cursor-pointer"
                            >
                                {/* Diagonal Glimmer / Shine Sweep Effect */}
                                <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-[150%] transition-transform duration-1000 ease-out group-hover:translate-x-[150%] z-20 pointer-events-none" />

                                {/* Card image */}
                                <div className="absolute inset-0 w-full h-full bg-gray-100 overflow-hidden">
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        sizes="(max-width: 640px) 30vw, (max-width: 1024px) 30vw, 300px"
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 brightness-95 group-hover:brightness-105"
                                        priority
                                    />
                                    {/* Vignette effect overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15 transition-opacity duration-300 group-hover:opacity-60" />
                                </div>

                                {/* Premium Category Label Overlay */}
                                <div className="absolute bottom-0 inset-x-0 bg-[#070F2B]/95 backdrop-blur-xs py-1.5 sm:py-3.5 text-center border-t border-white/10 transition-all duration-300 group-hover:bg-[#FFCB05] group-hover:border-[#FFCB05]/20 flex flex-col items-center justify-center overflow-hidden">
                                    <span className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base font-bold uppercase tracking-widest text-[#FCF8DD] transition-all duration-300 group-hover:text-[#070F2B] group-hover:scale-105">
                                        {category.name}
                                    </span>
                                    {/* Dynamic Shop Now reveal on hover */}
                                    <span className="hidden sm:flex items-center gap-1 text-[8px] md:text-[10px] font-bold tracking-widest text-[#070F2B] max-h-0 opacity-0 group-hover:max-h-5 group-hover:opacity-100 group-hover:mt-1 transition-all duration-500 transform translate-y-3 group-hover:translate-y-0">
                                        EXPLORE &rarr;
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
