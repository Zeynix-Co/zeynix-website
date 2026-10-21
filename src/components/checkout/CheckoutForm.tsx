'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { useCartStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colorClasses } from '@/lib/constants';
import { MapPin, User, Phone, Mail, Home, Building, Navigation, CreditCard, MessageCircle, Loader2, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import RazorpayPayment from '@/components/payment/RazorpayPayment';

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
    onOrderCreated: (orderId: string, orderTotal?: number) => void;
}

export default function CheckoutForm({ onOrderCreated }: CheckoutFormProps) {
    const router = useRouter();
    const { user } = useAuthStore();
    const { items, appliedCoupon, removeSelectedItemsFromCart } = useCartStore();

    const selectedItems = items.filter((item) => item.selected !== false);
    const rawSelectedTotal = selectedItems.reduce((total, item) => {
        const price = item.customization
            ? (item.customization.basePrice + item.customization.customizationPrice)
            : ((item.product.discountPrice && item.product.discountPrice < item.product.price)
                ? item.product.discountPrice
                : item.product.price);
        return total + (price * item.quantity);
    }, 0);

    const couponDiscount = appliedCoupon
        ? Math.round((rawSelectedTotal * appliedCoupon.discountPercent) / 100)
        : 0;
    const selectedTotalAmount = Math.max(0, rawSelectedTotal - couponDiscount);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'razorpay'>('razorpay');
    const [orderCreated, setOrderCreated] = useState(false);
    const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
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
    const [isPincodeLoading, setIsPincodeLoading] = useState(false);
    const [pincodeSuccess, setPincodeSuccess] = useState<string | null>(null);
    const [serviceability, setServiceability] = useState<{
        checked: boolean;
        serviceable: boolean;
        configured?: boolean;
        city?: string;
        state?: string;
        courierName?: string;
        estimatedDeliveryDays?: string;
        message?: string;
    } | null>(null);

    const lookupPincode = async (code: string) => {
        if (!/^\d{6}$/.test(code)) return;
        setIsPincodeLoading(true);
        setPincodeSuccess(null);
        setServiceability(null);
        try {
            const res = await fetch(`/api/pincode/${code}`);
            const result = await res.json();

            // Check if explicitly unserviceable
            if (res.status === 422 || result.serviceable === false || (result.data && result.data.serviceable === false)) {
                setServiceability({
                    checked: true,
                    serviceable: false,
                    configured: true,
                    message: result.message || `Delivery is not available to pincode ${code}.`,
                });
                setErrors(prev => ({
                    ...prev,
                    pincode: result.message || 'Delivery is not available to this pincode via courier',
                }));
                setPincodeSuccess(null);
                return;
            }

            if (result.success && result.data) {
                const { city, state, courierName, estimatedDeliveryDays } = result.data;
                if (city) {
                    setFormData(prev => ({
                        ...prev,
                        city: city || prev.city,
                        state: state || prev.state,
                    }));
                }
                setErrors(prev => ({
                    ...prev,
                    city: undefined,
                    state: undefined,
                    pincode: undefined,
                }));
                const locText = [city, state].filter(Boolean).join(', ');
                setPincodeSuccess(locText || 'Verified');
                setServiceability({
                    checked: true,
                    serviceable: true,
                    configured: result.data.configured,
                    city,
                    state,
                    courierName,
                    estimatedDeliveryDays,
                });
            } else {
                setPincodeSuccess(null);
            }
        } catch (err) {
            console.warn('Pincode lookup error:', err);
            setPincodeSuccess(null);
        } finally {
            setIsPincodeLoading(false);
        }
    };

    // Refresh auth state when component mounts
    useEffect(() => {
        useAuthStore.getState().checkAuth();
    }, []);

    const validateForm = (): boolean => {
        const newErrors: Partial<AddressForm> = {};
        const requiredFields: (keyof AddressForm)[] = ['firstName', 'lastName', 'phone', 'email', 'addressLine1', 'city', 'state', 'pincode'];

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
        } else if (serviceability && !serviceability.serviceable) {
            newErrors.pincode = 'This pincode is not serviceable by our courier partners';
        }

        setErrors(newErrors);

        // Auto-scroll to first error field
        if (Object.keys(newErrors).length > 0) {
            // Find the first field with an error in the required order
            const firstErrorField = requiredFields.find(field => newErrors[field]);
            if (firstErrorField) {
                // Scroll to the first error field
                setTimeout(() => {
                    const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
                    if (element) {
                        element.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                        element.focus();
                    }
                }, 100);
            }
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof AddressForm, value: string) => {
        if (field === 'pincode') {
            const digitsOnly = value.replace(/\D/g, '').slice(0, 6);
            setFormData(prev => ({ ...prev, pincode: digitsOnly }));
            if (errors.pincode) {
                setErrors(prev => ({ ...prev, pincode: undefined }));
            }
            if (digitsOnly.length === 6) {
                lookupPincode(digitsOnly);
            } else {
                setPincodeSuccess(null);
            }
            return;
        }

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

        // Check if user is properly authenticated
        if (!user || !useAuthStore.getState().isAuthenticated) {
            alert('Please log in to create an order. You will be redirected to the login page.');
            router.push('/login');
            return;
        }

        if (selectedItems.length === 0) {
            alert('Please select at least one item from the Order Summary to place your order.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Create order data using only selected items
            const orderData = {
                items: selectedItems.map(item => ({
                    productId: item.product.id,
                    size: item.size,
                    quantity: item.quantity,
                    price: item.customization
                        ? (item.customization.basePrice + item.customization.customizationPrice)
                        : ((item.product.discountPrice && item.product.discountPrice < item.product.price) ? item.product.discountPrice : item.product.price),
                    customization: item.customization || undefined
                })),
                totalAmount: selectedTotalAmount,
                couponCode: appliedCoupon?.code || undefined,
                couponDiscount: couponDiscount > 0 ? couponDiscount : undefined,
                paymentMethod: paymentMethod,
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
                setCreatedOrderId(result.data.id);
                setOrderCreated(true);

                if (paymentMethod === 'whatsapp') {
                    // Remove only ordered (selected) items from cart
                    removeSelectedItemsFromCart();

                    // Create enhanced WhatsApp message with order details
                    const order = result.data;
                    const address = `${formData.addressLine1}, ${formData.city}, ${formData.state} - ${formData.pincode}`;

                    // Create detailed product information for selected items
                    const productDetails = selectedItems.map((item, index) => {
                        // Generate product URL - try to get category from product or default to 'casual'
                        const category = 'casual'; // Default category since cart items don't store category
                        const productUrl = `${window.location.origin}/products/${category}/${item.product.id}`;

                        // Get product image with fallback
                        const productImage = item.product.images && item.product.images.length > 0
                            ? item.product.images[0]
                            : `${window.location.origin}/images/placeholder.jpg`;

                        const itemUnitPrice = item.customization
                            ? (item.customization.basePrice + item.customization.customizationPrice)
                            : ((item.product.discountPrice && item.product.discountPrice < item.product.price) ? item.product.discountPrice : item.product.price);

                        // Calculate item total
                        const itemTotal = itemUnitPrice * item.quantity;

                        return `${index + 1}. *${item.product.title}*
   Size: ${item.size}
   Quantity: ${item.quantity}
   Price: ₹${itemUnitPrice} each
   Total: ₹${itemTotal}
   Image: ${productImage}
   Link: ${productUrl}`;
                    }).join('\n\n');

                    const couponLine = appliedCoupon && couponDiscount > 0
                        ? `\n*Coupon Applied:* ${appliedCoupon.code} (${appliedCoupon.discountPercent}% OFF: -₹${couponDiscount})\n`
                        : '';

                    const whatsappMessage = `*New Order Request*

Hello Zeynix Team,

I would like to place an order with the following details:

*Order Items:*
${productDetails}
${couponLine}
*Order Total:* ₹${selectedTotalAmount}

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
                    const whatsappUrl = `https://wa.me/917420004429?text=${encodedMessage}`;

                    // Redirect to WhatsApp
                    window.open(whatsappUrl, '_blank');

                    // Also call the original callback for any additional handling
                    onOrderCreated(result.data.id, selectedTotalAmount);
                }
                // For Paytm payment, we'll show the payment component
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
                            name="firstName"
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
                            name="lastName"
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
                            name="phone"
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
                            name="email"
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
                        name="addressLine1"
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
                    {/* Pincode with Auto-detection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="w-4 h-4 inline mr-2 text-[#B5945B]" />
                            Pincode *
                        </label>
                        <div className="relative">
                            <Input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={(e) => handleInputChange('pincode', e.target.value)}
                                className={errors.pincode ? 'border-red-500 pr-10' : 'pr-10'}
                                placeholder="Enter 6-digit pincode"
                                maxLength={6}
                            />
                            {isPincodeLoading && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-blue-600">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                </div>
                            )}
                        </div>
                        {errors.pincode && (
                            <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                        )}
                        {isPincodeLoading && (
                            <p className="text-xs text-blue-600 mt-1 flex items-center gap-1 font-medium">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking courier serviceability with Shiprocket...
                            </p>
                        )}
                        {!isPincodeLoading && serviceability && !serviceability.serviceable && (
                            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-red-900">Delivery Not Available</p>
                                    <p className="mt-0.5 text-red-700">
                                        {serviceability.message || `Sorry, our courier partners currently cannot deliver to pincode ${formData.pincode}.`}
                                    </p>
                                </div>
                            </div>
                        )}
                        {!isPincodeLoading && serviceability && serviceability.serviceable && (
                            <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                    <div>
                                        <span className="font-bold">Delivery Available</span>
                                        {serviceability.city && <span> to {serviceability.city}</span>}
                                        {serviceability.courierName && (
                                            <span className="text-emerald-700 font-medium"> • via {serviceability.courierName}</span>
                                        )}
                                    </div>
                                </div>
                                {serviceability.estimatedDeliveryDays && (
                                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                                        Est. {serviceability.estimatedDeliveryDays}
                                    </span>
                                )}
                            </div>
                        )}
                        {!isPincodeLoading && !serviceability && pincodeSuccess && (
                            <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-green-600" /> Auto-filled: {pincodeSuccess}
                            </p>
                        )}
                    </div>

                    {/* City (Auto-filled) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Navigation className="w-4 h-4 inline mr-2" />
                            City *
                        </label>
                        <Input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className={errors.city ? 'border-red-500' : ''}
                            placeholder="Enter city"
                        />
                        {errors.city && (
                            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                        )}
                    </div>

                    {/* State (Auto-filled) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Navigation className="w-4 h-4 inline mr-2" />
                            State *
                        </label>
                        <Input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                            className={errors.state ? 'border-red-500' : ''}
                            placeholder="Enter state"
                        />
                        {errors.state && (
                            <p className="text-red-500 text-sm mt-1">{errors.state}</p>
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
                            <span className="text-gray-600">Selected Items ({selectedItems.length})</span>
                            <span className="font-medium text-gray-600">{formatPrice(selectedTotalAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium text-green-600">Free</span>
                        </div>
                        <div className="border-t pt-2">
                            <div className={`flex justify-between text-lg font-bold ${colorClasses.primary.text}`}>
                                <span>Total</span>
                                <span className={colorClasses.primary.text}>
                                    {formatPrice(selectedTotalAmount)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Method Selection */}
                {!orderCreated && (
                    <div className="pt-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'razorpay'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="razorpay"
                                    checked={paymentMethod === 'razorpay'}
                                    onChange={(e) => setPaymentMethod(e.target.value as 'razorpay')}
                                    className="sr-only"
                                />
                                <div className="flex items-center flex-1">
                                    <div className={`mr-4 ${paymentMethod === 'razorpay' ? 'text-blue-600' : 'text-gray-400'}`}>
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">Online Payment</div>
                                        <div className="text-sm text-gray-500">Pay using UPI, Cards, Net Banking</div>
                                    </div>
                                </div>
                                {paymentMethod === 'razorpay' && (
                                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                )}
                            </label>

                            <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'whatsapp'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="whatsapp"
                                    checked={paymentMethod === 'whatsapp'}
                                    onChange={(e) => setPaymentMethod(e.target.value as 'whatsapp')}
                                    className="sr-only"
                                />
                                <div className="flex items-center flex-1">
                                    <div className={`mr-4 ${paymentMethod === 'whatsapp' ? 'text-blue-600' : 'text-gray-400'}`}>
                                        <MessageCircle className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">WhatsApp Order</div>
                                        <div className="text-sm text-gray-500">Confirm via WhatsApp</div>
                                    </div>
                                </div>
                                {paymentMethod === 'whatsapp' && (
                                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                {!orderCreated && (
                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting || selectedItems.length === 0 || Boolean(serviceability && !serviceability.serviceable)}
                            className="w-full py-3 text-lg"
                        >
                            {isSubmitting
                                ? 'Creating Order...'
                                : selectedItems.length === 0
                                    ? 'Select Items in Order Summary'
                                    : (serviceability && !serviceability.serviceable)
                                        ? 'Pincode Not Deliverable'
                                        : `Create Order (${formatPrice(selectedTotalAmount)})`}
                        </Button>
                        {serviceability && !serviceability.serviceable && (
                            <p className="text-xs text-red-600 text-center mt-2 font-semibold">
                                ⚠️ Please enter a serviceable delivery pincode above to proceed with your order.
                            </p>
                        )}
                        {selectedItems.length === 0 && (
                            <p className="text-xs text-amber-600 text-center mt-2 font-medium">
                                Please select at least 1 product from the Order Summary to place your order.
                            </p>
                        )}
                    </div>
                )}

                {/* Razorpay Payment Component */}
                {orderCreated && paymentMethod === 'razorpay' && createdOrderId && (
                    <div className="pt-6">
                        <RazorpayPayment
                            orderId={createdOrderId}
                            amount={selectedTotalAmount}
                            onPaymentSuccess={(razorpayOrderId, razorpayPaymentId) => {
                                console.log('Payment successful:', { razorpayOrderId, razorpayPaymentId });
                                removeSelectedItemsFromCart();
                                onOrderCreated(createdOrderId, selectedTotalAmount);
                            }}
                            onPaymentFailure={(error) => {
                                console.error('Payment failed:', error);
                                alert('Payment failed. Please try again.');
                            }}
                        />
                    </div>
                )}

                {/* Payment Notice */}
                {!orderCreated && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 text-sm font-medium">💳</span>
                                </div>
                            </div>
                            <div className="ml-3">
                                <h4 className="text-sm font-medium text-blue-800">
                                    {paymentMethod === 'razorpay' ? 'Secure Online Payment' : 'WhatsApp Order Confirmation'}
                                </h4>
                                <p className="text-sm text-blue-700 mt-1">
                                    {paymentMethod === 'razorpay'
                                        ? 'Pay securely using UPI, Cards, Net Banking, or Wallets. Your payment is protected by Razorpay\'s 256-bit SSL encryption.'
                                        : 'After creating your order, you\'ll be redirected to WhatsApp with complete order details including product images, links, and your delivery address.'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
