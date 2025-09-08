import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/config/database';
import { protect } from '@/lib/middleware/auth';
import { Order } from '@/lib/models/Order';
import { Product } from '@/lib/models/Product';

export async function POST(request: NextRequest) {
    try {
        console.log('🚀 Starting order creation process...');

        // Connect to database with error handling
        try {
            await connectDB();
            console.log('✅ Database connected successfully');
        } catch (dbError) {
            console.error('❌ Database connection failed:', dbError);
            return NextResponse.json(
                { success: false, message: 'Database connection failed' },
                { status: 500 }
            );
        }

        // Debug environment variables
        console.log('🔍 Order Creation Debug:');
        console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
        console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');

        // Debug request headers
        console.log('📋 Request Headers:');
        console.log('Authorization:', request.headers.get('authorization'));
        console.log('Cookie:', request.headers.get('cookie'));
        console.log('Content-Type:', request.headers.get('content-type'));

        // Authenticate user
        const { user, error } = await protect(request);
        if (error || !user) {
            console.error('❌ Authentication failed:', error);
            return NextResponse.json(
                { success: false, message: error || 'Authentication required' },
                { status: 401 }
            );
        }

        console.log('✅ User authenticated:', user.email);

        // Parse request body with error handling
        let requestBody;
        try {
            requestBody = await request.json();
            console.log('📋 Request body parsed successfully');
        } catch (parseError) {
            console.error('❌ Failed to parse request body:', parseError);
            return NextResponse.json(
                { success: false, message: 'Invalid JSON in request body' },
                { status: 400 }
            );
        }

        const { items, totalAmount, shippingAddress } = requestBody;

        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Order items are required' },
                { status: 400 }
            );
        }

        if (!totalAmount || totalAmount <= 0) {
            return NextResponse.json(
                { success: false, message: 'Invalid total amount' },
                { status: 400 }
            );
        }

        if (!shippingAddress) {
            return NextResponse.json(
                { success: false, message: 'Shipping address is required' },
                { status: 400 }
            );
        }

        // Validate products and check stock
        let calculatedTotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return NextResponse.json(
                    { success: false, message: `Product ${item.productId} not found` },
                    { status: 400 }
                );
            }

            if (!product.isActive) {
                return NextResponse.json(
                    { success: false, message: `Product ${product.title} is not available` },
                    { status: 400 }
                );
            }

            // Check stock availability
            const sizeStock = product.sizes.find((s: { size: string; stock: number; inStock: boolean }) => s.size === item.size);
            if (!sizeStock || sizeStock.stock < item.quantity) {
                return NextResponse.json(
                    { success: false, message: `Insufficient stock for ${product.title} in size ${item.size}` },
                    { status: 400 }
                );
            }

            // Use the price sent by frontend (which already includes discounts)
            const itemPrice = item.price; // This is the discounted price from frontend
            const itemTotal = itemPrice * item.quantity;
            calculatedTotal += itemTotal;

            orderItems.push({
                product: product._id,
                // Store complete product snapshot
                productTitle: product.title || product.name || 'Unknown Product',
                productImage: product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg',
                productBrand: product.brand || 'Zeynix',
                size: item.size,
                quantity: item.quantity,
                price: itemPrice,
                totalPrice: itemTotal
            });
        }

        // Use frontend's total amount instead of recalculating
        const finalTotalAmount = totalAmount;

        // Create order
        console.log('📦 Creating order with data:', {
            userId: user._id,
            itemCount: orderItems.length,
            totalAmount: finalTotalAmount,
            shippingAddress: shippingAddress
        });

        // Generate fallback order number
        const generateOrderNumber = () => {
            const date = new Date();
            const year = date.getFullYear().toString().slice(-2);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const timestamp = Date.now().toString().slice(-6);
            return `ZNX${year}${month}${day}${timestamp}`;
        };

        const order = new Order({
            user: user._id,
            items: orderItems,
            totalAmount: finalTotalAmount,
            orderNumber: generateOrderNumber(), // Set fallback order number
            deliveryAddress: {
                street: shippingAddress.addressLine1,
                city: shippingAddress.city,
                state: shippingAddress.state,
                pincode: shippingAddress.pincode
            },
            // Store complete shipping information
            shippingAddress: {
                firstName: shippingAddress.firstName,
                lastName: shippingAddress.lastName,
                phone: shippingAddress.phone,
                email: shippingAddress.email,
                addressLine1: shippingAddress.addressLine1,
                addressLine2: shippingAddress.addressLine2 || '',
                city: shippingAddress.city,
                state: shippingAddress.state,
                pincode: shippingAddress.pincode,
                country: shippingAddress.country || 'India'
            },
            status: 'pending',
            paymentStatus: 'pending',
            paymentMethod: 'razorpay',
            expectedDelivery: new Date(Date.now() + (45 * 60 * 1000)) // 45 minutes from now
        });

        console.log('💾 Saving order to database...');
        await order.save();
        console.log('✅ Order saved successfully with ID:', order._id);

        // Update product stock
        console.log('📉 Updating product stock...');
        for (const item of items) {
            try {
                const updateResult = await Product.findByIdAndUpdate(
                    item.productId,
                    {
                        $inc: {
                            [`sizes.$[size].stock`]: -item.quantity
                        }
                    },
                    {
                        arrayFilters: [{ 'size.size': item.size }]
                    }
                );
                console.log(`✅ Stock updated for product ${item.productId}, size ${item.size}, quantity: -${item.quantity}`);
            } catch (stockError) {
                console.error(`❌ Failed to update stock for product ${item.productId}:`, stockError);
                // Don't fail the order if stock update fails - just log it
            }
        }

        // Return success response
        return NextResponse.json({
            success: true,
            message: 'Order created successfully',
            data: {
                id: order._id,
                orderNumber: order.orderNumber,
                totalAmount: order.totalAmount,
                status: order.status
            }
        }, { status: 201 });

    } catch (error) {
        console.error('❌ Create order error:', error);
        console.error('Error details:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace'
        });

        // Return more specific error message
        const errorMessage = error instanceof Error ? error.message : 'Internal server error creating order';
        return NextResponse.json(
            {
                success: false,
                message: errorMessage,
                error: process.env.NODE_ENV === 'development' ? error : undefined
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Authenticate user
        const { user, error } = await protect(request);
        if (error || !user) {
            return NextResponse.json(
                { success: false, message: error || 'Authentication required' },
                { status: 401 }
            );
        }

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');

        // Build filter - only orders for this user
        const filter: { user: string; status?: string } = { user: user._id.toString() };
        if (status && status !== 'all') {
            filter.status = status;
        }

        // Execute query
        const orders = await Order.find(filter)
            .populate('items.product', 'title images')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        // Get total count
        const total = await Order.countDocuments(filter);

        return NextResponse.json({
            success: true,
            data: {
                orders,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('Get customer orders error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error getting customer orders' },
            { status: 500 }
        );
    }
}