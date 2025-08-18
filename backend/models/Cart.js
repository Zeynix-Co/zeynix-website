const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
        unique: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
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
            type: mongoose.Schema.Types.ObjectId,
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
cartSchema.pre('save', function (next) {
    // Calculate cart totals
    this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
    this.totalAmount = this.items.reduce((total, item) => total + item.totalPrice, 0);

    // Calculate saved items count
    this.savedItemsCount = this.savedForLater.reduce((total, item) => total + item.quantity, 0);

    next();
});

// Method to add item to cart
cartSchema.methods.addItem = function (productId, size, quantity, price) {
    const existingItem = this.items.find(item =>
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
cartSchema.methods.removeItem = function (productId, size) {
    this.items = this.items.filter(item =>
        !(item.product.toString() === productId.toString() && item.size === size)
    );

    return this.save();
};

// Method to update item quantity
cartSchema.methods.updateQuantity = function (productId, size, quantity) {
    const item = this.items.find(item =>
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
cartSchema.methods.moveToSaved = function (productId, size) {
    const itemIndex = this.items.findIndex(item =>
        item.product.toString() === productId.toString() && item.size === size
    );

    if (itemIndex !== -1) {
        const item = this.items[itemIndex];
        this.items.splice(itemIndex, 1);

        // Check if already in saved for later
        const existingSaved = this.savedForLater.find(saved =>
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
cartSchema.methods.moveToCart = function (productId, size) {
    const savedIndex = this.savedForLater.findIndex(item =>
        item.product.toString() === productId.toString() && item.size === size
    );

    if (savedIndex !== -1) {
        const item = this.savedForLater[savedIndex];
        this.savedForLater.splice(savedIndex, 1);

        // Check if already in cart
        const existingCart = this.items.find(cartItem =>
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
cartSchema.methods.clearCart = function () {
    this.items = [];
    this.totalItems = 0;
    this.totalAmount = 0;
    return this.save();
};

// Ensure virtual fields are serialized
cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Cart', cartSchema);
