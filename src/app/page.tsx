'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Carousel from '@/components/layout/Carousel';
import Link from 'next/link';
import { colorClasses } from '@/lib/constants';
import ProductCarousel from '@/components/product/ProductCarousel';
import DeliveryCoupon from '@/components/common/DeliveryCoupon';
import FilterProducts from '@/components/layout/FilterProducts';
import AlertBox from '@/components/layout/AlertBox';


export default function HomePage() {


    return (
        <div className="min-h-screen bg-white">
            <Header />
            <div className=" overflow-x-hidden">


                {/* Production Alert Modal */}
                {/* <>
          <AlertBox />
        </> */}

                {/* Main Content */}
                <main className="w-full px-4 py-4">

                    {/* Hero Carousel */}
                    <section className="w-full mb-4">
                        <Carousel />
                    </section>

                    {/* Delivery Coupon */}
                    <section className="w-full mb-8">
                        <DeliveryCoupon />
                    </section>

                    {/* Call to Action Section */}
                    <section className="text-center my-8">
                        <h2 className={`text-3xl font-bold ${colorClasses.primary.text} mb-2`}>Discover Our Collection</h2>

                        <ProductCarousel />

                        <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                            Explore our latest trending products and find your perfect style. From casual wear to formal attire,
                            we have everything you need to express your unique fashion sense.
                        </p>
                        <Link
                            href="/products"
                            className={`inline-block px-8 py-3 rounded-md ${colorClasses.primary.bg} text-white hover:opacity-90 transition-opacity`}
                        >
                            View All Products
                        </Link>
                    </section>

                    <section className='w-full mb-4'>
                        <hr className="border border-gray-200" />
                    </section>

                    <section className='my-8 w-full'>
                        <FilterProducts />
                    </section>


                </main>

                <Footer />
            </div>
        </div>
    );
}
