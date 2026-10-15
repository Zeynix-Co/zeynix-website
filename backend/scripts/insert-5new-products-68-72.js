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
    // Position 68
    {
        position: 68,
        title: "Botanical Floral 'In A World Full Of Roses Be A Sunflower' Oversized Peach T-Shirt",
        slug: "world-full-of-roses-be-a-sunflower-peach-tee",
        brand: "Zeynix",
        description: "Sun-drenched botanical positivity meets modern expressive streetwear. Cut in an oversized silhouette from 240 GSM dense combed cotton in a warm peach tone. The front features an artistic split sunflower illustration paired with inspiring cursive typography 'IN a WORLD full of ROSES be a SUNFLOWER'. The reverse commands attention with a vivid botanical sunflower set against golden abstract brushstrokes and dynamic watercolor paint splatter.",
        images: [
            "/images/products/new/world-full-of-roses-be-a-sunflower-peach-tee/front.png",
            "/images/products/new/world-full-of-roses-be-a-sunflower-peach-tee/back.png",
            "/images/products/new/world-full-of-roses-be-a-sunflower-peach-tee/whole.png"
        ],
        mainImage: "/images/products/new/world-full-of-roses-be-a-sunflower-peach-tee/front.png",
        category: "unisex",
        subcategory: "t-shirts",
        actualPrice: 1349,
        originalPrice: 1349,
        discountPrice: 699,
        price: 699,
        discount: 48,
        rating: 5.0,
        totalRatings: 310,
        productFit: "OVERSIZED FIT",
        featured: false,
        isActive: true,
        status: "published",
        sizes: sizes_template,
        createdAt: new Date('2026-10-04T20:57:00.000Z')
    },
    // Position 69
    {
        position: 69,
        title: "Aesthetic Landscape 'Spring Mood Window View & Wildflowers' Oversized Royal Blue T-Shirt",
        slug: "spring-mood-window-wildflowers-royal-blue-tee",
        brand: "Zeynix",
        description: "Vibrant springtime wanderlust meets premium drop-shoulder streetwear. Crafted from 240 GSM heavy combed cotton in rich royal blue. The chest features dual-tone typography blending electric green cursive 'Spring' with retro bubble pink 'MOOD'. The back opens a picturesque window pane into idyllic mountain peaks, drifting seagulls, azure skies, and blooming potted daisies.",
        images: [
            "/images/products/new/spring-mood-window-wildflowers-royal-blue-tee/front.png",
            "/images/products/new/spring-mood-window-wildflowers-royal-blue-tee/back.png",
            "/images/products/new/spring-mood-window-wildflowers-royal-blue-tee/whole.png"
        ],
        mainImage: "/images/products/new/spring-mood-window-wildflowers-royal-blue-tee/front.png",
        category: "unisex",
        subcategory: "t-shirts",
        actualPrice: 1349,
        originalPrice: 1349,
        discountPrice: 699,
        price: 699,
        discount: 48,
        rating: 5.0,
        totalRatings: 275,
        productFit: "OVERSIZED FIT",
        featured: false,
        isActive: true,
        status: "published",
        sizes: sizes_template,
        createdAt: new Date('2026-10-04T20:56:00.000Z')
    },
    // Position 70
    {
        position: 70,
        title: "Studio Ghibli 'Spirited Away Chihiro & No-Face Silhouette' Oversized Teal T-Shirt",
        slug: "spirited-away-chihiro-no-face-teal-tee",
        brand: "Zeynix",
        description: "Cinematic anime nostalgia meets moody aesthetic streetwear. Tailored from 240 GSM heavyweight combed cotton in deep teal blue. The front displays the iconic poignant quote: “Once you’ve met someone, you nver really forget them.” -Spirited Away(2001). The reverse is dominated by Chihiro gazing skyward as the mysterious shadow spirit No-Face towers gently behind her, accented by distressed vintage typography.",
        images: [
            "/images/products/new/spirited-away-chihiro-no-face-teal-tee/front.png",
            "/images/products/new/spirited-away-chihiro-no-face-teal-tee/back.png",
            "/images/products/new/spirited-away-chihiro-no-face-teal-tee/whole.png"
        ],
        mainImage: "/images/products/new/spirited-away-chihiro-no-face-teal-tee/front.png",
        category: "unisex",
        subcategory: "t-shirts",
        actualPrice: 1349,
        originalPrice: 1349,
        discountPrice: 699,
        price: 699,
        discount: 48,
        rating: 5.0,
        totalRatings: 345,
        productFit: "OVERSIZED FIT",
        featured: false,
        isActive: true,
        status: "published",
        sizes: sizes_template,
        createdAt: new Date('2026-10-04T20:55:00.000Z')
    },
    // Position 71
    {
        position: 71,
        title: "Studio Ghibli 'Kiki's Delivery Service Broom Flight & Meow' Oversized Black T-Shirt",
        slug: "kikis-delivery-service-broom-flight-black-tee",
        brand: "Zeynix",
        description: "Whimsical witchy anime nostalgia meets midnight streetwear. Engineered on 240 GSM organic heavy combed cotton in onyx black. The front pops with playful honey-yellow bubble letters spelling 'MEOW' with inquisitive cat eyes. The back features Kiki soaring across a glowing full moon on her broom with loyal feline companion Jiji perched behind her.",
        images: [
            "/images/products/new/kikis-delivery-service-broom-flight-black-tee/front.png",
            "/images/products/new/kikis-delivery-service-broom-flight-black-tee/back.png",
            "/images/products/new/kikis-delivery-service-broom-flight-black-tee/whole.png"
        ],
        mainImage: "/images/products/new/kikis-delivery-service-broom-flight-black-tee/front.png",
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
        createdAt: new Date('2026-10-04T20:54:00.000Z')
    },
    // Position 72
    {
        position: 72,
        title: "Studio Ghibli 'Spirited Away Paper Birds & Courage Quote' Oversized Buttercream T-Shirt",
        slug: "spirited-away-paper-birds-courage-quote-cream-tee",
        brand: "Zeynix",
        description: "Profound animation storytelling captured in artisanal streetwear. Tailored in a relaxed oversized fit using 240 GSM organic combed cotton in soft buttercream. The front bears the soul-stirring quote: “I hope one day you have the courage to run away from everything that makes you miserable” -Spirited Away. The back portrays Chihiro enveloped in a breathtaking vortex of fluttering paper birds (shikigami) in stunning illustrative detail.",
        images: [
            "/images/products/new/spirited-away-paper-birds-courage-quote-cream-tee/front.png",
            "/images/products/new/spirited-away-paper-birds-courage-quote-cream-tee/back.png",
            "/images/products/new/spirited-away-paper-birds-courage-quote-cream-tee/whole.png"
        ],
        mainImage: "/images/products/new/spirited-away-paper-birds-courage-quote-cream-tee/front.png",
        category: "unisex",
        subcategory: "t-shirts",
        actualPrice: 1349,
        originalPrice: 1349,
        discountPrice: 699,
        price: 699,
        discount: 48,
        rating: 5.0,
        totalRatings: 290,
        productFit: "OVERSIZED FIT",
        featured: false,
        isActive: true,
        status: "published",
        sizes: sizes_template,
        createdAt: new Date('2026-10-04T20:53:00.000Z')
    }
];

async function run() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
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

        // Append to the catalog at positions 68, 69, 70, 71, 72
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

    console.log(`\n--- VERIFIED FULL ACTIVE CATALOG IN DB (Total: ${allProds.length}) ---`);
    console.log('Products from position 65 to 72:');
    allProds.slice(64, 72).forEach((p, idx) => {
        console.log(`Position ${65 + idx}: [${p.createdAt.toISOString()}] ${p.title} (${p.slug})`);
    });

    await mongoose.disconnect();
    console.log('\nAll done!');
}

run().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
