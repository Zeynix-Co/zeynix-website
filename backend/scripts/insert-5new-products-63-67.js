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

const productsToAdd = [
    // Position 63
    {
        position: 63,
        title: "Bitcoin 'It's Time For Plan ₿ - Currency Tic-Tac-Toe' Oversized Black T-Shirt",
        slug: "bitcoin-time-for-plan-b-tictactoe-tee",
        brand: "Zeynix",
        description: "Decentralized financial revolution meets high-concept streetwear. Constructed on 240 GSM organic heavy combed cotton in pitch black. The chest features bold two-tone typography 'IT'S TIME FOR PLAN ₿' highlighted in electric crypto orange. The reverse commands attention with an iconic currency Tic-Tac-Toe matrix where Bitcoin scores a winning diagonal strike across fiat currencies including the Euro, Dollar, Pound, Yen, Rupee, and Ruble.",
        images: [
            "/images/products/new/bitcoin-time-for-plan-b-tictactoe-tee/front.png",
            "/images/products/new/bitcoin-time-for-plan-b-tictactoe-tee/back.png",
            "/images/products/new/bitcoin-time-for-plan-b-tictactoe-tee/whole.png"
        ],
        mainImage: "/images/products/new/bitcoin-time-for-plan-b-tictactoe-tee/front.png",
        category: "unisex",
        subcategory: "t-shirts",
        actualPrice: 1349,
        originalPrice: 1349,
        discountPrice: 699,
        price: 699,
        discount: 48,
        rating: 5.0,
        totalRatings: 268,
        productFit: "OVERSIZED FIT",
        featured: false,
        isActive: true,
        status: "published",
        sizes: sizes_template,
        createdAt: new Date('2026-10-04T21:02:00.000Z')
    },
    // Position 64
    {
        position: 64,
        title: "Crypto Chemistry 'Cr Y Pt O Periodic Table & Rolled Cash' Oversized Black T-Shirt",
        slug: "crypto-periodic-table-money-stack-tee",
        brand: "Zeynix",
        description: "Scientific alchemy meets wealth mindset streetwear. Tailored from 240 GSM dense combed cotton in midnight black. The front displays a minimalist periodic table sequence breaking down 'CRYPTO' into elemental blocks of Chromium, Yttrium, Platinum, and Oxygen. The back makes a powerful statement with towering vertical 'MONEY' lettering overlaid with a hyper-detailed photorealistic rolled bundle of hundred-dollar bills bound by a rubber band.",
        images: [
            "/images/products/new/crypto-periodic-table-money-stack-tee/front.png",
            "/images/products/new/crypto-periodic-table-money-stack-tee/back.png",
            "/images/products/new/crypto-periodic-table-money-stack-tee/whole.png"
        ],
        mainImage: "/images/products/new/crypto-periodic-table-money-stack-tee/front.png",
        category: "unisex",
        subcategory: "t-shirts",
        actualPrice: 1349,
        originalPrice: 1349,
        discountPrice: 699,
        price: 699,
        discount: 48,
        rating: 5.0,
        totalRatings: 312,
        productFit: "OVERSIZED FIT",
        featured: false,
        isActive: true,
        status: "published",
        sizes: sizes_template,
        createdAt: new Date('2026-10-04T21:01:00.000Z')
    },
    // Position 65
    {
        position: 65,
        title: "Botanical Aesthetic 'Flower Typo & Watercolor Petal' Oversized Buttercream T-Shirt",
        slug: "botanical-flower-typo-watercolor-petal-tee",
        brand: "Zeynix",
        description: "Soft nature aesthetic meets contemporary drop-shoulder tailoring. Crafted from premium 240 GSM organic combed cotton in soothing buttercream cream. The chest showcases layered rose quartz typography 'FLOWER' with mirror reflections against a delicate bloom, balanced by an oversized translucent watercolor flower blossom draping over the hemline and seamlessly continuing across the back.",
        images: [
            "/images/products/new/botanical-flower-typo-watercolor-petal-tee/front.png",
            "/images/products/new/botanical-flower-typo-watercolor-petal-tee/back.png",
            "/images/products/new/botanical-flower-typo-watercolor-petal-tee/whole.png"
        ],
        mainImage: "/images/products/new/botanical-flower-typo-watercolor-petal-tee/front.png",
        category: "unisex",
        subcategory: "t-shirts",
        actualPrice: 1349,
        originalPrice: 1349,
        discountPrice: 699,
        price: 699,
        discount: 48,
        rating: 5.0,
        totalRatings: 285,
        productFit: "OVERSIZED FIT",
        featured: false,
        isActive: true,
        status: "published",
        sizes: sizes_template,
        createdAt: new Date('2026-10-04T21:00:00.000Z')
    },
    // Position 66
    {
        position: 66,
        title: "Marvel Spider-Man 'Peter Parker Great Power Typography Mask' Oversized Black T-Shirt",
        slug: "marvel-spiderman-peter-parker-typography-mask-tee",
        brand: "Zeynix",
        description: "Tribute to Marvel's ultimate web-slinger in iconic graphic typography. Engineered on 240 GSM heavyweight combed cotton in deep onyx black. The front presents a sharp crimson Spider emblem inscribed with Uncle Ben's legendary creed 'With great power comes great responsibility'. The reverse commands the spotlight with an avant-garde mask portrait formed entirely from typography, framing Peter Parker's alter-ego and stark white expressive eye lenses.",
        images: [
            "/images/products/new/marvel-spiderman-peter-parker-typography-mask-tee/front.png",
            "/images/products/new/marvel-spiderman-peter-parker-typography-mask-tee/back.png",
            "/images/products/new/marvel-spiderman-peter-parker-typography-mask-tee/whole.png"
        ],
        mainImage: "/images/products/new/marvel-spiderman-peter-parker-typography-mask-tee/front.png",
        category: "unisex",
        subcategory: "t-shirts",
        actualPrice: 1349,
        originalPrice: 1349,
        discountPrice: 699,
        price: 699,
        discount: 48,
        rating: 5.0,
        totalRatings: 340,
        productFit: "OVERSIZED FIT",
        featured: false,
        isActive: true,
        status: "published",
        sizes: sizes_template,
        createdAt: new Date('2026-10-04T20:59:00.000Z')
    },
    // Position 67
    {
        position: 67,
        title: "Cinematic Grunge 'Eyes Never Lie & Hazel Gaze' Oversized Black T-Shirt",
        slug: "cinematic-grunge-eyes-never-lie-black-tee",
        brand: "Zeynix",
        description: "Raw cinematic grunge meets intimate emotional streetwear. Cut from 240 GSM organic dense combed cotton in midnight black. The chest showcases a dramatic triple-split photographic film crop of captivating hazel eyes inscribed with 'I've got my eyes on you'. The reverse signs off with an understated distressed stencil typography at the lower right corner declaring the timeless truth: 'EYES NEVER LIE...'.",
        images: [
            "/images/products/new/cinematic-grunge-eyes-never-lie-black-tee/front.png",
            "/images/products/new/cinematic-grunge-eyes-never-lie-black-tee/back.png",
            "/images/products/new/cinematic-grunge-eyes-never-lie-black-tee/whole.png"
        ],
        mainImage: "/images/products/new/cinematic-grunge-eyes-never-lie-black-tee/front.png",
        category: "unisex",
        subcategory: "t-shirts",
        actualPrice: 1349,
        originalPrice: 1349,
        discountPrice: 699,
        price: 699,
        discount: 48,
        rating: 5.0,
        totalRatings: 295,
        productFit: "OVERSIZED FIT",
        featured: false,
        isActive: true,
        status: "published",
        sizes: sizes_template,
        createdAt: new Date('2026-10-04T20:58:00.000Z')
    }
];

async function run() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    const col = mongoose.connection.collection('products');
    console.log('✅ Connected to MongoDB.');

    // 1. Insert/update in MongoDB
    for (const p of productsToAdd) {
        const doc = {
            name: p.title,
            title: p.title,
            slug: p.slug,
            productId: p.slug,
            brand: p.brand,
            description: p.description,
            mainImage: p.mainImage,
            images: p.images,
            category: p.category,
            subcategory: p.subcategory,
            price: p.discountPrice,
            originalPrice: p.actualPrice,
            actualPrice: p.actualPrice,
            discountPrice: p.discountPrice,
            discount: p.discount,
            rating: p.rating,
            totalRatings: p.totalRatings,
            availableStock: p.sizes.reduce((acc, s) => acc + s.stock, 0),
            sizes: p.sizes,
            isActive: true,
            featured: p.featured,
            status: p.status,
            productFit: p.productFit,
            createdAt: p.createdAt,
            updatedAt: new Date()
        };

        const res = await col.updateOne(
            { slug: p.slug },
            { $set: doc },
            { upsert: true }
        );
        console.log(`[DB] Position ${p.position}: ${p.slug} (matched: ${res.matchedCount}, upserted: ${res.upsertedId || 'existing'})`);
    }

    // 2. Update catalog config JSON
    const configPath = path.join(__dirname, '../../src/data/new-catalog-config.json');
    if (fs.existsSync(configPath)) {
        let catalog = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const newSlugs = productsToAdd.map(p => p.slug);
        // Remove if previously present to avoid duplicates
        catalog = catalog.filter(p => !newSlugs.includes(p.slug));

        // Append to the catalog at positions 63, 64, 65, 66, 67
        for (const p of productsToAdd) {
            const cleanProd = {
                title: p.title,
                slug: p.slug,
                brand: p.brand,
                description: p.description,
                images: p.images,
                mainImage: p.mainImage,
                category: p.category,
                subcategory: p.subcategory,
                actualPrice: p.actualPrice,
                originalPrice: p.originalPrice,
                discountPrice: p.discountPrice,
                price: p.price,
                discount: p.discount,
                rating: p.rating,
                totalRatings: p.totalRatings,
                productFit: p.productFit,
                featured: p.featured,
                sizes: p.sizes
            };
            catalog.push(cleanProd);
        }

        fs.writeFileSync(configPath, JSON.stringify(catalog, null, 2), 'utf8');
        console.log(`✅ Saved ${configPath} (total: ${catalog.length} items)`);
    }

    // 3. Verify ordering from MongoDB
    const allProds = await col
        .find({ isActive: true, status: 'published' })
        .sort({ createdAt: -1 })
        .toArray();

    console.log(`\n--- VERIFIED FULL ACTIVE CATALOG (Total: ${allProds.length}) ---`);
    console.log('Products from position 60 to 67:');
    allProds.slice(59, 67).forEach((p, idx) => {
        console.log(`Position ${60 + idx}: [${p.createdAt.toISOString()}] ${p.title} (${p.slug})`);
    });

    await mongoose.disconnect();
    console.log('\nAll done!');
}

run().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
