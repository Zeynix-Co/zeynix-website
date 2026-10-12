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
    // Position 58
    {
        position: 58,
        title: "Kawaii 'BAOO! Bear & Peekaboo Ghost' Oversized Pink T-Shirt",
        slug: "kawaii-baoo-bear-ghost-pink-tee",
        brand: "Zeynix",
        description: "Playful pastel streetwear meets adorable spooky season charm. Crafted from 240 GSM organic heavyweight combed cotton in sweet pastel candy pink. The front chest features a darling chibi brown bear in dark sunglasses striking a pose alongside a shy peekaboo sheet ghost with a pink ribbon bow. The reverse showcases glowing neon-styled bubble typography 'BAOO!' with an ethereal purple drop-shadow glow.",
        images: [
            "/images/products/new/kawaii-baoo-bear-ghost-pink-tee/front.png",
            "/images/products/new/kawaii-baoo-bear-ghost-pink-tee/back.png",
            "/images/products/new/kawaii-baoo-bear-ghost-pink-tee/whole.png"
        ],
        mainImage: "/images/products/new/kawaii-baoo-bear-ghost-pink-tee/front.png",
        category: "unisex",
        subcategory: "t-shirts",
        actualPrice: 1349,
        originalPrice: 1349,
        discountPrice: 699,
        price: 699,
        discount: 48,
        rating: 5.0,
        totalRatings: 242,
        productFit: "OVERSIZED FIT",
        featured: false,
        isActive: true,
        status: "published",
        sizes: sizes_template,
        createdAt: new Date('2026-10-04T21:07:00.000Z')
    },
    // Position 59
    {
        position: 59,
        title: "F1 Racing 'Lights Out And Away - Legacy Vinyl' Oversized Buttercream T-Shirt",
        slug: "f1-racing-lights-out-legacy-vinyl-tee",
        brand: "Zeynix",
        description: "The pulse-pounding roar of Grand Prix motorsport reimagined as analog vinyl high art. Tailored on premium 240 GSM dense combed cotton in vintage buttercream sand. The front keeps it sleek and low-key with distressed italic corner typography 'LIGHTS OUT AND AWAY'. The reverse explodes with a monumental turntable vinyl record where Formula 1 racecars scream across the grooved track under the bold vertical stamp 'LEGACY' and 'SOUND OF SPEED'.",
        images: [
            "/images/products/new/f1-racing-lights-out-legacy-vinyl-tee/front.png",
            "/images/products/new/f1-racing-lights-out-legacy-vinyl-tee/back.png",
            "/images/products/new/f1-racing-lights-out-legacy-vinyl-tee/whole.png"
        ],
        mainImage: "/images/products/new/f1-racing-lights-out-legacy-vinyl-tee/front.png",
        category: "unisex",
        subcategory: "t-shirts",
        actualPrice: 1349,
        originalPrice: 1349,
        discountPrice: 699,
        price: 699,
        discount: 48,
        rating: 5.0,
        totalRatings: 318,
        productFit: "OVERSIZED FIT",
        featured: false,
        isActive: true,
        status: "published",
        sizes: sizes_template,
        createdAt: new Date('2026-10-04T21:06:00.000Z')
    },
    // Position 60
    {
        position: 60,
        title: "Marvel 'Spider-Gwen Into The Spider-Verse' Oversized Off-White T-Shirt",
        slug: "marvel-spider-gwen-multiverse-white-tee",
        brand: "Zeynix",
        description: "Earth-65's sensational Ghost-Spider leaps into high-fashion streetwear. Engineered from 240 GSM organic heavyweight combed cotton in crisp bone off-white. Front features stacked comic block typography 'SPIDERGWEN' layered behind an arresting close-up of Gwen Stacy in her hooded white and magenta webbed suit with piercing spectral eyes. Reverse remains clean and minimal for an effortless luxury drop.",
        images: [
            "/images/products/new/marvel-spider-gwen-multiverse-white-tee/front.png",
            "/images/products/new/marvel-spider-gwen-multiverse-white-tee/back.png",
            "/images/products/new/marvel-spider-gwen-multiverse-white-tee/whole.png"
        ],
        mainImage: "/images/products/new/marvel-spider-gwen-multiverse-white-tee/front.png",
        category: "unisex",
        subcategory: "t-shirts",
        actualPrice: 1349,
        originalPrice: 1349,
        discountPrice: 699,
        price: 699,
        discount: 48,
        rating: 5.0,
        totalRatings: 375,
        productFit: "OVERSIZED FIT",
        featured: false,
        isActive: true,
        status: "published",
        sizes: sizes_template,
        createdAt: new Date('2026-10-04T21:05:00.000Z')
    },
    // Position 61
    {
        position: 61,
        title: "Japanese Aesthetic 'Primitive Music - Koi Fish Vinyl' Oversized Beige T-Shirt",
        slug: "primitive-music-koi-fish-vinyl-tee",
        brand: "Zeynix",
        description: "Harmonious Japanese Ukiyo-e aesthetic blended with vintage vinyl record grooves. Constructed on 240 GSM organic heavy combed cotton in natural beige stone. The front features a serene turquoise turntable record with a blazing vermilion center label and traditional red-and-white Nishikigoi koi carp swimming in circular harmony beside the tonearm, inscribed 'PRIMITIVE MUSIC OF THE WORLD'. The back presents a breathtaking close-up macro panel of the swimming koi swimming over the water-grooved vinyl track.",
        images: [
            "/images/products/new/primitive-music-koi-fish-vinyl-tee/front.png",
            "/images/products/new/primitive-music-koi-fish-vinyl-tee/back.png",
            "/images/products/new/primitive-music-koi-fish-vinyl-tee/whole.png"
        ],
        mainImage: "/images/products/new/primitive-music-koi-fish-vinyl-tee/front.png",
        category: "unisex",
        subcategory: "t-shirts",
        actualPrice: 1349,
        originalPrice: 1349,
        discountPrice: 699,
        price: 699,
        discount: 48,
        rating: 5.0,
        totalRatings: 294,
        productFit: "OVERSIZED FIT",
        featured: false,
        isActive: true,
        status: "published",
        sizes: sizes_template,
        createdAt: new Date('2026-10-04T21:04:00.000Z')
    },
    // Position 62 (Halloween Collection, NOT in home section)
    {
        position: 62,
        title: "Halloween 'I Scream & Spooky Season Ghost' Oversized Black T-Shirt",
        slug: "halloween-i-scream-spooky-season-black-tee",
        brand: "Zeynix",
        description: "Limited Halloween Edition streetwear celebrating spooky season delirium. Cut from heavy 240 GSM midnight black combed cotton with an oversized drop-shoulder drape. The front showcases psychedelic wavy typography 'SPOOKY SEASON' with a cozy sheet ghost donning an orange knit beanie, sipping an iced pumpkin spice latte next to a grinning Jack-O'-Lantern. The back steals the spotlight with horror cult typography 'I SCREAM' above a dripping waffle cone topped with a melting Ghostface phantom ice cream scoop and strawberry blood syrup.",
        images: [
            "/images/products/new/halloween-i-scream-spooky-season-black-tee/front.png",
            "/images/products/new/halloween-i-scream-spooky-season-black-tee/back.png",
            "/images/products/new/halloween-i-scream-spooky-season-black-tee/whole.png"
        ],
        mainImage: "/images/products/new/halloween-i-scream-spooky-season-black-tee/front.png",
        category: "unisex",
        subcategory: "t-shirts",
        actualPrice: 1349,
        originalPrice: 1349,
        discountPrice: 699,
        price: 699,
        discount: 48,
        rating: 5.0,
        totalRatings: 320,
        productFit: "OVERSIZED FIT",
        featured: false,
        isActive: true,
        status: "published",
        sizes: sizes_template,
        createdAt: new Date('2026-10-04T21:03:00.000Z')
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

        // Append to the catalog at positions 58, 59, 60, 61, 62
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
    console.log('Products from position 55 to 62:');
    allProds.slice(54, 62).forEach((p, idx) => {
        console.log(`Position ${55 + idx}: [${p.createdAt.toISOString()}] ${p.title} (${p.slug})`);
    });

    await mongoose.disconnect();
    console.log('\nAll done!');
}

run().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
