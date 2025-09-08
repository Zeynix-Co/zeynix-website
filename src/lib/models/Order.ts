import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    orderNumber: string;
    items: Array<{
        product: mongoose.Types.ObjectId;
        productTitle: string;
        productImage: string;
        productBrand?: string;
        size: string;
        quantity: number;
        price: number;
        totalPrice: number;
    }>;
    status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
    totalAmount: number;
    deliveryAddress: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
    shippingAddress: {
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    deliveryInstructions?: string;
    expectedDelivery: Date;
    paymentMethod: string;
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    updateStatus(newStatus: string): Promise<IOrder>;
    cancelOrder(): Promise<IOrder>;
}

const OrderSchema = new Schema<IOrder>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    orderNumber: {
        type: String,
        unique: true,
        required: false // Will be set by pre-save hook
    },
    items: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        productTitle: {
            type: String,
            required: true
        },
        productImage: {
            type: String,
            required: true
        },
        productBrand: {
            type: String,
            default: 'Zeynix'
        },
        size: {
            type: String,
            required: true,
            enum: ['M', 'L', 'XL', 'XXL', 'XXXL']
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1']
        },
        price: {
            type: Number,
            required: true,
            min: [0, 'Price cannot be negative']
        },
        totalPrice: {
            type: Number,
            required: true,
            min: [0, 'Total price cannot be negative']
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        required: true,
        min: [0, 'Total amount cannot be negative']
    },
    deliveryAddress: {
        street: {
            type: String,
            required: [true, 'Street address is required']
        },
        city: {
            type: String,
            required: [true, 'City is required']
        },
        state: {
            type: String,
            required: [true, 'State is required']
        },
        pincode: {
            type: String,
            required: [true, 'Pincode is required'],
            match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
        }
    },
    shippingAddress: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        addressLine1: {
            type: String,
            required: true
        },
        addressLine2: {
            type: String,
            default: ''
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            default: 'India'
        }
    },
    deliveryInstructions: {
        type: String,
        maxlength: [200, 'Delivery instructions cannot exceed 200 characters']
    },
    expectedDelivery: {
        type: Date,
        required: true
    },
    paymentMethod: {
        type: String,
        default: 'razorpay'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    razorpayOrderId: {
        type: String
    },
    razorpayPaymentId: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Generate order number before saving
OrderSchema.pre('save', async function (next) {
    if (this.isNew && !this.orderNumber) {
        try {
            console.log('🔢 Generating order number...');
            const date = new Date();
            const year = date.getFullYear().toString().slice(-2);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');

            // Get count of orders for today with error handling
            let todayOrders = 0;
            try {
                todayOrders = await (this.constructor as typeof Order).countDocuments({
                    createdAt: {
                        $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                        $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
                    }
                });
                console.log('📊 Today orders count:', todayOrders);
            } catch (countError) {
                console.error('❌ Error counting today orders:', countError);
                // Fallback: use timestamp-based order number
                const timestamp = Date.now().toString().slice(-6);
                this.orderNumber = `ZNX${year}${month}${day}${timestamp}`;
                console.log('✅ Fallback order number generated:', this.orderNumber);
                return next();
            }

            const orderCount = (todayOrders + 1).toString().padStart(3, '0');
            this.orderNumber = `ZNX${year}${month}${day}${orderCount}`;
            console.log('✅ Order number generated:', this.orderNumber);
        } catch (error) {
            console.error('❌ Error generating order number:', error);
            // Ultimate fallback: use timestamp
            const timestamp = Date.now().toString().slice(-6);
            this.orderNumber = `ZNX${timestamp}`;
            console.log('✅ Ultimate fallback order number:', this.orderNumber);
        }
    }
    next();
});

// Ensure orderNumber is always set after saving
OrderSchema.post('save', function (doc) {
    if (!doc.orderNumber) {
        console.error('❌ Order saved without orderNumber!');
        // Generate emergency order number
        const timestamp = Date.now().toString().slice(-6);
        doc.orderNumber = `ZNX${timestamp}`;
        doc.save().catch(err => console.error('Failed to save emergency order number:', err));
    }
});

// Calculate total amount before saving
OrderSchema.pre('save', function (next) {
    if (this.items && this.items.length > 0) {
        this.totalAmount = this.items.reduce((total, item) => total + item.totalPrice, 0);
    }
    next();
});

// Set expected delivery time (30-45 minutes from now)
OrderSchema.pre('save', function (next) {
    if (this.isNew && !this.expectedDelivery) {
        const now = new Date();
        const deliveryTime = new Date(now.getTime() + (45 * 60 * 1000)); // 45 minutes
        this.expectedDelivery = deliveryTime;
    }
    next();
});

// Method to update order status
OrderSchema.methods.updateStatus = function (newStatus: string) {
    this.status = newStatus as 'pending' | 'confirmed' | 'delivered' | 'cancelled';
    return this.save();
};

// Method to cancel order
OrderSchema.methods.cancelOrder = function () {
    this.status = 'cancelled';
    this.isActive = false;
    return this.save();
};

// Virtual for order summary
OrderSchema.virtual('itemCount').get(function () {
    return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Ensure virtual fields are serialized
OrderSchema.set('toJSON', { virtuals: true });
OrderSchema.set('toObject', { virtuals: true });

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);