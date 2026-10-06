const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const uri = 'mongodb+srv://zeynixco:zeynix@zeynix.y10hl9o.mongodb.net/zeynix?appName=Zeynix';

const sizes_template = [
    { size: "XS", stock: 45, inStock: true },
    { size: "S", stock: 90, inStock: true },
    { size: "M", stock: 155, inStock: true },
    { size: "L", stock: 180, inStock: true },
    { size: "XL", stock: 120, inStock: true },
    { size: "XXL", stock: 65, inStock: true }
];

const halloweenProducts = [
    {
        title: "Halloween 'BOO! Graveyard Phantom' Oversized Buttercream T-Shirt",
        slug: "spooky-boo-graveyard-ghost-cream-tee",
        brand: "Zeynix",
        description: "Spooky Halloween spirit meets vintage street aesthetic. Crafted on 240 GSM organic heavy jersey cotton in vintage buttercream cream. Front features vibrant bubble lettering 'BOO!' hovering above a floating spectral ghost. The reverse unveils an intricate midnight cemetery scene complete with a haunted gothic manor, flying bats, rising phantom, and eerie 'RIP' tombstones.",
        images: [
            "/images/products/new/spooky-boo-graveyard-ghost-cream-tee/front.png",
            "/images/products/new/spooky-boo-graveyard-ghost-cream-tee/back.png",
            "/images/products/new/spooky-boo-graveyard-ghost-cream-tee/whole.png"
        ],
        mainImage: "/images/products/new/spooky-boo-graveyard-ghost-cream-tee/front.png",
        category: "unisex",
        subcategory: "t-shirts",
        price: 699,
        discountPrice: 699,
        actualPrice: 1349,
        originalPrice: 1349,
        discount: 48,
        rating: 5.0,
        totalRatings: 268,
        productFit: "OVERSIZED FIT",
        featured: true,
        isActive: true,
        status: "published",
        sizes: sizes_template
    },
    {
        title: "Kawaii 'Pink Bow Ghost & Leopard Pumpkins' Halloween Oversized White T-Shirt",
        slug: "kawaii-pink-bow-ghost-halloween-white-tee",
        brand: "Zeynix",
        description: "Pastel goth aesthetics meet spooky season charm. Cut from 240 GSM heavyweight combed cotton in optic white. Front showcases a darling sheet ghost with a pink ribbon bow and mini jack-o'-lantern candy pail. The back delivers an eye-catching pastel horror artwork with dripping 'HALLOWEEN' bubble typography, iced ghost latte, leopard print pumpkins, and sparkling cobwebs.",
        images: [
            "/images/products/new/kawaii-pink-bow-ghost-halloween-white-tee/front.png",
            "/images/products/new/kawaii-pink-bow-ghost-halloween-white-tee/back.png",
            "/images/products/new/kawaii-pink-bow-ghost-halloween-white-tee/whole.png"
        ],
        mainImage: "/images/products/new/kawaii-pink-bow-ghost-halloween-white-tee/front.png",
        category: "unisex",
        subcategory: "t-shirts",
        price: 699,
        discountPrice: 699,
        actualPrice: 1349,
        originalPrice: 1349,
        discount: 48,
        rating: 5.0,
        totalRatings: 312,
        productFit: "OVERSIZED FIT",
        featured: true,
        isActive: true,
        status: "published",
        sizes: sizes_template
    },
    {
        title: "Gothic 'Haunted Manor & Harvest Moon' Halloween Oversized Purple T-Shirt",
        slug: "mystic-haunted-mansion-harvest-moon-purple-tee",
        brand: "Zeynix",
        description: "Enchanting twilight gothic horror streetwear. Engineered on premium 240 GSM heavyweight combed cotton in rich mystic royal purple. Front displays a silhouette of a haunted Victorian manor with glowing yellow windows and flying bats. The back explodes with a majestic full-color illustration of a towering gothic castle bathed in the golden radiance of a giant Harvest Full Moon.",
        images: [
            "/images/products/new/mystic-haunted-mansion-harvest-moon-purple-tee/front.png",
            "/images/products/new/mystic-haunted-mansion-harvest-moon-purple-tee/back.png",
            "/images/products/new/mystic-haunted-mansion-harvest-moon-purple-tee/whole.png"
        ],
        mainImage: "/images/products/new/mystic-haunted-mansion-harvest-moon-purple-tee/front.png",
        category: "unisex",
        subcategory: "t-shirts",
        price: 699,
        discountPrice: 699,
        actualPrice: 1349,
        originalPrice: 1349,
        discount: 48,
        rating: 5.0,
        totalRatings: 284,
        productFit: "OVERSIZED FIT",
        featured: true,
        isActive: true,
        status: "published",
        sizes: sizes_template
    },
    {
        title: "Horror Legends 'Dream Play Scream Repeat' Oversized Black T-Shirt",
        slug: "slashers-dream-play-scream-repeat-black-tee",
        brand: "Zeynix",
        description: "The ultimate tribute to cinema's most iconic horror legends. Tailored in an oversized drop-shoulder silhouette on 240 GSM dense combed black cotton. The front features the cult 'H·A·L·L·O·W·E·E·N' cinematic panel lineup of Freddy, Jason, Michael Myers, Ghostface, Chucky, Pennywise, Jigsaw, and Pinhead. The reverse delivers a graphic punch with distressed comic panels: 'DREAM • PLAY • SCREAM • REPEAT'.",
        images: [
            "/images/products/new/slashers-dream-play-scream-repeat-black-tee/front.png",
            "/images/products/new/slashers-dream-play-scream-repeat-black-tee/back.png",
            "/images/products/new/slashers-dream-play-scream-repeat-black-tee/whole.png"
        ],
        mainImage: "/images/products/new/slashers-dream-play-scream-repeat-black-tee/front.png",
        category: "unisex",
        subcategory: "t-shirts",
        price: 699,
        discountPrice: 699,
        actualPrice: 1349,
        originalPrice: 1349,
        discount: 48,
        rating: 5.0,
        totalRatings: 349,
        productFit: "OVERSIZED FIT",
        featured: true,
        isActive: true,
        status: "published",
        sizes: sizes_template
    }
];

async function run() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');

        const col = mongoose.connection.collection('products');

        for (const prod of halloweenProducts) {
            const now = new Date();
            const res = await col.updateOne(
                { slug: prod.slug },
                {
                    $set: {
                        ...prod,
                        name: prod.title,
                        updatedAt: now
                    },
                    $setOnInsert: {
                        createdAt: now
                    }
                },
                { upsert: true }
            );
            console.log(`[DB] Upserted ${prod.slug}: matched=${res.matchedCount}, upsertedId=${res.upsertedId || 'existing'}`);
        }

        // Also normalize existing 2 halloween products so front.png is mainImage and first in images
        for (const slug of ['halloween-rip-still-dead-tee', 'spookie-peeking-cat-skeletons-tee']) {
            const p = await col.findOne({ slug });
            if (p && p.images) {
                const f = p.images.find(i => i.includes('front')) || p.images[0];
                const b = p.images.find(i => i.includes('back')) || p.images[1];
                const s = p.images.find(i => i.includes('showcase') || i.includes('whole')) || p.images[2];
                await col.updateOne({ slug }, { $set: { mainImage: f, images: [f, b, s].filter(Boolean) } });
                console.log(`[DB] Normalized ${slug} to front first`);
            }
        }

        const configPath = path.join(__dirname, '../../src/data/new-catalog-config.json');
        if (fs.existsSync(configPath)) {
            const catalog = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            for (const prod of halloweenProducts) {
                const idx = catalog.findIndex(p => p.slug === prod.slug);
                if (idx >= 0) {
                    catalog[idx] = { ...catalog[idx], ...prod };
                } else {
                    catalog.push(prod);
                }
            }
            fs.writeFileSync(configPath, JSON.stringify(catalog, null, 2), 'utf8');
            console.log('✅ Updated src/data/new-catalog-config.json');
        }

        const totalInDb = await col.countDocuments({ isActive: true });
        console.log(`✅ Total active products now in DB: ${totalInDb}`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Error inserting products:', err);
        process.exit(1);
    }
}

run();
