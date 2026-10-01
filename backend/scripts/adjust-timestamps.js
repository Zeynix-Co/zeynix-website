const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch(e) {}
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function setMiddleTimestamps() {
  await mongoose.connect(process.env.MONGODB_URI);
  const collection = mongoose.connection.db.collection('products');
  
  // Set createdAt for both to be right in the middle between cutie-patola and mera-yaar
  const r1 = await collection.updateOne(
    { slug: 'insanity-demon-crimson-tee' },
    { $set: { createdAt: new Date('2026-09-30T16:40:06.300Z') } }
  );
  const r2 = await collection.updateOne(
    { slug: 'her-new-guy-viper-acid-wash-tee' },
    { $set: { createdAt: new Date('2026-09-30T16:40:06.200Z') } }
  );
  
  console.log(`Updated insanity: ${r1.modifiedCount}, updated her-new-guy: ${r2.modifiedCount}`);
  
  const products = await collection.find({ isActive: true, status: 'published' }).sort({ createdAt: -1 }).toArray();
  console.log('Total active products in DB:', products.length);
  products.forEach((p, i) => {
    if (i >= 18 && i <= 24) {
      console.log(`Position ${i+1}: ${p.slug} (${p.title}) -> ${p.createdAt.toISOString()}`);
    }
  });
  process.exit(0);
}

setMiddleTimestamps();
