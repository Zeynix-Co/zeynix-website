const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch(e) {}
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
if (!process.env.MONGODB_URI) {
    require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });
}

const Product = require('../models/Product');

const SLUG_MAP = {
    "Vans 'The Heritage Mask' Graphic Oversized Red T-Shirt": "vans-heritage-graphic-tee",
    "Gothic 'Trust No One' Calligraphy Oversized Purple T-Shirt": "trust-no-one-gothic-tee",
    "Marathi Pop Art 'Ugach KatKat Karu Nakos' Oversized Red T-Shirt": "ugach-katkat-parody-tee",
    "'Confidence Looks Cute On Me' Cherry Oversized White T-Shirt": "confidence-cherry-graphic-tee",
    "Pikachu & Starters Stamp Graphic T-Shirt": "pokemon-stamp-tee",
    "Zeynix & Co. Botanical Sunflower T-Shirt": "sunflower-collection-tee",
    "Renaissance 'Balancing Sins & Virtue' Graphic T-Shirt": "sins-and-virtue-tee",
    "Pixel Art 'Not Today, Satan' Minimalist T-Shirt": "not-today-satan-tee",
    "The Underdog Foundation Streetwear Performance T-Shirt": "underdog-foundation-tee",
    "Zeynix 'Make Money Not Hoes' Oversized Streetwear T-Shirt": "make-money-not-hoes-tee",
    "Venomous Viper 'Snakes Don't Hiss' Calligraphy Oversized Black T-Shirt": "snakes-dont-hiss-viper-tee",
    "'Snakes Don't Hiss' Crimson Kiss & Graffiti Heart Oversized T-Shirt": "snakes-kiss-crimson-heart-tee",
    "Squirtle & Great Wave of Kanagawa Cyan Oversized T-Shirt": "squirtle-kanto-wave-tee",
    "Umair 'Come Through' Spotify Tracklist Oversized Black T-Shirt": "umair-come-through-music-tee",
    "Talha Anjum x Umair 'Downers At Dusk' Oversized Black T-Shirt": "downers-at-dusk-talha-anjum-tee",
    "Young Stunners 'Gumaan' Slate Blue Oversized T-Shirt": "young-stunners-gumaan-tee",
    "Talha Anjum 'Kaun Talha?' Acid Wash Oversized Streetwear T-Shirt": "kaun-talha-acid-wash-tee",
    "Jevin Gill x Talha Anjum 'Cigarettes After Regrets' Oversized Black T-Shirt": "cigarettes-after-regrets-tee",
    "Gothic Dark Monarch 'Veni Vidi Vici' Oversized White T-Shirt": "veni-vidi-vici-gothic-monarch-tee",
    "Gothic 'Unholy Rage' Cemetery Grave Oversized Black T-Shirt": "unholy-rage-cemetery-tee",
    "'You're Going To Die Anyway' Doberman Red & White Oversized T-Shirt": "marlboro-doberman-die-anyway-tee",
    "'Mera Yaar Khuda Hai' The Art Of Not Explaining Oversized Black T-Shirt": "mera-yaar-khuda-hai-tee",
    "Desi Pop 'Cutie Patola' Lotus Buttercream Yellow Oversized T-Shirt": "cutie-patola-lotus-tee",
    "Liquid Chrome 'Kid Buu' Y2K Metallic Oversized Black T-Shirt": "liquid-chrome-kid-buu-tee",
    "Gothic Cathedral 'Chained Wanderer' Oversized Black T-Shirt": "gothic-cathedral-chained-wanderer-tee",
    "Lightning McQueen 'Piston Cup 95' Racer Oversized Black T-Shirt": "lightning-mcqueen-piston-cup-tee",
    "Porsche 911 'Sally Carrera' Cyan Drift Oversized Black T-Shirt": "porsche-911-sally-carrera-tee",
    "GTA VI 'Vice City Outlaws' Neon Graphic Oversized Black T-Shirt": "gta-vi-vice-city-tee",
    "Transformers 'Optimus Prime' Cybertron Oversized Black T-Shirt": "transformers-optimus-prime-tee",
    "Risk & Wealth 'Money Money' Oversized Black T-Shirt": "risk-rich-money-typography-tee",
    "Japanese Dragon & Samurai 'Red Sun Anime' Oversized Black T-Shirt": "japanese-dragon-samurai-red-sun-tee",
    "Disney Pixar 'Rayo McQueen 95' Retro Racer Oversized White T-Shirt": "rayo-mcqueen-retro-racer-white-tee",
    "'Trust No One - It Is Me' Geometric Red Line Oversized Black T-Shirt": "trust-no-one-it-is-me-tee",
    "Dragon Ball Super 'Son Goku SSB' Power Quote Oversized Black T-Shirt": "goku-ssb-power-quote-tee",
    "'Faaaahhh! / Confidence' Motion Typo Oversized Cream T-Shirt": "faaaahhh-confidence-motion-typo-tee",
    "Desi Street Attitude 'Humse Jalte Hain' Oversized Black T-Shirt": "humse-jalte-hain-attitude-tee",
    "Marvel Spider-Man 'Miles Morales Web-Slinger' Oversized Off-White T-Shirt": "spiderman-miles-morales-webslinger-tee",
    "Marvel Spider-Man 'Peter Parker Mask Typography' Oversized Black T-Shirt": "spiderman-peter-parker-typography-tee",
    "Romantic Streetwear 'I Love My Crazy Girlfriend' Oversized White T-Shirt": "i-love-my-crazy-girlfriend-tee",
    "Yin-Yang Koi 'Only Dead Fish Go With The Flow' Oversized White T-Shirt": "yin-yang-koi-dead-fish-tee",
    "Gothic Demon 'INSANITY' Crimson Oversized T-Shirt": "insanity-demon-crimson-tee",
    "Acid Wash 'Her New Guy' Coiled Viper Oversized Black T-Shirt": "her-new-guy-viper-acid-wash-tee",
    "Halloween 'Still Dead - Thanks For Checking' Oversized Black T-Shirt": "halloween-rip-still-dead-tee",
    "Kawaii Gothic 'Spookie' Peeking Cat & Skeletons Buttercream Oversized T-Shirt": "spookie-peeking-cat-skeletons-tee",
    "Gothic Anatomy 'Only Live Once' Ribcage & Spine Oversized Black T-Shirt": "only-live-once-skeleton-ribcage-tee",
    "Cyber Techwear 'Cosmic Horizon Alien' Oversized Black T-Shirt": "cosmic-alien-mountain-cyber-tee",
    "Aesthetic Gaze 'Yes Is Clear' Crimson Heart Oversized Black T-Shirt": "aesthetic-gaze-yes-is-clear-heart-tee",
    "Marvel Avengers 'Tony Stark Arc Reactor Legacy' Oversized Black T-Shirt": "iron-man-tony-stark-legacy-arc-reactor-tee",
    "Looney Tunes 'Street Trio & Comic Panels' Mustard Yellow Oversized T-Shirt": "looney-tunes-street-trio-comic-panels-yellow-tee",
    "Disney 'Mickey Mouse Fabric Tear & Inverted Dive' Buttercream Oversized T-Shirt": "disney-mickey-mouse-fabric-tear-buttercream-tee",
    "Minions 'Banana! & Hanging Chain Pile' Oversized Black T-Shirt": "minions-banana-hanging-chain-pile-black-tee"
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
