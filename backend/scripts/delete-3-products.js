const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../../src/data/new-catalog-config.json');
let catalog = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const toDelete = [
  'underdog-foundation-tee',
  'not-today-satan-tee',
  'sins-and-virtue-tee'
];

// 1. Remove from catalog JSON
const newCatalog = catalog.filter(p => !toDelete.includes(p.slug));
fs.writeFileSync(configPath, JSON.stringify(newCatalog, null, 2), 'utf8');
console.log('Catalog updated. Previous count:', catalog.length, 'New count:', newCatalog.length);

// 2. Connect to DB
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
    const delRes = await collection.deleteMany({ slug: { $in: toDelete } });
    console.log('Deleted from DB:', delRes.deletedCount);

    // Resync timestamps
    const baseTime = new Date('2026-10-04T22:00:00.000Z').getTime();
    for (let i = 0; i < newCatalog.length; i++) {
        const slug = newCatalog[i].slug;
        const productTime = new Date(baseTime - (i * 60000));
        await collection.updateOne(
            { slug },
            { $set: { createdAt: productTime, isActive: true, status: 'published' } }
        );
    }
    console.log('Timestamps resynced.');

    const total = await collection.countDocuments({ isActive: true, status: 'published' });
    console.log('Total active products in DB:', total);

    await mongoose.disconnect();
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
