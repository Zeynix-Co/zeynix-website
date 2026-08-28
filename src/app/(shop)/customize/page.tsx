'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import useCartStore from '@/store/cartStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { colorClasses } from '@/lib/constants';
import { ArrowLeft, Upload, Check, Info, Sparkles, RefreshCw, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

// Predefined Swatches
const COLORS = [
    { name: 'Black', hex: '#1C1C1E', textHex: '#FFFFFF' },
    { name: 'White', hex: '#F2F2F7', textHex: '#1C1C1E' },
    { name: 'Navy', hex: '#070F2B', textHex: '#FFFFFF' },
    { name: 'Cream', hex: '#FCF8DD', textHex: '#070F2B' },
    { name: 'Olive', hex: '#3E4E3C', textHex: '#FFFFFF' },
    { name: 'Grey', hex: '#8E8E93', textHex: '#FFFFFF' }
];

const FITS = [
    { id: 'regular', name: 'Regular Fit', desc: 'Classic everyday fit, 100% fine cotton', surcharge: 0 },
    { id: 'oversized', name: 'Oversized Fit', desc: 'Trendy boxy fit, heavy 240 GSM cotton', surcharge: 100 },
    { id: 'premium', name: 'Premium Tee', desc: 'Luxury organic cotton, premium feel', surcharge: 200 }
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const PLACEMENTS = [
    { id: 'front', name: 'Front Center', textOffset: 'top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2' },
    { id: 'back', name: 'Back Center', textOffset: 'top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2' },
    { id: 'chest', name: 'Left Chest', textOffset: 'top-1/4 left-1/3 -translate-x-1/2' },
    { id: 'sleeve', name: 'Left Sleeve', textOffset: 'top-1/3 left-[20%] -translate-x-1/2' }
];

const FONTS = [
    { name: 'Sans Serif', value: 'var(--font-afacad), sans-serif' },
    { name: 'Serif', value: 'Georgia, serif' },
    { name: 'Monospace', value: 'Courier New, monospace' },
    { name: 'Signature / Script', value: 'Brush Script MT, cursive' },
    { name: 'Impact / Bold', value: 'Impact, sans-serif' }
];

export default function CustomizePage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { addToCart } = useCartStore();

    // Database custom product reference
    const [dbProduct, setDbProduct] = useState<any>(null);

    // Customization state
    const [fit, setFit] = useState(FITS[0]);
    const [color, setColor] = useState(COLORS[0]);
    const [size, setSize] = useState('M');
    const [customText, setCustomText] = useState('');
    const [textColor, setTextColor] = useState('#FFCB05'); // Accent gold default
    const [textFont, setTextFont] = useState(FONTS[0]);
    const [textSize, setTextSize] = useState(16);
    const [customImage, setCustomImage] = useState<string | null>(null);
    const [placement, setPlacement] = useState(PLACEMENTS[0]);

    // UI State
    const [step, setStep] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch Custom T-Shirt product from DB
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch('/api/customer/products/search?q=Custom');
                const json = await response.json();
                if (json.success && json.data.products.length > 0) {
                    // Match the Custom T-Shirt entry
                    const match = json.data.products.find((p: any) => p.name.toLowerCase().includes('custom'));
                    setDbProduct(match || json.data.products[0]);
                }
            } catch (err) {
                console.error('Failed to fetch Custom T-Shirt from DB:', err);
            }
        };
        fetchProduct();
    }, []);

    // Pricing calculations
    const basePrice = 499 + fit.surcharge;
    const customizationPrice = (customText || customImage) ? 150 : 0;
    const totalPrice = basePrice + customizationPrice;

    // Handle Image Upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (uploadEvent) => {
                if (uploadEvent.target?.result) {
                    setCustomImage(uploadEvent.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClearLogo = () => {
        setCustomImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Add to Cart handler
    const handleAddToCart = () => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/customize');
            return;
        }

        const productId = dbProduct?.id || dbProduct?._id || 'custom-t-shirt-fallback-id';

        addToCart({
            product: {
                id: productId,
                title: `${fit.name} - Customized (${color.name})`,
                images: ['/images/category-casual.jpg'], // fallback
                price: basePrice,
                discountPrice: basePrice
            },
            size: size as any,
            quantity: 1,
            totalPrice: totalPrice,
            customization: {
                fit: fit.name,
                color: color.name,
                customImage: customImage || undefined,
                customText: customText || undefined,
                textColor: textColor,
                textFont: textFont.name,
                textSize: `${textSize}px`,
                placement: placement.name,
                customizationPrice: customizationPrice,
                basePrice: basePrice
            }
        });

        setIsAdded(true);
        setTimeout(() => {
            setIsAdded(false);
            router.push('/cart');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#FCF8DD] text-[#070F2B] font-sans">
            <Header />

            {/* Breadcrumb / Top Bar */}
            <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
                <Link href="/" className="inline-flex items-center text-sm font-medium hover:text-[#FFCB05] transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Store
                </Link>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#070F2B]/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight uppercase md:text-4xl">
                            Customize Your Tee
                        </h1>
                        <p className="text-sm text-[#070F2B]/70 mt-1">
                            Premium fabrics, custom fits, and your unique designs. Handcrafted by Zeynix.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 bg-[#070F2B] text-white py-2.5 px-4 rounded-xl shadow-lg border border-white/5">
                        <Sparkles className="w-5 h-5 text-[#FFCB05]" />
                        <span className="text-sm font-semibold">Total Price: ₹{totalPrice}</span>
                    </div>
                </div>
            </div>

            {/* Main Customize Area */}
            <main className="max-w-7xl mx-auto px-4 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Live Interactive Mockup (6 Cols) */}
                    <div className="lg:col-span-7 bg-[#070F2B] text-white rounded-3xl p-6 md:p-10 shadow-2xl flex flex-col items-center justify-center relative min-h-[480px] lg:min-h-[580px] lg:sticky lg:top-24 border border-white/10">
                        <span className="absolute top-4 left-6 text-xs font-bold tracking-widest text-white/40 uppercase">
                            LIVE PREVIEW &bull; {placement.name}
                        </span>

                        {/* Interactive T-Shirt SVG Mockup */}
                        <div className="relative w-full max-w-[340px] md:max-w-[400px] aspect-square flex items-center justify-center transition-all duration-300">
                            
                            {/* SVG T-Shirt Shape */}
                            <svg 
                                className="w-full h-full drop-shadow-[0_25px_35px_rgba(0,0,0,0.4)]"
                                viewBox="0 0 100 100" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path 
                                    d="M28 20L31.5 8L39 12C42 10.5 45 10 50 10C55 10 58 10.5 61 12L68.5 8L72 20L63.5 24.5V90H36.5V24.5L28 20Z" 
                                    fill={color.hex} 
                                    stroke="#FFFFFF" 
                                    strokeWidth="0.8" 
                                    strokeLinejoin="round"
                                />
                                {/* Collar detail */}
                                <path 
                                    d="M39 12C42.5 15.5 46.5 16.5 50 16.5C53.5 16.5 57.5 15.5 61 12" 
                                    stroke="#FFFFFF" 
                                    strokeWidth="0.8"
                                    fill="none"
                                />
                            </svg>

                            {/* Absolute Overlay for Customization placement wrapper */}
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                <div className="w-[180px] h-[240px] relative mt-[20px] flex items-center justify-center">
                                    
                                    {/* Placed Elements Container based on selected Placement offset */}
                                    <div className={`absolute flex flex-col items-center justify-center gap-3 transition-all duration-500 w-full max-w-[120px] ${
                                        placement.id === 'chest' ? 'top-[25%] left-[20%] items-start' :
                                        placement.id === 'sleeve' ? 'top-[22%] left-[-15%] items-center' :
                                        'top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2'
                                    }`}>
                                        
                                        {/* Uploaded Logo Preview */}
                                        {customImage && (
                                            <div className="w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center bg-black/10 backdrop-blur-xs border border-white/20 shadow-inner">
                                                <img src={customImage} alt="Custom Logo" className="w-full h-full object-contain" />
                                            </div>
                                        )}

                                        {/* Custom Text Overlay */}
                                        {customText && (
                                            <p 
                                                className="text-center font-bold break-words tracking-wide leading-tight drop-shadow-md max-w-[130px]" 
                                                style={{ 
                                                    color: textColor, 
                                                    fontFamily: textFont.value,
                                                    fontSize: `${Math.min(textSize * 0.7, 24)}px`
                                                }}
                                            >
                                                {customText}
                                            </p>
                                        )}

                                        {/* Empty design indicator */}
                                        {!customText && !customImage && (
                                            <div className="opacity-20 border-2 border-dashed border-white py-4 px-6 rounded text-[10px] tracking-wider text-center uppercase font-bold text-white w-full max-w-[110px]">
                                                Add Art Here
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reset / Info banner */}
                        <div className="mt-8 text-xs text-white/50 text-center flex items-center gap-2">
                            <Info className="w-4 h-4 text-[#FFCB05]" />
                            Mock visualization. Final printing layout will be polished by our design team.
                        </div>
                    </div>

                    {/* Right Column: Customizer Options Stepper (5 Cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* Steps Navigation Bar */}
                        <div className="bg-white rounded-2xl p-4 shadow-md flex items-center justify-between border border-[#070F2B]/5">
                            {[1, 2, 3].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setStep(num)}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
                                        step === num
                                            ? 'bg-[#070F2B] text-white shadow-md'
                                            : 'text-[#070F2B]/60 hover:text-[#070F2B]'
                                    }`}
                                >
                                    Step {num}
                                </button>
                            ))}
                        </div>

                        {/* Step Panels */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-[#070F2B]/5 min-h-[380px] flex flex-col justify-between">
                            <div>
                                
                                {/* STEP 1: SELECT FIT & SIZING */}
                                {step === 1 && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div>
                                            <h3 className="text-lg font-extrabold uppercase tracking-wide mb-1 flex items-center gap-2">
                                                <span>1. Select T-Shirt Fit</span>
                                                <span className="text-[10px] bg-[#FFCB05]/30 text-[#070F2B] py-0.5 px-2 rounded-full font-bold">REQUIRED</span>
                                            </h3>
                                            <p className="text-xs text-gray-500 mb-4">Choose your preferred silhouette style.</p>
                                            
                                            <div className="space-y-3">
                                                {FITS.map((f) => (
                                                    <label 
                                                        key={f.id}
                                                        onClick={() => setFit(f)}
                                                        className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                                                            fit.id === f.id
                                                                ? 'border-[#070F2B] bg-[#070F2B]/5 shadow-sm'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`w-4 h-4 rounded-full border border-[#070F2B] mt-1 flex items-center justify-center`}>
                                                                {fit.id === f.id && <div className="w-2.5 h-2.5 bg-[#070F2B] rounded-full" />}
                                                            </div>
                                                            <div>
                                                                <span className="text-sm font-bold block">{f.name}</span>
                                                                <span className="text-xs text-gray-500 block mt-0.5">{f.desc}</span>
                                                            </div>
                                                        </div>
                                                        {f.surcharge > 0 && (
                                                            <span className="text-xs font-bold text-[#FFCB05] bg-[#070F2B] px-2 py-0.5 rounded-md">+₹{f.surcharge}</span>
                                                        )}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-extrabold uppercase tracking-wide mb-1 flex items-center gap-2">
                                                <span>2. Select Size</span>
                                                <span className="text-[10px] bg-[#FFCB05]/30 text-[#070F2B] py-0.5 px-2 rounded-full font-bold">REQUIRED</span>
                                            </h3>
                                            <p className="text-xs text-gray-500 mb-3">Make sure to check the size specifications.</p>
                                            
                                            <div className="grid grid-cols-6 gap-2">
                                                {SIZES.map((sz) => (
                                                    <button
                                                        key={sz}
                                                        onClick={() => setSize(sz)}
                                                        className={`py-3 text-xs font-bold rounded-xl border-2 transition-all duration-300 ${
                                                            size === sz
                                                                ? 'border-[#070F2B] bg-[#070F2B] text-white shadow-md'
                                                                : 'border-gray-200 hover:border-gray-300 text-[#070F2B]/80'
                                                        }`}
                                                    >
                                                        {sz}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2: COLOR & PLACEMENT */}
                                {step === 2 && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div>
                                            <h3 className="text-lg font-extrabold uppercase tracking-wide mb-1 flex items-center gap-2">
                                                <span>1. Select Color Swatch</span>
                                            </h3>
                                            <p className="text-xs text-gray-500 mb-3">Colors might look slightly different on fabrics.</p>
                                            
                                            <div className="grid grid-cols-6 gap-3">
                                                {COLORS.map((c) => (
                                                    <button
                                                        key={c.name}
                                                        onClick={() => setColor(c)}
                                                        className={`aspect-square rounded-full border-2 relative flex items-center justify-center shadow-inner group hover:scale-105 transition-all duration-300 ${
                                                            color.name === c.name 
                                                                ? 'border-[#070F2B] scale-110 ring-2 ring-[#FFCB05]' 
                                                                : 'border-gray-300'
                                                        }`}
                                                        style={{ backgroundColor: c.hex }}
                                                        title={c.name}
                                                    >
                                                        {color.name === c.name && (
                                                            <Check className="w-4 h-4 font-black" style={{ color: c.textHex }} />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                            <span className="text-xs font-bold block text-gray-600 mt-2">Active choice: <span className="text-[#070F2B] underline">{color.name}</span></span>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-extrabold uppercase tracking-wide mb-1">
                                                2. Print Placement
                                            </h3>
                                            <p className="text-xs text-gray-500 mb-3">Choose where you want your custom details positioned.</p>
                                            
                                            <div className="grid grid-cols-2 gap-3">
                                                {PLACEMENTS.map((p) => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => setPlacement(p)}
                                                        className={`p-3 text-xs font-bold rounded-xl border-2 text-left transition-all duration-300 ${
                                                            placement.id === p.id
                                                                ? 'border-[#070F2B] bg-[#070F2B]/5 shadow-sm'
                                                                : 'border-gray-200 hover:border-gray-300 text-[#070F2B]/80'
                                                        }`}
                                                    >
                                                        {p.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: CUSTOM ARTWORK & TEXT */}
                                {step === 3 && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        
                                        {/* Logo Upload Section */}
                                        <div>
                                            <h3 className="text-lg font-extrabold uppercase tracking-wide mb-1 flex items-between justify-between">
                                                <span>1. Upload Logo / Artwork</span>
                                                <span className="text-[10px] bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full font-bold">OPTIONAL</span>
                                            </h3>
                                            <p className="text-xs text-gray-500 mb-3">Add your corporate logo or visual design (PNG/JPG).</p>
                                            
                                            <div className="flex items-center gap-3">
                                                <input 
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleImageUpload}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="flex-1 py-3 px-4 border-2 border-dashed border-gray-300 rounded-2xl hover:border-[#070F2B] hover:bg-gray-55/10 flex items-center justify-center gap-2 transition-all cursor-pointer font-bold text-sm text-gray-600 hover:text-[#070F2B]"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    {customImage ? 'Change Image' : 'Select Artwork File'}
                                                </button>
                                                {customImage && (
                                                    <button
                                                        onClick={handleClearLogo}
                                                        className="py-3 px-4 text-xs font-bold text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 rounded-xl transition-all cursor-pointer"
                                                    >
                                                        Clear
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Custom Text Section */}
                                        <div>
                                            <h3 className="text-lg font-extrabold uppercase tracking-wide mb-1 flex items-between justify-between">
                                                <span>2. Add Custom Text</span>
                                                <span className="text-[10px] bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full font-bold">OPTIONAL</span>
                                            </h3>
                                            <p className="text-xs text-gray-500 mb-3">Add quotes, numbers, or names to your shirt.</p>
                                            
                                            <input 
                                                type="text"
                                                value={customText}
                                                onChange={(e) => setCustomText(e.target.value)}
                                                maxLength={30}
                                                className="w-full p-3.5 border-2 border-gray-200 focus:border-[#070F2B] rounded-xl text-sm font-medium focus:outline-none mb-3"
                                                placeholder="Type your custom text here..."
                                            />

                                            {customText && (
                                                <div className="space-y-4 pt-2 animate-in fade-in duration-300">
                                                    
                                                    {/* Text Customization options */}
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Font Style</label>
                                                            <select
                                                                value={textFont.name}
                                                                onChange={(e) => {
                                                                    const selected = FONTS.find(f => f.name === e.target.value);
                                                                    if (selected) setTextFont(selected);
                                                                }}
                                                                className="w-full p-2.5 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none"
                                                            >
                                                                {FONTS.map(f => (
                                                                    <option key={f.name} value={f.name}>{f.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Text Color</label>
                                                            <div className="flex items-center gap-1.5 p-1 border border-gray-200 rounded-lg bg-gray-50">
                                                                <input 
                                                                    type="color" 
                                                                    value={textColor}
                                                                    onChange={(e) => setTextColor(e.target.value)}
                                                                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                                                />
                                                                <span className="text-[10px] font-mono font-bold text-gray-600">{textColor.toUpperCase()}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Text Size Slider */}
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Text Size</label>
                                                            <span className="text-xs font-mono font-semibold">{textSize}px</span>
                                                        </div>
                                                        <input 
                                                            type="range"
                                                            min="12"
                                                            max="40"
                                                            value={textSize}
                                                            onChange={(e) => setTextSize(parseInt(e.target.value))}
                                                            className="w-full accent-[#070F2B]"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Navigation CTA controls at panel bottom */}
                            <div className="border-t border-gray-100 pt-6 mt-6">
                                <div className="flex items-center justify-between gap-3">
                                    {step > 1 ? (
                                        <button
                                            onClick={() => setStep(step - 1)}
                                            className="py-3 px-5 text-sm font-bold rounded-2xl border-2 border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 transition-all cursor-pointer"
                                        >
                                            Back
                                        </button>
                                    ) : (
                                        <div />
                                    )}

                                    {step < 3 ? (
                                        <button
                                            onClick={() => setStep(step + 1)}
                                            className="py-3 px-8 text-sm font-bold rounded-2xl bg-[#070F2B] text-white hover:opacity-90 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all flex-1 md:flex-initial"
                                        >
                                            Next Step
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={isAdded}
                                            className={`py-3.5 px-8 text-sm font-extrabold rounded-2xl text-white shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer flex-1 ${
                                                isAdded 
                                                    ? 'bg-green-600 hover:bg-green-600' 
                                                    : 'bg-[#070F2B] hover:opacity-90 border border-white/5'
                                            }`}
                                        >
                                            {isAdded ? (
                                                <>
                                                    <Check className="w-5 h-5" />
                                                    Added to Cart!
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCart className="w-5 h-5" />
                                                    Add Customized Tee
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Interactive Price Summary Card */}
                        <div className="bg-white rounded-3xl p-5 shadow-lg border border-[#070F2B]/5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Price Breakdown</h4>
                            <div className="space-y-2 text-sm font-medium">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Base Shirt ({fit.name})</span>
                                    <span>₹{basePrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 flex items-center gap-1.5">
                                        Customization Surcharge
                                        <span title="Flat print/processing cost for custom text or visual graphics uploads.">
                                            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                                        </span>
                                    </span>
                                    <span>₹{customizationPrice}</span>
                                </div>
                                <div className="border-t border-dashed pt-2 mt-2 flex justify-between font-bold text-base text-[#070F2B]">
                                    <span>Final Price</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
