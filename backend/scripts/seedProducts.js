const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
if (!process.env.MONGODB_URI) {
    require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });
}

const Product = require('../models/Product');

const SLUG_MAP = {
    "Pikachu & Starters Stamp Graphic T-Shirt": "pokemon-stamp-tee",
    "Zeynix & Co. Botanical Sunflower T-Shirt": "sunflower-collection-tee",
    "Renaissance 'Balancing Sins & Virtue' Graphic T-Shirt": "sins-and-virtue-tee",
    "Pixel Art 'Not Today, Satan' Minimalist T-Shirt": "not-today-satan-tee",
    "The Underdog Foundation Streetwear Performance T-Shirt": "underdog-foundation-tee"
};

async function seedProducts() {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://zeynixco:zeynix@zeynix.y10hl9o.mongodb.net/zeynix?appName=Zeynix';
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB successfully.');

        // Load new catalog config
        const configPath = path.join(__dirname, '../../src/data/new-catalog-config.json');
        let catalog = [];
        if (fs.existsSync(configPath)) {
            catalog = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        } else {
            console.error('Catalog config not found at:', configPath);
            process.exit(1);
        }

        console.log(`Found ${catalog.length} products to import/update in catalog.`);

        const activeSlugs = [];

        for (const item of catalog) {
            const slug = item.slug || SLUG_MAP[item.title] || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            activeSlugs.push(slug);

            const originalPrice = item.actualPrice || item.originalPrice || 1999;
            const price = item.discountPrice || item.price || 999;
            const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
            const mainImage = item.images && item.images.length > 0 ? item.images[0] : '';
            const availableStock = item.sizes ? item.sizes.reduce((sum, s) => sum + (s.stock || 0), 0) : 100;

            const productData = {
                name: item.title,
                title: item.title,
                slug: slug,
                productId: slug,
                brand: item.brand || 'Zeynix',
                description: item.description || '',
                images: item.images || [],
                mainImage: mainImage,
                category: item.category || 'casual',
                subcategory: 't-shirts',
                price: price,
                discountPrice: price,
                originalPrice: originalPrice,
                actualPrice: originalPrice,
                discount: discount,
                rating: item.rating || 4.8,
                totalRatings: item.totalRatings || 100,
                productFit: item.productFit || 'OVERSIZED FIT',
                featured: item.featured !== undefined ? item.featured : true,
                isActive: true,
                status: 'published',
                availableStock: availableStock,
                sizes: item.sizes || [
                    { size: 'XS', stock: 50, inStock: true },
                    { size: 'S', stock: 80, inStock: true },
                    { size: 'M', stock: 120, inStock: true },
                    { size: 'L', stock: 150, inStock: true },
                    { size: 'XL', stock: 100, inStock: true },
                    { size: 'XXL', stock: 60, inStock: true }
                ]
            };

            // Idempotent upsert by slug
            const result = await Product.findOneAndUpdate(
                { $or: [{ slug: slug }, { title: item.title }] },
                { $set: productData },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            console.log(`[SUCCESS] Upserted product: "${result.title}" (slug: ${result.slug}, id: ${result._id})`);
        }

        // Archive any old products not in the new active slug list
        const archiveResult = await Product.updateMany(
            { slug: { $nin: activeSlugs }, status: 'published' },
            { $set: { isActive: false, status: 'archived' } }
        );
        console.log(`Archived ${archiveResult.modifiedCount} outdated products from customer view.`);

        // Verification query
        const activeProducts = await Product.find({ isActive: true, status: 'published' });
        console.log(`\nVerified: Total active customer-facing products in MongoDB: ${activeProducts.length}`);
        activeProducts.forEach(p => {
            console.log(`  - ${p.title} | Price: Rs.${p.price} | Images: ${p.images.length} | Slug: ${p.slug}`);
        });

        console.log('\nProduct seed completed idempotently!');
        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('Seed products error:', error);
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
}

seedProducts();
