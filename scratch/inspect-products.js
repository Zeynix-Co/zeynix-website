const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '../.env.local');
let MONGODB_URI = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
        if (line.startsWith('MONGODB_URI=')) {
            MONGODB_URI = line.split('MONGODB_URI=')[1].trim().replace(/['"]/g, '');
            break;
        }
    }
} catch (err) {
    console.error('Failed to read .env.local:', err.message);
}

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set in .env.local');
    process.exit(1);
}

// Define the minimal Product schema
const ProductSchema = new mongoose.Schema({
    title: String,
    category: String,
    actualPrice: Number,
    discountPrice: Number,
    isActive: Boolean,
    status: String,
    images: [String]
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function main() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected successfully!');

        const products = await Product.find({});
        console.log(`\nFound ${products.length} products in total.`);
        
        products.forEach((p, index) => {
            console.log(`${index + 1}. Title: "${p.title}" | Category: "${p.category}" | Price: ₹${p.actualPrice} | Active: ${p.isActive} | Status: "${p.status}"`);
        });

        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB.');
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

main();
