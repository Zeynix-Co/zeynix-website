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

// 18 products exactly from the Canva screenshot (slides 1 to 18):
const canva_1_to_18 = [
    "her-new-guy-viper-acid-wash-tee",                       // 1
    "sunflower-collection-tee",                              // 2
    "snakes-dont-hiss-viper-tee",                            // 3
    "vans-heritage-graphic-tee",                             // 4
    "insanity-demon-crimson-tee",                            // 5
    "marlboro-doberman-die-anyway-tee",                      // 6
    "gothic-cathedral-chained-wanderer-tee",                 // 7
    "yin-yang-koi-dead-fish-tee",                            // 8
    "veni-vidi-vici-gothic-monarch-tee",                     // 9
    "unholy-rage-cemetery-tee",                              // 10
    "spiderman-miles-morales-webslinger-tee",                // 11
    "ugach-katkat-parody-tee",                               // 12
    "make-money-not-hoes-tee",                               // 13
    "confidence-looks-cute-cherries-white-tee",              // 14
    "cutie-patola-lotus-tee",                                // 15
    "think-outside-the-box-tictactoe-navy-tee",              // 16
    "lightning-mcqueen-piston-cup-tee",                      // 17
    "mera-yaar-khuda-hai-tee"                                // 18
];

// Visible in bottom row (19 to 24):
const canva_19_to_24 = [
    "looney-tunes-street-trio-comic-panels-yellow-tee",      // 19
    "only-live-once-skeleton-ribcage-tee",                   // 20
    "cosmic-alien-mountain-cyber-tee",                       // 21
    "iron-man-tony-stark-legacy-arc-reactor-tee",            // 22
    "spookie-peeking-cat-skeletons-tee",                     // 23
    "welcome-to-my-mind-dark-sketch-black-tee"               // 24
];

const spiderman_product = {
    title: "Marvel Spider-Man 'Miles Morales Web-Slinger' Oversized Off-White T-Shirt",
    slug: "spiderman-miles-morales-webslinger-tee",
    brand: "Zeynix",
    description: "Multiverse-inspired Marvel luxury streetwear constructed on 240 GSM heavyweight off-white cotton. The front chest features a dynamic minimalist line-art of Miles Morales slinging across a diagonal web thread. The back erupts with the iconic comic jagged 'SPIDER-MAN' red-shadowed title logo over a massive leaping silhouette of the wall-crawler.",
    images: [
        "/images/products/new/spiderman-miles-morales-webslinger-tee/back.png",
        "/images/products/new/spiderman-miles-morales-webslinger-tee/front.png",
        "/images/products/new/spiderman-miles-morales-webslinger-tee/showcase.png"
    ],
    mainImage: "/images/products/new/spiderman-miles-morales-webslinger-tee/back.png",
    category: "unisexual",
    subcategory: "t-shirts",
    actualPrice: 1899,
    discountPrice: 699,
    price: 699,
    originalPrice: 1899,
    discount: 63,
    rating: 5,
    totalRatings: 280,
    productFit: "OVERSIZED FIT",
    featured: true,
    sizes: [
        { size: "XS", stock: 45, inStock: true },
        { size: "S", stock: 90, inStock: true },
        { size: "M", stock: 155, inStock: true },
        { size: "L", stock: 180, inStock: true },
        { size: "XL", stock: 120, inStock: true },
        { size: "XXL", stock: 65, inStock: true }
    ]
};

async function main() {
    const configPath = path.join(__dirname, '../../src/data/new-catalog-config.json');
    let catalog = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Map of existing products
    const map = new Map();
    for (const p of catalog) {
        map.set(p.slug, p);
    }
    // Add spiderman if missing
    if (!map.has(spiderman_product.slug)) {
        map.set(spiderman_product.slug, spiderman_product);
    }

    const prioritySlugs = [...canva_1_to_18, ...canva_19_to_24];
    const orderedSlugs = [];

    // Add priority Canva order
    for (const slug of prioritySlugs) {
        if (map.has(slug) && !orderedSlugs.includes(slug)) {
            orderedSlugs.push(slug);
        }
    }

    // Add remaining catalog products
    for (const [slug, p] of map.entries()) {
        if (!orderedSlugs.includes(slug)) {
            orderedSlugs.push(slug);
        }
    }

    console.log(`Total ordered slugs: ${orderedSlugs.length}`);

    // Build new catalog list
    const newCatalog = orderedSlugs.map(slug => map.get(slug));
    fs.writeFileSync(configPath, JSON.stringify(newCatalog, null, 2), 'utf8');
    console.log(`✅ Saved ${configPath}`);

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB.');

    const collection = mongoose.connection.db.collection('products');

    // Ensure spiderman is in DB
    const spidermanExists = await collection.findOne({ slug: spiderman_product.slug });
    if (!spidermanExists) {
        await collection.insertOne({
            ...spiderman_product,
            name: spiderman_product.title,
            isActive: true,
            status: 'published',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log('Restored Spiderman in DB');
    }

    // Set timestamps descending from baseTime so sort({ createdAt: -1 }) strictly preserves this order
    const baseTime = new Date('2026-10-04T22:00:00.000Z').getTime();
    for (let i = 0; i < orderedSlugs.length; i++) {
        const slug = orderedSlugs[i];
        const productTime = new Date(baseTime - (i * 60000));
        await collection.updateOne(
            { slug },
            {
                $set: {
                    createdAt: productTime,
                    isActive: true,
                    status: 'published'
                }
            }
        );
    }
    console.log('✅ Timestamps synchronized in MongoDB.');

    // Query and verify top 18
    const dbTop18 = await collection
        .find({ isActive: true, status: 'published' })
        .sort({ createdAt: -1 })
        .limit(24)
        .toArray();

    console.log('\n--- VERIFIED CANVA 1 TO 18 (and 19 to 24) ---');
    for (let i = 0; i < dbTop18.length; i++) {
        const p = dbTop18[i];
        const marker = i < 18 ? 'CANVA SLIDE' : 'DETECTED ROW 4';
        console.log(`${(i+1).toString().padStart(2)}: [${marker} ${(i+1)}] ${p.title} (${p.slug})`);
    }

    await mongoose.disconnect();
    process.exit(0);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
