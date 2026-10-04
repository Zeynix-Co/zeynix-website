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

// Define the 5 new products
const newProducts = [
    {
        title: "Navy Blue 'Think Outside The Box' Tic-Tac-Toe Oversized T-Shirt",
        slug: "think-outside-the-box-tictactoe-navy-tee",
        brand: "Zeynix",
        description: "Break the mold and defy ordinary boundaries in this deep navy blue oversized drop crafted from dense 240 GSM organic combed cotton jersey. The front chest features a retro pixel-styled 'Start' interface badge. The back commands attention with bold white handwritten typography reading 'THINK OUTSIDE THE BOX' paired with an iconic Tic-Tac-Toe grid playfully breaking outside the lines.",
        images: [
            "/images/products/new/think-outside-the-box-tictactoe-navy-tee/back.png",
            "/images/products/new/think-outside-the-box-tictactoe-navy-tee/front.png",
            "/images/products/new/think-outside-the-box-tictactoe-navy-tee/showcase.png"
        ],
        mainImage: "/images/products/new/think-outside-the-box-tictactoe-navy-tee/back.png",
        category: "unisexual",
        subcategory: "t-shirts",
        actualPrice: 1799,
        discountPrice: 699,
        price: 699,
        originalPrice: 1799,
        discount: 61,
        rating: 5,
        totalRatings: 210,
        productFit: "OVERSIZED FIT",
        featured: true,
        sizes: sizes_template
    },
    {
        title: "Tom and Jerry x Cartoon Network Ice Blue Oversized T-Shirt",
        slug: "tom-and-jerry-cartoon-network-cyan-tee",
        brand: "Zeynix",
        description: "Pure 90s animation nostalgia reimagined for modern streetwear in a fresh pastel ice blue shade on 240 GSM combed cotton. The front features Tom peeking out slyly from the left shoulder while Jerry sneaks up from the bottom hem. The reverse showcases the iconic high-contrast 'CARTOON NETWORK' typography block logo.",
        images: [
            "/images/products/new/tom-and-jerry-cartoon-network-cyan-tee/back.png",
            "/images/products/new/tom-and-jerry-cartoon-network-cyan-tee/front.png",
            "/images/products/new/tom-and-jerry-cartoon-network-cyan-tee/showcase.png"
        ],
        mainImage: "/images/products/new/tom-and-jerry-cartoon-network-cyan-tee/back.png",
        category: "unisexual",
        subcategory: "t-shirts",
        actualPrice: 1799,
        discountPrice: 699,
        price: 699,
        originalPrice: 1799,
        discount: 61,
        rating: 5,
        totalRatings: 275,
        productFit: "OVERSIZED FIT",
        featured: true,
        sizes: sizes_template
    },
    {
        title: "Bollywood SRK 'Om Shanti Om - Picture Abhi Baaki Hai' Oversized Black T-Shirt",
        slug: "srk-om-shanti-om-dialogue-black-tee",
        brand: "Zeynix",
        description: "Celebrate King Khan's timeless Bollywood legacy in this pitch black heavyweight streetwear drop. The front chest features a comic-styled vintage pop-art portrait of Shah Rukh Khan shouting the unforgettable catchphrase 'PICTURE ABHI BAAKI HAI MERE DOST!'. The reverse stuns with the iconic midnight-blue moonlit terrace balcony silhouette and the immortal romantic dialogue 'Agar kisi cheez ko Dil se Chaho toh puri Kaynat usey Tumse Milane ki Koshish Me lag jati hai ...'.",
        images: [
            "/images/products/new/srk-om-shanti-om-dialogue-black-tee/back.png",
            "/images/products/new/srk-om-shanti-om-dialogue-black-tee/front.png",
            "/images/products/new/srk-om-shanti-om-dialogue-black-tee/showcase.png"
        ],
        mainImage: "/images/products/new/srk-om-shanti-om-dialogue-black-tee/back.png",
        category: "unisexual",
        subcategory: "t-shirts",
        actualPrice: 1799,
        discountPrice: 699,
        price: 699,
        originalPrice: 1799,
        discount: 61,
        rating: 5,
        totalRatings: 340,
        productFit: "OVERSIZED FIT",
        featured: true,
        sizes: sizes_template
    },
    {
        title: "Pink Cherries & Bow 'Confidence Looks Cute On Me' Oversized White T-Shirt",
        slug: "confidence-looks-cute-cherries-white-tee",
        brand: "Zeynix",
        description: "Playful Y2K aesthetic meets empowering streetwear on clean 240 GSM organic white cotton. The front chest features a chic periodic element patch reading '69 Hg hot girl'. The reverse blooms with lustrous illustrated watercolor pink cherries tied with a satin ribbon bow and uplifting typography reading 'I\\'M NOT PERFECT, BUT CONFIDENCE LOOKS CUTE ON ME EST. 1989'.",
        images: [
            "/images/products/new/confidence-looks-cute-cherries-white-tee/back.png",
            "/images/products/new/confidence-looks-cute-cherries-white-tee/front.png",
            "/images/products/new/confidence-looks-cute-cherries-white-tee/showcase.png"
        ],
        mainImage: "/images/products/new/confidence-looks-cute-cherries-white-tee/back.png",
        category: "unisexual",
        subcategory: "t-shirts",
        actualPrice: 1799,
        discountPrice: 699,
        price: 699,
        originalPrice: 1799,
        discount: 61,
        rating: 5,
        totalRatings: 195,
        productFit: "OVERSIZED FIT",
        featured: true,
        sizes: sizes_template
    },
    {
        title: "Dark Grunge 'Welcome To My Mind' Psychological Sketch Oversized Black T-Shirt",
        slug: "welcome-to-my-mind-dark-sketch-black-tee",
        brand: "Zeynix",
        description: "Raw psychological depth and dark grunge aesthetics crafted on deep black 240 GSM drop-shoulder cotton. The front features a distressed scratch-art question mark centered on the chest with a crowned silhouette wanderer at the hem. The back commands attention with a hauntingly detailed scribble grinning face with star-burst eyes and fractured typography declaring 'WELCOME TO MY MIND'.",
        images: [
            "/images/products/new/welcome-to-my-mind-dark-sketch-black-tee/back.png",
            "/images/products/new/welcome-to-my-mind-dark-sketch-black-tee/front.png",
            "/images/products/new/welcome-to-my-mind-dark-sketch-black-tee/showcase.png"
        ],
        mainImage: "/images/products/new/welcome-to-my-mind-dark-sketch-black-tee/back.png",
        category: "unisexual",
        subcategory: "t-shirts",
        actualPrice: 1799,
        discountPrice: 699,
        price: 699,
        originalPrice: 1799,
        discount: 61,
        rating: 5,
        totalRatings: 260,
        productFit: "OVERSIZED FIT",
        featured: true,
        sizes: sizes_template
    }
];

async function main() {
    const configPath = path.join(__dirname, '../../src/data/new-catalog-config.json');
    const origCatalog = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log(`Original catalog count: ${origCatalog.length}`);

    // Slugs to delete
    const deleteSlugs = [
        "cigarettes-after-regrets-tee",              // orig #26
        "risk-rich-money-typography-tee",            // orig #40
        "humse-jalte-hain-attitude-tee",             // orig #46
        "spiderman-miles-morales-webslinger-tee",    // orig #47
        "spiderman-peter-parker-typography-tee"      // orig #48
    ];

    // Slugs of new products:
    // New 1: think-outside-the-box-tictactoe-navy-tee (Pos 16)
    // New 2: tom-and-jerry-cartoon-network-cyan-tee (Pos 49)
    // New 3: srk-om-shanti-om-dialogue-black-tee (Pos 50)
    // New 4: confidence-looks-cute-cherries-white-tee (Pos 14)
    // New 5: welcome-to-my-mind-dark-sketch-black-tee (Pos 24)

    // Exact order of all 50 slots (1-indexed, positions 1 to 50):
    // Slot 1: Orig #29 (insanity-demon-crimson-tee)
    // Slot 2: Orig #49 (i-love-my-crazy-girlfriend-tee)
    // Slot 3: Orig #41 (japanese-dragon-samurai-red-sun-tee)
    // Slot 4: Orig #45 (faaaahhh-confidence-motion-typo-tee)
    // Slot 5: Orig #28 (unholy-rage-cemetery-tee)
    // Slot 6: Orig #31 (marlboro-doberman-die-anyway-tee)
    // Slot 7: Orig #25 (kaun-talha-acid-wash-tee)
    // Slot 8: Orig #10 (vans-heritage-graphic-tee)
    // Slot 9: Orig #33 (cutie-patola-lotus-tee)
    // Slot 10: Orig #32 (mera-yaar-khuda-hai-tee)
    // Slot 11: Orig #13 (pokemon-stamp-tee)
    // Slot 12: Orig #43 (trust-no-one-it-is-me-tee)
    // Slot 13: Orig #42 (rayo-mcqueen-retro-racer-white-tee)
    // Slot 14: NEW #4 (confidence-looks-cute-cherries-white-tee)
    // Slot 15: Orig #27 (veni-vidi-vici-gothic-monarch-tee)
    // Slot 16: NEW #1 (think-outside-the-box-tictactoe-navy-tee)
    // Slot 17: Orig #24 (young-stunners-gumaan-tee)
    // Slot 18: Orig #30 (her-new-guy-viper-acid-wash-tee)
    // Slot 19: Orig #8 (disney-mickey-mouse-fabric-tear-buttercream-tee)
    // Slot 20: Orig #3 (only-live-once-skeleton-ribcage-tee)
    // Slot 21: Orig #4 (cosmic-alien-mountain-cyber-tee)
    // Slot 22: Orig #6 (iron-man-tony-stark-legacy-arc-reactor-tee)
    // Slot 23: Orig #2 (spookie-peeking-cat-skeletons-tee)
    // Slot 24: NEW #5 (welcome-to-my-mind-dark-sketch-black-tee)
    // Slot 25: Orig #1 (halloween-rip-still-dead-tee)
    // Slot 26: Orig #50 (yin-yang-koi-dead-fish-tee)
    // Slot 27: Orig #39 (transformers-optimus-prime-tee)
    // Slot 28: Orig #20 (snakes-kiss-crimson-heart-tee)
    // Slot 29: Orig #38 (gta-vi-vice-city-tee)
    // Slot 30: Orig #37 (porsche-911-sally-carrera-tee)
    // Slot 31: Orig #35 (gothic-cathedral-chained-wanderer-tee)
    // Slot 32: Orig #34 (liquid-chrome-kid-buu-tee)
    // Slot 33: Orig #36 (lightning-mcqueen-piston-cup-tee)
    // Slot 34: Orig #44 (goku-ssb-power-quote-tee)
    // Slot 35: Orig #22 (umair-come-through-music-tee)
    // Slot 36: Orig #21 (squirtle-kanto-wave-tee)
    // Slot 37: Orig #19 (snakes-dont-hiss-viper-tee)
    // Slot 38: Orig #23 (downers-at-dusk-talha-anjum-tee)
    // Slot 39: Orig #18 (make-money-not-hoes-tee)
    // Slot 40: Orig #17 (underdog-foundation-tee)
    // Slot 41: Orig #16 (not-today-satan-tee)
    // Slot 42: Orig #15 (sins-and-virtue-tee)
    // Slot 43: Orig #12 (ugach-katkat-parody-tee)
    // Slot 44: Orig #9 (minions-banana-hanging-chain-pile-black-tee)
    // Slot 45: Orig #11 (trust-no-one-gothic-tee)
    // Slot 46: Orig #14 (sunflower-collection-tee)
    // Slot 47: Orig #5 (aesthetic-gaze-yes-is-clear-heart-tee)
    // Slot 48: Orig #7 (looney-tunes-street-trio-comic-panels-yellow-tee)
    // Slot 49: NEW #2 (tom-and-jerry-cartoon-network-cyan-tee)
    // Slot 50: NEW #3 (srk-om-shanti-om-dialogue-black-tee)

    const finalOrderedSlugs = [
        "insanity-demon-crimson-tee",                        // 1
        "i-love-my-crazy-girlfriend-tee",                    // 2
        "japanese-dragon-samurai-red-sun-tee",               // 3
        "faaaahhh-confidence-motion-typo-tee",               // 4
        "unholy-rage-cemetery-tee",                          // 5
        "marlboro-doberman-die-anyway-tee",                  // 6
        "kaun-talha-acid-wash-tee",                          // 7
        "vans-heritage-graphic-tee",                         // 8
        "cutie-patola-lotus-tee",                            // 9
        "mera-yaar-khuda-hai-tee",                           // 10
        "pokemon-stamp-tee",                                 // 11
        "trust-no-one-it-is-me-tee",                         // 12
        "rayo-mcqueen-retro-racer-white-tee",                // 13
        "confidence-looks-cute-cherries-white-tee",          // 14 (NEW #4)
        "veni-vidi-vici-gothic-monarch-tee",                 // 15
        "think-outside-the-box-tictactoe-navy-tee",          // 16 (NEW #1)
        "young-stunners-gumaan-tee",                         // 17
        "her-new-guy-viper-acid-wash-tee",                   // 18
        "disney-mickey-mouse-fabric-tear-buttercream-tee",   // 19
        "only-live-once-skeleton-ribcage-tee",               // 20
        "cosmic-alien-mountain-cyber-tee",                   // 21
        "iron-man-tony-stark-legacy-arc-reactor-tee",        // 22
        "spookie-peeking-cat-skeletons-tee",                 // 23
        "welcome-to-my-mind-dark-sketch-black-tee",          // 24 (NEW #5)
        "halloween-rip-still-dead-tee",                      // 25
        "yin-yang-koi-dead-fish-tee",                        // 26
        "transformers-optimus-prime-tee",                    // 27
        "snakes-kiss-crimson-heart-tee",                     // 28
        "gta-vi-vice-city-tee",                              // 29
        "porsche-911-sally-carrera-tee",                     // 30
        "gothic-cathedral-chained-wanderer-tee",             // 31
        "liquid-chrome-kid-buu-tee",                         // 32
        "lightning-mcqueen-piston-cup-tee",                  // 33
        "goku-ssb-power-quote-tee",                          // 34
        "umair-come-through-music-tee",                      // 35
        "squirtle-kanto-wave-tee",                           // 36
        "snakes-dont-hiss-viper-tee",                        // 37
        "downers-at-dusk-talha-anjum-tee",                   // 38
        "make-money-not-hoes-tee",                           // 39
        "underdog-foundation-tee",                           // 40
        "not-today-satan-tee",                               // 41
        "sins-and-virtue-tee",                               // 42
        "ugach-katkat-parody-tee",                           // 43
        "minions-banana-hanging-chain-pile-black-tee",       // 44
        "trust-no-one-gothic-tee",                           // 45
        "sunflower-collection-tee",                          // 46
        "aesthetic-gaze-yes-is-clear-heart-tee",             // 47
        "looney-tunes-street-trio-comic-panels-yellow-tee",  // 48
        "tom-and-jerry-cartoon-network-cyan-tee",            // 49 (NEW #2)
        "srk-om-shanti-om-dialogue-black-tee"                // 50 (NEW #3)
    ];

    console.log(`Target order count: ${finalOrderedSlugs.length}`);
    if (finalOrderedSlugs.length !== 50) {
        throw new Error('finalOrderedSlugs must contain exactly 50 slugs');
    }

    // Build catalog lookup
    const catalogMap = new Map();
    for (const p of origCatalog) {
        catalogMap.set(p.slug, p);
    }
    for (const p of newProducts) {
        catalogMap.set(p.slug, p);
    }

    // Assemble new catalog array
    const newCatalog = [];
    for (const slug of finalOrderedSlugs) {
        const item = catalogMap.get(slug);
        if (!item) {
            throw new Error(`Product not found for slug: ${slug}`);
        }
        newCatalog.push(item);
    }

    // Save rearranged catalog JSON
    fs.writeFileSync(configPath, JSON.stringify(newCatalog, null, 2), 'utf8');
    console.log(`✅ Updated ${configPath} with 50 products.`);

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB.');

    const collection = mongoose.connection.db.collection('products');

    // 1. Delete the 5 products requested by user
    console.log(`Deleting ${deleteSlugs.length} requested products from database...`);
    const delRes = await collection.deleteMany({ slug: { $in: deleteSlugs } });
    console.log(`✅ Deleted ${delRes.deletedCount} products from DB.`);

    // 2. Insert or update the 5 new products in DB
    for (const np of newProducts) {
        const exists = await collection.findOne({ slug: np.slug });
        const doc = {
            name: np.title,
            title: np.title,
            slug: np.slug,
            brand: np.brand,
            description: np.description,
            mainImage: np.mainImage,
            images: np.images,
            category: np.category,
            subcategory: np.subcategory,
            price: np.price,
            originalPrice: np.originalPrice,
            actualPrice: np.actualPrice,
            discountPrice: np.discountPrice,
            discount: np.discount,
            rating: np.rating,
            totalRatings: np.totalRatings,
            availableStock: 555,
            sizes: np.sizes,
            isActive: true,
            featured: np.featured,
            status: 'published',
            productFit: np.productFit,
            updatedAt: new Date()
        };

        if (exists) {
            await collection.updateOne({ slug: np.slug }, { $set: doc });
            console.log(`Updated new product in DB: ${np.slug}`);
        } else {
            doc.createdAt = new Date();
            await collection.insertOne(doc);
            console.log(`Inserted new product in DB: ${np.slug}`);
        }
    }

    // 3. Set createdAt timestamps so Product.find().sort({ createdAt: -1 }) returns slots 1 to 50 exactly
    // Base timestamp: Oct 4, 2026, 20:00:00 UTC
    const baseTime = new Date('2026-10-04T20:00:00.000Z').getTime();
    console.log('Synchronizing createdAt timestamps for all 50 positions...');

    for (let i = 0; i < finalOrderedSlugs.length; i++) {
        const slug = finalOrderedSlugs[i];
        // Descending timestamp: slot 0 gets baseTime, slot 1 gets baseTime - 60s, etc.
        const productTime = new Date(baseTime - (i * 60000));
        const res = await collection.updateOne(
            { slug },
            { 
                $set: { 
                    createdAt: productTime,
                    isActive: true,
                    status: 'published'
                } 
            }
        );
        if (res.matchedCount === 0) {
            console.warn(`⚠️ Warning: No DB product matched slug: ${slug}`);
        }
    }
    console.log('✅ Timestamps updated successfully.');

    // 4. Verify MongoDB ordering
    const dbProducts = await collection
        .find({ isActive: true, status: 'published' })
        .sort({ createdAt: -1 })
        .toArray();

    console.log(`\n--- Verification: DB Active Products (Total: ${dbProducts.length}) ---`);
    let allMatched = true;
    for (let i = 0; i < Math.min(dbProducts.length, 50); i++) {
        const expectedSlug = finalOrderedSlugs[i];
        const actualSlug = dbProducts[i].slug;
        const match = expectedSlug === actualSlug ? '✅' : '❌ MISMATCH';
        if (expectedSlug !== actualSlug) allMatched = false;
        console.log(`Slot ${(i+1).toString().padStart(2)}: ${actualSlug} ${match} (Title: ${dbProducts[i].title.slice(0, 35)}...)`);
    }

    if (allMatched && dbProducts.length === 50) {
        console.log('\n🎉 ALL 50 PRODUCTS PERFECTLY ORDERED AND VERIFIED IN DB AND CONFIG!');
    } else {
        console.log(`\nStatus: allMatched=${allMatched}, totalCount=${dbProducts.length}`);
    }

    await mongoose.disconnect();
    process.exit(0);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
