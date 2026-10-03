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

const newProducts = [
    {
        title: "Aesthetic Gaze 'Yes Is Clear' Crimson Heart Oversized Black T-Shirt",
        slug: "aesthetic-gaze-yes-is-clear-heart-tee",
        brand: "Zeynix",
        description: "Subtle emotional depth meets cinematic street aesthetics. Crafted from heavyweight 240 GSM organic combed black cotton jersey with a structured drop-shoulder drape. The front displays a poignant black-and-white cinematic eye gaze portrait framed in a minimalist horizontal letterbox cut. The reverse features an expressive magenta-pink outline heart enclosing intimate portraits and the profound streetwear typography: 'And if you're ever confused between a yes or a no, its always no, because yes is clear.'",
        images: [
            "/images/products/new/aesthetic-gaze-yes-is-clear-heart-tee/front.png",
            "/images/products/new/aesthetic-gaze-yes-is-clear-heart-tee/back.png",
            "/images/products/new/aesthetic-gaze-yes-is-clear-heart-tee/whole.png"
        ],
        mainImage: "/images/products/new/aesthetic-gaze-yes-is-clear-heart-tee/front.png",
        category: "casual",
        subcategory: "t-shirts",
        actualPrice: 1899,
        discountPrice: 549,
        rating: 5.0,
        totalRatings: 235,
        productFit: "OVERSIZED FIT",
        featured: true,
        sizes: sizes_template,
        createdAt: new Date('2026-10-01T07:35:00.000Z')
    },
    {
        title: "Marvel Avengers 'Tony Stark Arc Reactor Legacy' Oversized Black T-Shirt",
        slug: "iron-man-tony-stark-legacy-arc-reactor-tee",
        brand: "Zeynix",
        description: "Honor the ultimate Avenger in this heavyweight 240 GSM drop-shoulder black cotton jersey. The front chest is stamped with the legendary glowing Arc Reactor emblem inscribed with 'Proof That Tony Stark Has A Heart'. The reverse features a high-impact crimson red and monochrome montage of Robert Downey Jr. as Tony Stark, accented with Stark Industries technical HUD blueprints, Mark armor suits, and classic quotes: 'I Am Iron Man. Legacy' and 'Genius. Billionaire. Playboy. Philanthropist.'",
        images: [
            "/images/products/new/iron-man-tony-stark-legacy-arc-reactor-tee/front.png",
            "/images/products/new/iron-man-tony-stark-legacy-arc-reactor-tee/back.png",
            "/images/products/new/iron-man-tony-stark-legacy-arc-reactor-tee/whole.png"
        ],
        mainImage: "/images/products/new/iron-man-tony-stark-legacy-arc-reactor-tee/front.png",
        category: "casual",
        subcategory: "t-shirts",
        actualPrice: 1999,
        discountPrice: 599,
        rating: 5.0,
        totalRatings: 280,
        productFit: "OVERSIZED FIT",
        featured: true,
        sizes: sizes_template,
        createdAt: new Date('2026-10-01T07:34:00.000Z')
    },
    {
        title: "Looney Tunes 'Street Trio & Comic Panels' Mustard Yellow Oversized T-Shirt",
        slug: "looney-tunes-street-trio-comic-panels-yellow-tee",
        brand: "Zeynix",
        description: "Nostalgic 90s animation re-imagined for contemporary urban streetwear. Tailored from premium 240 GSM mustard yellow organic cotton with a boxy oversized fit. The front highlights Bugs Bunny rocking dark sunglasses and a red oversized tee accompanied by Marvin the Martian and Daffy Duck in high-top kicks. The back commands the streets with dynamic split comic-action panels featuring Daffy, hooded Bunny, and Taz along with official Looney Tunes typography.",
        images: [
            "/images/products/new/looney-tunes-street-trio-comic-panels-yellow-tee/front.png",
            "/images/products/new/looney-tunes-street-trio-comic-panels-yellow-tee/back.png",
            "/images/products/new/looney-tunes-street-trio-comic-panels-yellow-tee/whole.png"
        ],
        mainImage: "/images/products/new/looney-tunes-street-trio-comic-panels-yellow-tee/front.png",
        category: "casual",
        subcategory: "t-shirts",
        actualPrice: 1899,
        discountPrice: 549,
        rating: 5.0,
        totalRatings: 225,
        productFit: "OVERSIZED FIT",
        featured: true,
        sizes: sizes_template,
        createdAt: new Date('2026-10-01T07:33:00.000Z')
    },
    {
        title: "Disney 'Mickey Mouse Fabric Tear & Inverted Dive' Buttercream Oversized T-Shirt",
        slug: "disney-mickey-mouse-fabric-tear-buttercream-tee",
        brand: "Zeynix",
        description: "An ingenious dual-sided illusion celebrating pop culture royalty. Tailored in an oversized drop-shoulder cut from 240 GSM buttercream yellow combed cotton. The front depicts Mickey Mouse literally breaking through the torn fabric of your tee with a cheerful wink and classic Mickey typography. The back reveals the hilarious continuous backside view—Mickey's red shorts, yellow shoes, waving white gloves, and tail as he dives through the garment.",
        images: [
            "/images/products/new/disney-mickey-mouse-fabric-tear-buttercream-tee/front.png",
            "/images/products/new/disney-mickey-mouse-fabric-tear-buttercream-tee/back.png",
            "/images/products/new/disney-mickey-mouse-fabric-tear-buttercream-tee/whole.png"
        ],
        mainImage: "/images/products/new/disney-mickey-mouse-fabric-tear-buttercream-tee/front.png",
        category: "casual",
        subcategory: "t-shirts",
        actualPrice: 1899,
        discountPrice: 549,
        rating: 5.0,
        totalRatings: 260,
        productFit: "OVERSIZED FIT",
        featured: true,
        sizes: sizes_template,
        createdAt: new Date('2026-10-01T07:32:00.000Z')
    },
    {
        title: "Minions 'Banana! & Hanging Chain Pile' Oversized Black T-Shirt",
        slug: "minions-banana-hanging-chain-pile-black-tee",
        brand: "Zeynix",
        description: "Delightful mischief packed into luxury streetwear. Spun from ultra-dense 240 GSM organic black cotton jersey in an oversized boxy silhouette. The front features a Minion savoring his favorite fruit against energetic calligraphic 'BANANA!' text. The reverse commands attention with an inventive right-aligned vertical chain of Minions clinging to each other from the shoulder seam all the way down into a tumbling pile at the waist hem.",
        images: [
            "/images/products/new/minions-banana-hanging-chain-pile-black-tee/front.png",
            "/images/products/new/minions-banana-hanging-chain-pile-black-tee/back.png",
            "/images/products/new/minions-banana-hanging-chain-pile-black-tee/whole.png"
        ],
        mainImage: "/images/products/new/minions-banana-hanging-chain-pile-black-tee/front.png",
        category: "casual",
        subcategory: "t-shirts",
        actualPrice: 1899,
        discountPrice: 549,
        rating: 5.0,
        totalRatings: 215,
        productFit: "OVERSIZED FIT",
        featured: true,
        sizes: sizes_template,
        createdAt: new Date('2026-10-01T07:31:00.000Z')
    }
];

async function run() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('products');
    console.log('✅ Connected to MongoDB.');

    // 1. Insert or update in MongoDB
    for (const p of newProducts) {
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
            discount: Math.round(((p.actualPrice - p.discountPrice) / p.actualPrice) * 100),
            rating: p.rating,
            totalRatings: p.totalRatings,
            availableStock: p.sizes.reduce((acc, s) => acc + s.stock, 0),
            sizes: p.sizes,
            isActive: true,
            featured: true,
            status: "published",
            productFit: p.productFit,
            createdAt: p.createdAt,
            updatedAt: new Date()
        };

        const res = await collection.updateOne(
            { slug: p.slug },
            { $set: doc },
            { upsert: true }
        );
        console.log(`Saved "${p.slug}" (matched: ${res.matchedCount}, upserted: ${res.upsertedCount || 0})`);
    }

    // 2. Update catalog config JSON
    const configPath = path.join(__dirname, '../../src/data/new-catalog-config.json');
    if (fs.existsSync(configPath)) {
        let catalog = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const newSlugs = newProducts.map(p => p.slug);
        catalog = catalog.filter(p => !newSlugs.includes(p.slug));

        // Insert at index 4 (right after the first 4 products in Section 1)
        const insertIdx = 4;
        newProducts.forEach((p, idx) => {
            const cleanProd = {
                title: p.title,
                slug: p.slug,
                brand: p.brand,
                description: p.description,
                images: p.images,
                category: p.category,
                actualPrice: p.actualPrice,
                discountPrice: p.discountPrice,
                rating: p.rating,
                totalRatings: p.totalRatings,
                productFit: p.productFit,
                featured: p.featured,
                sizes: p.sizes
            };
            catalog.splice(insertIdx + idx, 0, cleanProd);
        });

        fs.writeFileSync(configPath, JSON.stringify(catalog, null, 2), 'utf8');
        console.log(`✅ Updated ${configPath} (total catalog items: ${catalog.length})`);
    }

    // 3. Verify top 12 in DB
    const topProds = await collection.find({ isActive: true, status: 'published' })
        .sort({ createdAt: -1 })
        .limit(14)
        .toArray();

    console.log('\nTop 14 products in DB by createdAt desc:');
    topProds.forEach((p, idx) => {
        const section = idx < 4 ? 'SECTION 1' : idx < 9 ? 'SECTION 2' : 'SECTION 3+';
        console.log(`  [#${idx + 1}] (${section}) ${p.slug} | Price: ₹${p.actualPrice} -> ₹${p.discountPrice} | Date: ${p.createdAt.toISOString()}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Database sync complete.');
}

run().catch(console.error);
