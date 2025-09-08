import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { protect } from '@/lib/middleware/auth';
import { Order } from '@/lib/models/Order';
import { Product } from '@/lib/models/Product';

export async function POST(request: NextRequest) {
    try {
        console.log('🧪 Testing order creation...');
        
        // Connect to database
        await connectDB();
        console.log('✅ Database connected');

        // Test authentication
        const { user, error } = await protect(request);
        if (error || !user) {
            return NextResponse.json(
                { success: false, message: 'Authentication required for testing' },
                { status: 401 }
            );
        }

        console.log('✅ User authenticated:', user.email);

        // Get a sample product
        const sampleProduct = await Product.findOne({ isActive: true });
        if (!sampleProduct) {
            return NextResponse.json(
                { success: false, message: 'No active products found for testing' },
                { status: 400 }
            );
        }

        console.log('✅ Sample product found:', sampleProduct.title);

        // Create a test order
        const testOrder = new Order({
            user: user._id,
            items: [{
                product: sampleProduct._id,
                productTitle: sampleProduct.title,
                productImage: sampleProduct.images?.[0] || '/images/placeholder.jpg',
                productBrand: sampleProduct.brand || 'Zeynix',
                size: 'M',
                quantity: 1,
                price: sampleProduct.price,
                totalPrice: sampleProduct.price
            }],
            totalAmount: sampleProduct.price,
            deliveryAddress: {
                street: 'Test Street',
                city: 'Test City',
                state: 'Test State',
                pincode: '123456'
            },
            shippingAddress: {
                firstName: 'Test',
                lastName: 'User',
                phone: '1234567890',
                email: user.email,
                addressLine1: 'Test Street',
                addressLine2: '',
                city: 'Test City',
                state: 'Test State',
                pincode: '123456',
                country: 'India'
            },
            status: 'pending',
            paymentStatus: 'pending',
            paymentMethod: 'test',
            expectedDelivery: new Date(Date.now() + (45 * 60 * 1000))
        });

        console.log('💾 Saving test order...');
        await testOrder.save();
        console.log('✅ Test order saved with ID:', testOrder._id);

        return NextResponse.json({
            success: true,
            message: 'Test order created successfully',
            data: {
                orderId: testOrder._id,
                orderNumber: testOrder.orderNumber,
                totalAmount: testOrder.totalAmount,
                status: testOrder.status
            }
        });

    } catch (error) {
        console.error('❌ Test order creation failed:', error);
        return NextResponse.json(
            { 
                success: false, 
                message: 'Test order creation failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
