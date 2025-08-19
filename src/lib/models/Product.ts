import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    title: string;
    brand: string;
    description?: string;
    images: string[];
    category: 'casual' | 'formal' | 'ethnic' | 'sports';
    actualPrice: number;
    discountPrice?: number;
    discount?: number;
    rating: number;
    totalRatings: number;
    sizes: Array<{
        size: 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
        stock: number;
        inStock: boolean;
    }>;
    isActive: boolean;
    featured: boolean;
    status: 'draft' | 'published' | 'archived';
    productFit: 'OVERSIZED FIT' | 'CASUAL FIT' | 'FORMAL FIT' | 'CLASSIC FIT' | 'SLIM FIT';
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
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
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    images: [{
        type: String,
        required: [true, 'At least one product image is required']
    }],
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: ['casual', 'formal', 'ethnic', 'sports'],
        default: 'casual'
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
    sizes: [{
        size: {
            type: String,
            required: true,
            enum: ['M', 'L', 'XL', 'XXL', 'XXXL']
        },
        stock: {
            type: Number,
            required: true,
            min: [0, 'Stock cannot be negative'],
            default: 0
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
        enum: ['OVERSIZED FIT', 'CASUAL FIT', 'FORMAL FIT', 'CLASSIC FIT', 'SLIM FIT'],
        default: 'CASUAL FIT'
    }
}, {
    timestamps: true
});

// Calculate discount percentage before saving
productSchema.pre('save', function (next) {
    if (this.actualPrice && this.discountPrice && this.discountPrice < this.actualPrice) {
        this.discount = Math.round(((this.actualPrice - this.discountPrice) / this.actualPrice) * 100);
    }
    next();
});

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
