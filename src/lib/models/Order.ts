import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    orderNumber: string;
    items: Array<{
        product: mongoose.Types.ObjectId;
        size: 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
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
    deliveryInstructions?: string;
    expectedDelivery: Date;
    paymentMethod: string;
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    itemCount: number; // Virtual field
}

const orderSchema = new Schema<IOrder>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    items: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
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
orderSchema.pre('save', async function (next) {
    if (this.isNew) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        // Get count of orders for today
        const todayOrders = await (this.constructor as typeof Order).countDocuments({
            createdAt: {
                $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
            }
        });

        const orderCount = (todayOrders + 1).toString().padStart(3, '0');
        this.orderNumber = `ZNX${year}${month}${day}${orderCount}`;
    }
    next();
});

// Calculate total amount before saving
orderSchema.pre('save', function (next) {
    if (this.items && this.items.length > 0) {
        this.totalAmount = this.items.reduce((total, item) => total + item.totalPrice, 0);
    }
    next();
});

// Set expected delivery time (30-45 minutes from now)
orderSchema.pre('save', function (next) {
    if (this.isNew && !this.expectedDelivery) {
        const now = new Date();
        const deliveryTime = new Date(now.getTime() + (45 * 60 * 1000)); // 45 minutes
        this.expectedDelivery = deliveryTime;
    }
    next();
});

// Virtual for order summary
orderSchema.virtual('itemCount').get(function () {
    return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Ensure virtual fields are serialized
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);