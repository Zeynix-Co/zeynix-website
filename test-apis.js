// test-apis.js - API Testing Script
const testAPIs = async () => {
    console.log('🧪 Testing Zeynix APIs...\n');

    const baseUrl = 'http://localhost:8000';

    // Test 1: Backend Health
    try {
        const healthResponse = await fetch(`${baseUrl}/api/health`);
        const healthData = await healthResponse.json();
        console.log('✅ Backend Health:', healthData);
    } catch (error) {
        console.log('❌ Backend Health Failed:', error.message);
    }

    // Test 2: Customer Products (Public)
    try {
        const productsResponse = await fetch(`${baseUrl}/api/customer/products?limit=5`);
        const productsData = await productsResponse.json();
        console.log('✅ Customer Products:', productsData.success ? 'Working' : 'Failed');
        if (productsData.success) {
            console.log(`   Found ${productsData.data.products.length} products`);
        }
    } catch (error) {
        console.log('❌ Customer Products Failed:', error.message);
    }

    // Test 3: Featured Products
    try {
        const featuredResponse = await fetch(`${baseUrl}/api/customer/products/featured?limit=3`);
        const featuredData = await featuredResponse.json();
        console.log('✅ Featured Products:', featuredData.success ? 'Working' : 'Failed');
    } catch (error) {
        console.log('❌ Featured Products Failed:', error.message);
    }

    // Test 4: Product Search
    try {
        const searchResponse = await fetch(`${baseUrl}/api/customer/products/search?q=casual&limit=3`);
        const searchData = await searchResponse.json();
        console.log('✅ Product Search:', searchData.success ? 'Working' : 'Failed');
    } catch (error) {
        console.log('❌ Product Search Failed:', error.message);
    }

    console.log('\n🎯 Frontend Testing Instructions:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Check browser console for errors');
    console.log('3. Navigate to /products page');
    console.log('4. Try adding items to cart');
    console.log('5. Go to checkout and test order creation');
};

// Run tests
testAPIs();
