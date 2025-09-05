import mongoose, { Schema, Document } from 'mongoose';

export interface ICart extends Document {
    user: mongoose.Types.ObjectId;
    items: Array<{
        product: mongoose.Types.ObjectId;
        size: string;
        quantity: number;
        price: number;
        totalPrice: number;
        addedAt: Date;
    }>;
    savedForLater: Array<{
        product: mongoose.Types.ObjectId;
        size: string;
        quantity: number;
        price: number;
        totalPrice: number;
        savedAt: Date;
    }>;
    totalItems: number;
    totalAmount: number;
    savedItemsCount: number;
    createdAt: Date;
    updatedAt: Date;
    addItem(productId: mongoose.Types.ObjectId, size: string, quantity: number, price: number): Promise<ICart>;
    removeItem(productId: mongoose.Types.ObjectId, size: string): Promise<ICart>;
    updateQuantity(productId: mongoose.Types.ObjectId, size: string, quantity: number): Promise<ICart | false>;
    moveToSaved(productId: mongoose.Types.ObjectId, size: string): Promise<ICart | false>;
    moveToCart(productId: mongoose.Types.ObjectId, size: string): Promise<ICart | false>;
    clearCart(): Promise<ICart>;
}

const CartSchema = new Schema<ICart>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
        unique: true
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
            min: [1, 'Quantity must be at least 1'],
            default: 1
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
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    savedForLater: [{
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
            min: [1, 'Quantity must be at least 1'],
            default: 1
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
        },
        savedAt: {
            type: Date,
            default: Date.now
        }
    }],
    totalItems: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    savedItemsCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Calculate totals before saving
CartSchema.pre('save', function (next) {
    // Calculate cart totals
    this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
    this.totalAmount = this.items.reduce((total, item) => total + item.totalPrice, 0);

    // Calculate saved items count
    this.savedItemsCount = this.savedForLater.reduce((total, item) => total + item.quantity, 0);

    next();
});

// Method to add item to cart
CartSchema.methods.addItem = function (productId: mongoose.Types.ObjectId, size: string, quantity: number, price: number) {
    const existingItem = this.items.find((item: { product: mongoose.Types.ObjectId; size: string; quantity: number; price: number; totalPrice: number }) =>
        item.product.toString() === productId.toString() && item.size === size
    );

    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
    } else {
        this.items.push({
            product: productId,
            size,
            quantity,
            price,
            totalPrice: quantity * price
        });
    }

    return this.save();
};

// Method to remove item from cart
CartSchema.methods.removeItem = function (productId: mongoose.Types.ObjectId, size: string) {
    this.items = this.items.filter((item: { product: mongoose.Types.ObjectId; size: string }) =>
        !(item.product.toString() === productId.toString() && item.size === size)
    );

    return this.save();
};

// Method to update item quantity
CartSchema.methods.updateQuantity = function (productId: mongoose.Types.ObjectId, size: string, quantity: number) {
    const item = this.items.find((item: { product: mongoose.Types.ObjectId; size: string; quantity: number; price: number; totalPrice: number }) =>
        item.product.toString() === productId.toString() && item.size === size
    );

    if (item) {
        item.quantity = quantity;
        item.totalPrice = item.quantity * item.price;
        return this.save();
    }

    return false;
};

// Method to move item to saved for later
CartSchema.methods.moveToSaved = function (productId: mongoose.Types.ObjectId, size: string) {
    const itemIndex = this.items.findIndex((item: { product: mongoose.Types.ObjectId; size: string }) =>
        item.product.toString() === productId.toString() && item.size === size
    );

    if (itemIndex !== -1) {
        const item = this.items[itemIndex];
        this.items.splice(itemIndex, 1);

        // Check if already in saved for later
        const existingSaved = this.savedForLater.find((saved: { product: mongoose.Types.ObjectId; size: string; quantity: number; price: number; totalPrice: number }) =>
            saved.product.toString() === productId.toString() && saved.size === size
        );

        if (existingSaved) {
            existingSaved.quantity += item.quantity;
            existingSaved.totalPrice = existingSaved.quantity * existingSaved.price;
        } else {
            this.savedForLater.push({
                product: item.product,
                size: item.size,
                quantity: item.quantity,
                price: item.price,
                totalPrice: item.totalPrice
            });
        }

        return this.save();
    }

    return false;
};

// Method to move item from saved to cart
CartSchema.methods.moveToCart = function (productId: mongoose.Types.ObjectId, size: string) {
    const savedIndex = this.savedForLater.findIndex((item: { product: mongoose.Types.ObjectId; size: string }) =>
        item.product.toString() === productId.toString() && item.size === size
    );

    if (savedIndex !== -1) {
        const item = this.savedForLater[savedIndex];
        this.savedForLater.splice(savedIndex, 1);

        // Check if already in cart
        const existingCart = this.items.find((cartItem: { product: mongoose.Types.ObjectId; size: string; quantity: number; price: number; totalPrice: number }) =>
            cartItem.product.toString() === productId.toString() && cartItem.size === size
        );

        if (existingCart) {
            existingCart.quantity += item.quantity;
            existingCart.totalPrice = existingCart.quantity * existingCart.price;
        } else {
            this.items.push({
                product: item.product,
                size: item.size,
                quantity: item.quantity,
                price: item.price,
                totalPrice: item.totalPrice
            });
        }

        return this.save();
    }

    return false;
};

// Method to clear cart
CartSchema.methods.clearCart = function () {
    this.items = [];
    this.totalItems = 0;
    this.totalAmount = 0;
    return this.save();
};

// Ensure virtual fields are serialized
CartSchema.set('toJSON', { virtuals: true });
CartSchema.set('toObject', { virtuals: true });

export const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);
