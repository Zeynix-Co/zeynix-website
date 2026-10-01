const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch(e) {}
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Product = require('../models/Product');

async function adjust() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB.');

        // Get halloween product timestamp
        const hallow = await Product.findOne({ slug: 'halloween-rip-still-dead-tee' });
        const baseTime = hallow ? new Date(hallow.createdAt).getTime() : Date.now();

        // Let's set the 3 new products right after halloween product, or even newer
        // Halloween is Position #1 (user's request from earlier: "add this product in the first section")
        // So Halloween should stay #1: say baseTime
        // Then Spookie is #2: baseTime - 1000ms
        // Then Skeleton is #3: baseTime - 2000ms
        // Then Cosmic Alien is #4: baseTime - 3000ms
        // All of them will appear right at the top of the collection!

        const updates = [
            { slug: 'halloween-rip-still-dead-tee', time: new Date(baseTime) },
            { slug: 'spookie-peeking-cat-skeletons-tee', time: new Date(baseTime - 1000) },
            { slug: 'only-live-once-skeleton-ribcage-tee', time: new Date(baseTime - 2000) },
            { slug: 'cosmic-alien-mountain-cyber-tee', time: new Date(baseTime - 3000) }
        ];

        for (const u of updates) {
            await Product.updateOne({ slug: u.slug }, { $set: { createdAt: u.time } });
            console.log(`Updated ${u.slug} -> createdAt: ${u.time.toISOString()}`);
        }

        // Fetch top 6 newest products
        const topProds = await Product.find({ isActive: true, status: 'published' })
            .sort({ createdAt: -1 })
            .limit(6)
            .select('slug title createdAt');

        console.log('\nTop 6 products by createdAt: -1:');
        topProds.forEach((p, idx) => {
            console.log(`  #${idx + 1}: ${p.slug} (${p.title})`);
        });

        await mongoose.disconnect();
        console.log('\nDone.');
    } catch(err) {
        console.error('Error:', err);
    }
}

adjust();
