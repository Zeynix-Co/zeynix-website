const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    slug: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        sparse: true
    },
    productId: {
        type: String,
        trim: true
    },
    brand: {
        type: String,
        required: [true, 'Product brand is required'],
        trim: true,
        default: 'Zeynix'
    },
    description: {
        type: String,
        required: false,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    mainImage: {
        type: String
    },
    images: [{
        type: String,
        required: [true, 'At least one product image is required']
    }],
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: ['casual', 'formal', 'ethnic', 'sports', 't-shirts'],
        default: 'casual'
    },
    subcategory: {
        type: String,
        trim: true,
        default: 't-shirts'
    },
    price: {
        type: Number,
        min: [0, 'Price cannot be negative']
    },
    originalPrice: {
        type: Number,
        min: [0, 'Original price cannot be negative']
    },
    actualPrice: {
        type: Number,
        required: [true, 'Actual price is required'],
        min: [0, 'Price cannot be negative']
    },
    discountPrice: {
        type: Number,
        min: [0, 'Discount price cannot be negative']
    },
    discount: {
        type: Number,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%']
    },
    rating: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be negative'],
        max: [5, 'Rating cannot exceed 5']
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    availableStock: {
        type: Number,
        default: 100,
        min: [0, 'Stock cannot be negative']
    },
    sizes: [{
        size: {
            type: String,
            required: true,
            enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
        },
        stock: {
            type: Number,
            required: true,
            min: [0, 'Stock cannot be negative'],
            default: 100
        },
        inStock: {
            type: Boolean,
            default: true
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published'
    },
    productFit: {
        type: String,
        enum: ['OVERSIZED FIT', 'CASUAL FIT', 'FORMAL FIT', 'CLASSIC FIT', 'SLIM FIT', 'RELAXED FIT'],
        default: 'CASUAL FIT'
    }
}, {
    timestamps: true
});

// Synchronize fields and calculate discount percentage before saving
productSchema.pre('save', function (next) {
    if (!this.name && this.title) {
        this.name = this.title;
    }
    if (!this.title && this.name) {
        this.title = this.name;
    }
    if (!this.originalPrice && this.actualPrice) {
        this.originalPrice = this.actualPrice;
    }
    if (!this.actualPrice && this.originalPrice) {
        this.actualPrice = this.originalPrice;
    }
    if (this.discountPrice !== undefined && this.discountPrice !== null) {
        this.price = this.discountPrice;
    } else if (this.price !== undefined && this.price !== null) {
        this.discountPrice = this.price;
    } else {
        this.price = this.actualPrice;
    }

    if (this.images && this.images.length > 0) {
        if (!this.mainImage) {
            this.mainImage = this.images[0];
        }
    }

    if (this.sizes && this.sizes.length > 0) {
        this.availableStock = this.sizes.reduce((total, s) => total + (s.stock || 0), 0);
    }

    const orig = this.originalPrice || this.actualPrice;
    const curr = this.price || this.discountPrice;
    if (orig && curr && curr < orig) {
        this.discount = Math.round(((orig - curr) / orig) * 100);
    }

    next();
});

// Virtual for checking if product has discount
productSchema.virtual('hasDiscount').get(function () {
    return this.discount > 0;
});

// Virtual for final price
productSchema.virtual('finalPrice').get(function () {
    return this.discountPrice || this.actualPrice;
});

// Method to check if product is in stock
productSchema.methods.isInStock = function (size) {
    const sizeData = this.sizes.find(s => s.size === size);
    return sizeData && sizeData.inStock && sizeData.stock > 0;
};

// Method to update stock
productSchema.methods.updateStock = function (size, quantity, operation = 'decrease') {
    const sizeData = this.sizes.find(s => s.size === size);
    if (sizeData) {
        if (operation === 'decrease') {
            sizeData.stock = Math.max(0, sizeData.stock - quantity);
        } else if (operation === 'increase') {
            sizeData.stock += quantity;
        }

        sizeData.inStock = sizeData.stock > 0;
        return true;
    }
    return false;
};

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
