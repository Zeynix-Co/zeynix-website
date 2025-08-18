const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = require('../config/database');

// Import Product model
const Product = require('../models/Product');

const migrateProducts = async () => {
    try {
        // Connect to database
        await connectDB();
        console.log('✅ Connected to MongoDB');

        // Find all products that don't have a status field
        const productsToUpdate = await Product.find({ status: { $exists: false } });
        console.log(`📦 Found ${productsToUpdate.length} products to migrate`);

        if (productsToUpdate.length === 0) {
            console.log('✅ All products already have status field');
            process.exit(0);
        }

        // Update all products to have status: 'published' and productFit: 'CASUAL FIT'
        const updateResult = await Product.updateMany(
            { status: { $exists: false } },
            {
                $set: {
                    status: 'published',
                    productFit: 'CASUAL FIT'
                }
            }
        );

        console.log(`✅ Successfully updated ${updateResult.modifiedCount} products`);
        console.log('📝 All products now have status: "published" and productFit: "CASUAL FIT"');

        // Verify the update
        const updatedProducts = await Product.find({ status: 'published' });
        console.log(`🔍 Total products with published status: ${updatedProducts.length}`);

        // Show sample of updated products
        const sampleProducts = await Product.find({ status: 'published' }).limit(3);
        console.log('\n📋 Sample updated products:');
        sampleProducts.forEach(product => {
            console.log(`  - ${product.title} (${product.category}) - Status: ${product.status}, Fit: ${product.productFit}`);
        });

        console.log('\n🎉 Migration completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

// Run migration
migrateProducts();
