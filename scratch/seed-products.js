const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '../.env.local');
let MONGODB_URI = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
        if (line.startsWith('MONGODB_URI=')) {
            MONGODB_URI = line.split('MONGODB_URI=')[1].trim().replace(/['"]/g, '');
            break;
        }
    }
} catch (err) {
    console.error('Failed to read .env.local:', err.message);
}

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set in .env.local');
    process.exit(1);
}

// Define Schema
const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    brand: { type: String, default: 'Zeynix' },
    description: String,
    images: [String],
    category: { type: String, enum: ['casual', 'formal', 'ethnic', 'sports'], default: 'casual' },
    actualPrice: { type: Number, required: true },
    discountPrice: Number,
    discount: Number,
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    sizes: [{
        size: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] },
        stock: { type: Number, default: 100 },
        inStock: { type: Boolean, default: true }
    }],
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
    productFit: { type: String, default: 'CASUAL FIT' }
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const productsToSeed = [
    {
        title: 'Classic Logo Tee',
        brand: 'Zeynix',
        description: 'Premium casual tee featuring the embroidered classic Zeynix logo. Crafted from 100% fine combed cotton for ultimate comfort and daily durability.',
        images: ['/images/products/classic-logo-tee.jpg'],
        category: 'casual',
        actualPrice: 899,
        discountPrice: 699,
        rating: 4.8,
        totalRatings: 124,
        sizes: [
            { size: 'XS', stock: 50, inStock: true },
            { size: 'S', stock: 100, inStock: true },
            { size: 'M', stock: 150, inStock: true },
            { size: 'L', stock: 120, inStock: true },
            { size: 'XL', stock: 80, inStock: true },
            { size: 'XXL', stock: 50, inStock: true }
        ],
        featured: true,
        status: 'published',
        productFit: 'CASUAL FIT'
    },
    {
        title: 'Graphic Quote Tee',
        brand: 'Zeynix',
        description: 'Make a bold statement with our graphic typography print tee. Heavyweight organic cotton with a comfortable rib neck and premium screen print.',
        images: ['/images/products/graphic-quote-tee.jpg'],
        category: 'casual',
        actualPrice: 999,
        discountPrice: 749,
        rating: 4.7,
        totalRatings: 98,
        sizes: [
            { size: 'XS', stock: 40, inStock: true },
            { size: 'S', stock: 80, inStock: true },
            { size: 'M', stock: 100, inStock: true },
            { size: 'L', stock: 90, inStock: true },
            { size: 'XL', stock: 60, inStock: true },
            { size: 'XXL', stock: 40, inStock: true }
        ],
        featured: true,
        status: 'published',
        productFit: 'CASUAL FIT'
    },
    {
        title: 'Pocket Essential Tee',
        brand: 'Zeynix',
        description: 'A classic minimalist pocket tee. Soft-touch washed jersey featuring a small, clean front pocket and signature metal label detail.',
        images: ['/images/products/pocket-essential-tee.jpg'],
        category: 'casual',
        actualPrice: 899,
        discountPrice: 699,
        rating: 4.6,
        totalRatings: 74,
        sizes: [
            { size: 'XS', stock: 30, inStock: true },
            { size: 'S', stock: 70, inStock: true },
            { size: 'M', stock: 140, inStock: true },
            { size: 'L', stock: 110, inStock: true },
            { size: 'XL', stock: 70, inStock: true },
            { size: 'XXL', stock: 30, inStock: true }
        ],
        featured: true,
        status: 'published',
        productFit: 'CASUAL FIT'
    },
    {
        title: 'Oversized Everyday Tee',
        brand: 'Zeynix',
        description: 'The ultimate streetwear fit. Relaxed drop-shoulder silhouette, heavyweight 240 GSM loopback cotton, designed to elevate your everyday relaxed outfit.',
        images: ['/images/products/oversized-everyday-tee.jpg'],
        category: 'casual',
        actualPrice: 1099,
        discountPrice: 799,
        rating: 4.9,
        totalRatings: 145,
        sizes: [
            { size: 'XS', stock: 60, inStock: true },
            { size: 'S', stock: 120, inStock: true },
            { size: 'M', stock: 200, inStock: true },
            { size: 'L', stock: 180, inStock: true },
            { size: 'XL', stock: 120, inStock: true },
            { size: 'XXL', stock: 75, inStock: true }
        ],
        featured: true,
        status: 'published',
        productFit: 'OVERSIZED FIT'
    },
    {
        title: 'Custom T-Shirt',
        brand: 'Zeynix',
        description: 'Create your own t-shirt. Personalize with custom fits, colors, placements, uploaded logos, and text.',
        images: ['/images/products/graphic-quote-tee.jpg'],
        category: 'casual',
        actualPrice: 499,
        discountPrice: 499,
        rating: 5.0,
        totalRatings: 1,
        sizes: [
            { size: 'XS', stock: 9999, inStock: true },
            { size: 'S', stock: 9999, inStock: true },
            { size: 'M', stock: 9999, inStock: true },
            { size: 'L', stock: 9999, inStock: true },
            { size: 'XL', stock: 9999, inStock: true },
            { size: 'XXL', stock: 9999, inStock: true }
        ],
        featured: false,
        status: 'published',
        productFit: 'CASUAL FIT'
    }
];

async function main() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected successfully!');

        for (const prodData of productsToSeed) {
            const existing = await Product.findOne({ title: prodData.title, category: prodData.category });
            if (existing) {
                console.log(`Product "${prodData.title}" already exists, updating...`);
                await Product.updateOne({ _id: existing._id }, { $set: prodData });
            } else {
                console.log(`Seeding product "${prodData.title}"...`);
                const product = new Product(prodData);
                await product.save();
            }
        }

        console.log('🎉 Seeding completed successfully!');
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error during seeding:', err);
    }
}

main();
