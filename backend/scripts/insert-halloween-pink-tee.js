const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read MONGODB_URI
let MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    const envPaths = [
        path.join(__dirname, '../.env'),
        path.join(__dirname, '../../.env.local')
    ];
    for (const p of envPaths) {
        if (fs.existsSync(p)) {
            const content = fs.readFileSync(p, 'utf8');
            for (const line of content.split('\n')) {
                if (line.startsWith('MONGODB_URI=')) {
                    MONGODB_URI = line.split('MONGODB_URI=')[1].trim().replace(/['"]/g, '');
                    break;
                }
            }
        }
        if (MONGODB_URI) break;
    }
}

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found.');
    process.exit(1);
}

const sizes_template = [
    { size: "XS", stock: 45, inStock: true },
    { size: "S", stock: 90, inStock: true },
    { size: "M", stock: 155, inStock: true },
    { size: "L", stock: 180, inStock: true },
    { size: "XL", stock: 120, inStock: true },
    { size: "XXL", stock: 65, inStock: true }
];

const product = {
    title: "Kawaii 'Pink Bow Ghosts & Cherry Blossom Dream' Halloween Oversized Pink T-Shirt",
    slug: "halloween-kawaii-pink-bow-ghosts-cherry-blossom-pink-tee",
    brand: "Zeynix",
    description: "Pastel kawaii aesthetic meets spooky season enchantment. Cut in a contemporary drop-shoulder oversized silhouette from 240 GSM organic combed cotton in delicate baby pink. The front is adorned with an artistic branch of blooming sakura cherry blossoms drifting with delicate petals, accompanied by a minimalist flower sketch and the inspiring calligraphy quote 'If you can dream it you can do it'. The back brings pure whimsical Halloween joy with a delightful constellation of adorable sheet ghosts wearing soft pink ribbons and carrying trick-or-treat jack-o'-lantern candy baskets.",
    images: [
        "/images/products/new/halloween-kawaii-pink-bow-ghosts-cherry-blossom-pink-tee/front.png",
        "/images/products/new/halloween-kawaii-pink-bow-ghosts-cherry-blossom-pink-tee/back.png",
        "/images/products/new/halloween-kawaii-pink-bow-ghosts-cherry-blossom-pink-tee/whole.png"
    ],
    mainImage: "/images/products/new/halloween-kawaii-pink-bow-ghosts-cherry-blossom-pink-tee/front.png",
    category: "unisex",
    subcategory: "t-shirts",
    actualPrice: 1349,
    originalPrice: 1349,
    discountPrice: 699,
    price: 699,
    discount: 48,
    rating: 5.0,
    totalRatings: 315,
    productFit: "OVERSIZED FIT",
    featured: false,
    isActive: true,
    status: "published",
    sizes: sizes_template,
    createdAt: new Date('2026-10-04T20:50:00.000Z')
};

async function run() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
    const col = mongoose.connection.collection('products');
    console.log('Connected to MongoDB.');

    // 1. Insert/update in MongoDB
    const doc = {
        name: product.title,
        title: product.title,
        slug: product.slug,
        productId: product.slug,
        brand: product.brand,
        description: product.description,
        mainImage: product.mainImage,
        images: product.images,
        category: product.category,
        subcategory: product.subcategory,
        price: product.discountPrice,
        originalPrice: product.actualPrice,
        actualPrice: product.actualPrice,
        discountPrice: product.discountPrice,
        discount: product.discount,
        rating: product.rating,
        totalRatings: product.totalRatings,
        availableStock: product.sizes.reduce((acc, s) => acc + s.stock, 0),
        sizes: product.sizes,
        isActive: true,
        featured: product.featured,
        status: product.status,
        productFit: product.productFit,
        createdAt: product.createdAt,
        updatedAt: new Date()
    };

    const res = await col.updateOne(
        { slug: product.slug },
        { $set: doc },
        { upsert: true }
    );
    console.log(`[DB] ${product.slug} (matched: ${res.matchedCount}, upserted: ${res.upsertedId || 'existing'})`);

    // 2. Update catalog config JSON
    const configPath = path.join(__dirname, '../../src/data/new-catalog-config.json');
    if (fs.existsSync(configPath)) {
        let catalog = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        // Remove if previously present to avoid duplicates
        catalog = catalog.filter(p => p.slug !== product.slug);

        const cleanProd = {
            title: product.title,
            slug: product.slug,
            brand: product.brand,
            description: product.description,
            images: product.images,
            mainImage: product.mainImage,
            category: product.category,
            subcategory: product.subcategory,
            actualPrice: product.actualPrice,
            originalPrice: product.originalPrice,
            discountPrice: product.discountPrice,
            price: product.price,
            discount: product.discount,
            rating: product.rating,
            totalRatings: product.totalRatings,
            productFit: product.productFit,
            featured: product.featured,
            sizes: product.sizes
        };
        catalog.push(cleanProd);

        fs.writeFileSync(configPath, JSON.stringify(catalog, null, 2), 'utf8');
        console.log(`Saved ${configPath} (total: ${catalog.length} items)`);
    }

    const totalInDb = await col.countDocuments({ isActive: true });
    console.log(`Total active products now in DB: ${totalInDb}`);

    await mongoose.disconnect();
    console.log('All done!');
}

run().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
