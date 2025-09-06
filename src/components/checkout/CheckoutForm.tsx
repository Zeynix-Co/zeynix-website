'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { useCartStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colorClasses } from '@/lib/constants';
import { MapPin, User, Phone, Mail, Home, Building, Navigation } from 'lucide-react';

interface AddressForm {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

interface CheckoutFormProps {
    onOrderCreated: (orderId: string) => void;
}

export default function CheckoutForm({ onOrderCreated }: CheckoutFormProps) {
    const router = useRouter();
    const { user } = useAuthStore();
    const { items, totalAmount, clearCart } = useCartStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<AddressForm>({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
        phone: user?.phone || '',
        email: user?.email || '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
    });

    const [errors, setErrors] = useState<Partial<AddressForm>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<AddressForm> = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';

        // Email validation
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Phone validation (Indian format)
        if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        // Pincode validation
        if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = 'Please enter a valid 6-digit pincode';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof AddressForm, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Debug authentication status
        console.log('🔍 Checkout Debug:');
        console.log('User:', user);
        console.log('Is Authenticated:', useAuthStore.getState().isAuthenticated);
        console.log('Token:', useAuthStore.getState().token);
        console.log('Cookies:', document.cookie);

        setIsSubmitting(true);

        try {
            // Create order data
            const orderData = {
                items: items.map(item => ({
                    productId: item.product.id,
                    size: item.size,
                    quantity: item.quantity,
                    price: item.product.discountPrice || item.product.price
                })),
                totalAmount,
                shippingAddress: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    email: formData.email,
                    addressLine1: formData.addressLine1,
                    addressLine2: formData.addressLine2,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                    country: formData.country
                }
            };

            // Create order via API
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for authentication
                body: JSON.stringify(orderData),
            });

            const result = await response.json();

            if (!response.ok) {
                console.error('Order creation failed:', result);
                if (response.status === 401) {
                    alert('Please log in to create an order. You will be redirected to the login page.');
                    router.push('/login');
                    return;
                }
                throw new Error(result.message || `Order creation failed with status ${response.status}`);
            }

            if (result.success) {
                // Clear cart after successful order
                clearCart();

                // Create enhanced WhatsApp message with order details
                const order = result.data;
                const address = `${formData.addressLine1}, ${formData.city}, ${formData.state} - ${formData.pincode}`;

                // Create detailed product information
                const productDetails = items.map((item, index) => {
                    // Generate product URL - try to get category from product or default to 'casual'
                    const category = 'casual'; // Default category since cart items don't store category
                    const productUrl = `${window.location.origin}/products/${category}/${item.product.id}`;

                    // Get product image with fallback
                    const productImage = item.product.images && item.product.images.length > 0
                        ? item.product.images[0]
                        : `${window.location.origin}/images/placeholder.jpg`;

                    // Calculate item total
                    const itemTotal = (item.product.discountPrice || item.product.price) * item.quantity;

                    return `${index + 1}. *${item.product.title}*
   Size: ${item.size}
   Quantity: ${item.quantity}
   Price: ₹${item.product.discountPrice || item.product.price} each
   Total: ₹${itemTotal}
   Link: ${productUrl}
   Image: ${productImage}`;
                }).join('\n\n');

                const whatsappMessage = `*New Order Request*

Hello Zeynix Team,

I would like to place an order with the following details:

*Order Items:*
${productDetails}

*Order Total:* ₹${totalAmount}

*Customer Details:*
Name: ${formData.firstName} ${formData.lastName}
Phone: ${formData.phone}
Email: ${formData.email}

*Delivery Address:*
${address}

*Order Number:* ${order.orderNumber || order.id}

Please confirm availability and provide delivery timeline.

Thank you!`;

                const encodedMessage = encodeURIComponent(whatsappMessage);
                const whatsappUrl = `https://wa.me/9145402183?text=${encodedMessage}`;


                // Redirect to WhatsApp
                window.open(whatsappUrl, '_blank');

                // Also call the original callback for any additional handling
                onOrderCreated(result.data.id);
            } else {
                throw new Error(result.message || 'Failed to create order');
            }
        } catch (error) {
            console.error('Order creation failed:', error);
            alert('Failed to create order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="mb-6">
                <h2 className={`text-xl font-semibold ${colorClasses.primary.text} mb-2`}>
                    Shipping Information
                </h2>
                <p className="text-gray-600">Please provide your delivery address</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 inline mr-2" />
                            First Name *
                        </label>
                        <Input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className={errors.firstName ? 'border-red-500' : ''}
                            placeholder="Enter first name"
                        />
                        {errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 inline mr-2" />
                            Last Name *
                        </label>
                        <Input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className={errors.lastName ? 'border-red-500' : ''}
                            placeholder="Enter last name"
                        />
                        {errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Phone className="w-4 h-4 inline mr-2" />
                            Phone Number *
                        </label>
                        <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className={errors.phone ? 'border-red-500' : ''}
                            placeholder="Enter 10-digit phone number"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email Address *
                        </label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={errors.email ? 'border-red-500' : ''}
                            placeholder="Enter email address"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>
                </div>

                {/* Address Information */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Home className="w-4 h-4 inline mr-2" />
                        Address Line 1 *
                    </label>
                    <Input
                        type="text"
                        value={formData.addressLine1}
                        onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                        className={errors.addressLine1 ? 'border-red-500' : ''}
                        placeholder="House/Flat number, Street name"
                    />
                    {errors.addressLine1 && (
                        <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Building className="w-4 h-4 inline mr-2" />
                        Address Line 2 (Optional)
                    </label>
                    <Input
                        type="text"
                        value={formData.addressLine2}
                        onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                        placeholder="Apartment, suite, etc. (optional)"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Navigation className="w-4 h-4 inline mr-2" />
                            City *
                        </label>
                        <Input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className={errors.city ? 'border-red-500' : ''}
                            placeholder="Enter city"
                        />
                        {errors.city && (
                            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Navigation className="w-4 h-4 inline mr-2" />
                            State *
                        </label>
                        <Input
                            type="text"
                            value={formData.state}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                            className={errors.state ? 'border-red-500' : ''}
                            placeholder="Enter state"
                        />
                        {errors.state && (
                            <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="w-4 h-4 inline mr-2" />
                            Pincode *
                        </label>
                        <Input
                            type="text"
                            value={formData.pincode}
                            onChange={(e) => handleInputChange('pincode', e.target.value)}
                            className={errors.pincode ? 'border-red-500' : ''}
                            placeholder="Enter 6-digit pincode"
                            maxLength={6}
                        />
                        {errors.pincode && (
                            <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Country
                    </label>
                    <Input
                        type="text"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        placeholder="Country"
                        disabled
                    />
                </div>

                {/* Order Summary */}
                <div className="border-t pt-6">
                    <h3 className={`text-lg font-semibold ${colorClasses.primary.text} mb-4`}>
                        Order Summary
                    </h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Items ({items.length})</span>
                            <span className="font-medium text-gray-600">{formatPrice(totalAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium text-green-600">Free</span>
                        </div>
                        <div className="border-t pt-2">
                            <div className={`flex justify-between text-lg font-bold ${colorClasses.primary.text}`}>
                                <span>Total</span>
                                <span className={colorClasses.primary.text}>
                                    {formatPrice(totalAmount)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 text-lg"
                    >
                        {isSubmitting ? 'Creating Order...' : 'Create Order'}
                    </Button>
                </div>

                {/* Payment Notice */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 text-sm font-medium">💬</span>
                            </div>
                        </div>
                        <div className="ml-3">
                            <h4 className="text-sm font-medium text-green-800">
                                WhatsApp Order Confirmation
                            </h4>
                            <p className="text-sm text-green-700 mt-1">
                                After creating your order, you&apos;ll be redirected to WhatsApp with complete order details including product images, links, and your delivery address.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
