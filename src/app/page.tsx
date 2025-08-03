'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Carousel from '@/components/layout/Carousel';
import Link from 'next/link';
import { colorClasses } from '@/lib/constants';
import ProductCarousel from '@/components/product/ProductCarousel';
import DeliveryCoupon from '@/components/common/DeliveryCoupon';
import FilterProducts from '@/components/layout/FilterProducts';
import { X, AlertTriangle } from 'lucide-react';

export default function HomePage() {
  const [showAlert, setShowAlert] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Production Alert Modal */}
      {showAlert && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowAlert(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Alert Content */}
            <div className="text-center">
              <div className="flex justify-center mb-1">
                <AlertTriangle className="w-12 h-12 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Alert!!!</h3>
              <p className="text-gray-600 text-lg mb-1">
                Website is still under production...
              </p>
              <p className="text-sm text-gray-500">
                <span className='font-bold text-lg'>Note:</span> Some functionality might not work...
              </p>
            </div>

            {/* Action Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAlert(false)}
                className={`px-6 py-2 rounded-md ${colorClasses.primary.bg} text-white hover:opacity-90 transition-opacity`}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className=" mx-auto px-4 py-4">

        {/* Hero Carousel */}
        <section className="container mx-auto mb-4">
          <Carousel />
        </section>

        {/* Delivery Coupon */}
        <section className="mb-8">
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

        <section className='container mx-auto mb-4'>
          <hr className="border border-gray-200" />
        </section>

        <section className='my-8'>
          <FilterProducts />
        </section>


      </main>

      <Footer />
    </div>
  );
}
