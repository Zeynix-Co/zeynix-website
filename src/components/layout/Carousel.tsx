'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { colorClasses } from '@/lib/constants';
import { images } from '@/lib/images';

interface CarouselItem {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    link: string;
    category: string;
}

const carouselItems: CarouselItem[] = [
    {
        id: 1,
        image: images.banners.formalWear,
        title: 'Formal Wear',
        subtitle: 'Elegant fashion for every occasion',
        link: '/products/formal',
        category: 'Formal'
    },
    {
        id: 2,
        image: images.banners.casualWear,
        title: 'Casual Wear',
        subtitle: 'Trendy clothing for the modern man',
        link: '/products/casual',
        category: 'Casual'
    },
    {
        id: 3,
        image: images.banners.ethnicWear,
        title: 'Ethnic Wear',
        subtitle: 'Traditional and modern ethnic wear',
        link: '/products/ethnic',
        category: 'Ethnic'
    },
    {
        id: 4,
        image: images.banners.sportsWear,
        title: 'Sports Wear',
        subtitle: 'Performance wear for active lifestyle',
        link: '/products/sports',
        category: 'Sports Wear'
    }
];

export default function Carousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Auto-advance carousel
    useEffect(() => {
        const timer = setInterval(() => {
            if (!isTransitioning) {
                setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
            }
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer);
    }, [isTransitioning]);

    const nextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const goToSlide = (index: number) => {
        if (isTransitioning || index === currentSlide) return;
        setIsTransitioning(true);
        setCurrentSlide(index);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    return (
        <div className="relative w-full h-96 md:h-[520px] overflow-hidden">
            {/* Carousel Slides - Only render current slide */}
            <div className="relative w-full h-full">
                <div
                    className="relative w-full h-full transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(-${currentSlide * 100}%)`
                    }}
                >
                    {carouselItems.map((item, index) => (
                        <div
                            key={item.id}
                            className="absolute inset-0 w-full h-full"
                            style={{ left: `${index * 100}%` }}
                        >
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                                priority={index === 0}
                                unoptimized
                            />

                            {/* Overlay with text */}
                            <div className="absolute inset-0 bg-gray-500/50 flex items-center justify-center">
                                <div className="text-center text-white px-6">
                                    <h2 className="text-3xl md:text-5xl font-bold mb-4">{item.title}</h2>
                                    <p className="text-lg md:text-xl mb-6">{item.subtitle}</p>
                                    <Link
                                        href={item.link}
                                        className={`${colorClasses.secondary.bg} ${colorClasses.primary.text} px-8 py-3 rounded-lg font-bold text-lg hover:${colorClasses.secondary.hover} transition-colors inline-block`}
                                    >
                                        Shop Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                disabled={isTransitioning}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-80 p-2 rounded-full shadow-lg transition-all duration-200 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className={`w-6 h-6 ${colorClasses.primary.text}`} />
            </button>

            <button
                onClick={nextSlide}
                disabled={isTransitioning}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-80 p-2 rounded-full shadow-lg transition-all duration-200 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRight className={`w-6 h-6 ${colorClasses.primary.text}`} />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {carouselItems.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        disabled={isTransitioning}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentSlide
                            ? `${colorClasses.secondary.bg} scale-125`
                            : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                ))}
            </div>
        </div>
    );
}

