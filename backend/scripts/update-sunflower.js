const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../../src/data/new-catalog-config.json');
let catalog = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const sf = catalog.find(p => p.slug === 'sunflower-collection-tee');
if (sf) {
    sf.images = [
        '/images/products/new/sunflower-collection-tee/back.png',
        '/images/products/new/sunflower-collection-tee/front.png',
        '/images/products/new/sunflower-collection-tee/showcase.png'
    ];
    sf.mainImage = '/images/products/new/sunflower-collection-tee/back.png';
}

fs.writeFileSync(configPath, JSON.stringify(catalog, null, 2), 'utf8');
console.log('✅ Catalog config updated for sunflower-collection-tee.');

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

async function main() {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('Connected to MongoDB.');

    const collection = mongoose.connection.db.collection('products');
    const res = await collection.updateOne(
        { slug: 'sunflower-collection-tee' },
        {
            $set: {
                images: [
                    '/images/products/new/sunflower-collection-tee/back.png',
                    '/images/products/new/sunflower-collection-tee/front.png',
                    '/images/products/new/sunflower-collection-tee/showcase.png'
                ],
                mainImage: '/images/products/new/sunflower-collection-tee/back.png',
                updatedAt: new Date()
            }
        }
    );
    console.log('✅ MongoDB updated for sunflower-collection-tee:', res.modifiedCount);

    await mongoose.disconnect();
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
