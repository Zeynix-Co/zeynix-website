// Zeynix Brand Colors
export const colors = {
    primary: '#070F2B',    // Very dark blue - main backgrounds
    secondary: '#FFCB05',  // Golden yellow - accents, buttons, highlights
    light: '#FCF8DD',      // Light cream - backgrounds, text
    dark: '#00274C',       // Dark blue - secondary backgrounds
} as const;

// Linear Gradients
export const gradients = {
    // Golden gradient: top-left to bottom-right
    golden: {
        background: 'linear-gradient(135deg, #FFCB05 0%, #FCF8DD 100%)',
        css: 'bg-gradient-to-br from-[#FFCB05] to-[#FCF8DD]',
        style: {
            background: 'linear-gradient(135deg, #FFCB05 0%, #FCF8DD 100%)',
        },
    },
    // Dark gradient: top-right to bottom-left
    dark: {
        background: 'linear-gradient(315deg, #00274C 0%, #070F2B 100%)',
        css: 'bg-gradient-to-bl from-[#00274C] to-[#070F2B]',
        style: {
            background: 'linear-gradient(315deg, #00274C 0%, #070F2B 100%)',
        },
    },
    // Golden coupon gradient: perfect for delivery coupons
    goldenCoupon: {
        background: 'linear-gradient(to bottom, #FFD700 0%, #FFA500 100%)',
        css: 'bg-gradient-to-b from-yellow-300 to-yellow-500',
        style: {
            background: 'linear-gradient(to bottom, #FFD700 0%, #FFA500 100%)',
        },
    },
} as const;

// Color utility classes for Tailwind
export const colorClasses = {
    primary: {
        bg: 'bg-[#070F2B]',
        text: 'text-[#070F2B]',
        border: 'border-[#070F2B]',
        ring: 'ring-[#070F2B]',
    },
    secondary: {
        bg: 'bg-[#FFCB05]',
        text: 'text-[#FFCB05]',
        border: 'border-[#FFCB05]',
        ring: 'ring-[#FFCB05]',
        hover: 'hover:bg-[#FFCB05]/90',
    },
    light: {
        bg: 'bg-[#FCF8DD]',
        text: 'text-[#FCF8DD]',
        border: 'border-[#FCF8DD]',
    },
    dark: {
        bg: 'bg-[#00274C]',
        text: 'text-[#00274C]',
        border: 'border-[#00274C]',
    },
} as const;

// Font configuration
export const fonts = {
    primary: 'font-afacad',
    sans: 'font-sans',
} as const;

// Brand configuration
export const brand = {
    name: 'ZEYNIX',
    description: 'Your fashion destination for trendy clothing and accessories.',
    tagline: 'Fashion Forward, Always.',
    logo: '/images/logos/logo.jpg',
} as const;

// Navigation items
export const navigation = {
    categories: [
        { name: 'Formal', href: '/products/formal' },
        { name: 'Casual', href: '/products/casual' },
        { name: 'Ethnic', href: '/products/ethnic' },
        { name: 'Sports', href: '/products/sports' },
    ],
    userMenu: [
        { name: 'Login', href: '/login', icon: 'User' },
        { name: 'Orders', href: '/account/orders', icon: 'Package' },
        { name: 'Cart', href: '/cart', icon: 'ShoppingCart' },
    ],
} as const;

// App configuration constants
export const APP_CONFIG = {
    name: 'Zeynix',
    description: 'Premium Clothing Brand',
    currency: '₹',
    currencyCode: 'INR',
    defaultLanguage: 'en',
    defaultTimezone: 'Asia/Kolkata',
};

// Product constants
export const PRODUCT_CONSTANTS = {
    categories: ['casual', 'formal', 'ethnic', 'sports'],
    sizes: ['M', 'L', 'XL', 'XXL', 'XXXL'],
    productFits: ['OVERSIZED FIT', 'CASUAL FIT', 'FORMAL FIT', 'CLASSIC FIT', 'SLIM FIT'],
    statuses: ['draft', 'published', 'archived'],
    minImages: 2,
    maxRating: 5,
};

// Order constants
export const ORDER_CONSTANTS = {
    statuses: ['pending', 'confirmed', 'delivered', 'cancelled'],
    paymentMethods: ['razorpay', 'cod'],
    deliveryPartners: ['dtdc'],
};

// Pagination constants
export const PAGINATION = {
    defaultLimit: 10,
    limits: [10, 20, 50],
    maxVisiblePages: 5,
};

// API constants
export const API_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    timeout: 10000,
    retries: 3,
};

// Validation constants
export const VALIDATION = {
    password: {
        minLength: 6,
        maxLength: 128,
    },
    name: {
        minLength: 2,
        maxLength: 50,
    },
    email: {
        maxLength: 254,
    },
    phone: {
        minLength: 10,
        maxLength: 15,
    },
    product: {
        title: {
            minLength: 3,
            maxLength: 100,
        },
        description: {
            maxLength: 1000,
        },
        price: {
            min: 0,
            max: 100000,
        },
    },
}; 