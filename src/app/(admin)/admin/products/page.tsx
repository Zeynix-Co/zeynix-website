'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminStore, useProductStore } from '@/store';
import ProductForm from '@/components/admin/ProductForm';
import {
    Package,
    Plus,
    Search,
    Eye,
    EyeOff,
    Edit3,
    Trash2,
    ArrowLeft,
    ExternalLink,
    RefreshCw,
    LogOut,
    CheckCircle2,
    AlertCircle,
    SlidersHorizontal,
    X,
    Sparkles,
    ShieldCheck,
    Tag,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

export default function AdminProductsPage() {
    const router = useRouter();
    const { user, logout } = useAdminStore();
    const {
        products,
        pagination,
        filters,
        isLoading,
        error,
        getAllProducts,
        deleteProduct,
        toggleProductStatus,
        setFilters,
        clearError
    } = useProductStore();

    // View state: 'list' | 'add' | 'edit'
    const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit'>('list');
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    // Search and filter state
    const [searchInput, setSearchInput] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    // Action feedback toasts
    const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    // Delete confirmation modal state
    const [productToDelete, setProductToDelete] = useState<{ id: string; title: string } | null>(null);

    const showFeedback = (type: 'success' | 'error', text: string) => {
        setFeedbackMessage({ type, text });
        setTimeout(() => setFeedbackMessage(null), 4500);
    };

    // Load products on mount
    const loadProducts = () => {
        if (user) {
            getAllProducts(user.id, {
                search: searchInput,
                status: statusFilter,
                category: categoryFilter,
                page: pagination.page || 1,
                limit: 12
            });
        }
    };

    useEffect(() => {
        if (user) {
            loadProducts();
        }
    }, [user, statusFilter, categoryFilter]);

    // Handle search debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== filters.search) {
                setFilters({ search: searchInput, page: 1 });
                if (user) {
                    getAllProducts(user.id, {
                        search: searchInput,
                        status: statusFilter,
                        category: categoryFilter,
                        page: 1,
                        limit: 12
                    });
                }
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleLogout = async () => {
        await logout();
        window.location.href = '/admin/login';
    };

    // Toggle live / hide
    const handleToggleVisibility = async (productId: string, currentStatus: string, productTitle: string) => {
        if (!user) return;
        try {
            setActionLoadingId(productId);
            const newStatus = currentStatus === 'published' ? 'draft' : 'published';
            await toggleProductStatus(productId, newStatus, user.id);
            showFeedback(
                'success',
                newStatus === 'published'
                    ? `"${productTitle}" is now LIVE on the store!`
                    : `"${productTitle}" is now HIDDEN from the store.`
            );
        } catch (err: any) {
            showFeedback('error', err.message || 'Failed to update visibility status');
        } finally {
            setActionLoadingId(null);
        }
    };

    // Confirm and delete product
    const handleConfirmDelete = async () => {
        if (!productToDelete || !user) return;
        try {
            setActionLoadingId(productToDelete.id);
            await deleteProduct(productToDelete.id, user.id);
            showFeedback('success', `Product "${productToDelete.title}" was permanently removed.`);
            setProductToDelete(null);
        } catch (err: any) {
            showFeedback('error', err.message || 'Failed to delete product');
        } finally {
            setActionLoadingId(null);
        }
    };

    // Switch to Edit Mode
    const handleStartEdit = (productId: string) => {
        setSelectedProductId(productId);
        setViewMode('edit');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Switch to Add Mode
    const handleStartAdd = () => {
        setSelectedProductId(null);
        setViewMode('add');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Return to List View
    const handleBackToList = () => {
        setViewMode('list');
        setSelectedProductId(null);
        loadProducts();
    };

    const publishedCount = products.filter(p => p.status === 'published').length;
    const hiddenCount = products.filter(p => p.status !== 'published').length;

    return (
        <div className="min-h-screen w-full relative bg-[#050B1E] text-white overflow-x-hidden selection:bg-[#B5945B]/30 selection:text-white">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#B5945B]/15 via-[#D4AF37]/10 to-transparent blur-[150px]" />
                <div className="absolute -bottom-40 -left-40 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#142352]/40 via-[#070F2B]/60 to-transparent blur-[160px]" />
                <div
                    className="absolute inset-0 opacity-[0.1]"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(181, 148, 91, 0.35) 1px, transparent 1px)`,
                        backgroundSize: '36px 36px',
                    }}
                />
            </div>

            {/* Top Navigation Bar */}
            <header className="relative z-20 w-full border-b border-white/10 bg-[#070F2B]/85 backdrop-blur-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-18">
                        {/* Brand Info & Back */}
                        <div className="flex items-center gap-3.5">
                            <Link
                                href="/admin/dashboard"
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold"
                                title="Back to Dashboard"
                            >
                                <ArrowLeft className="w-4 h-4 text-[#B5945B]" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>

                            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#B5945B]/20 to-transparent border border-[#B5945B]/40 flex items-center justify-center relative shadow-sm">
                                <Image
                                    src="/images/logos/zeynix-logo-rbg.png"
                                    alt="Zeynix Logo"
                                    width={28}
                                    height={28}
                                    className="object-contain drop-shadow"
                                    priority
                                />
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-base sm:text-lg font-black tracking-wider text-white font-serif uppercase">
                                        Catalog Control
                                    </h1>
                                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#B5945B]/15 border border-[#B5945B]/30 text-[9px] font-extrabold tracking-widest text-[#B5945B] uppercase">
                                        <ShieldCheck className="w-2.5 h-2.5" />
                                        Inventory Suite
                                    </span>
                                </div>
                                <p className="text-[10px] font-medium text-gray-400">
                                    Add, Hide, Unhide &amp; Manage Luxury Streetwear Drops
                                </p>
                            </div>
                        </div>

                        {/* Top Actions */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link
                                href="/"
                                target="_blank"
                                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B5945B]/40 text-xs font-semibold text-gray-300 hover:text-white transition-all"
                            >
                                <ExternalLink className="w-3.5 h-3.5 text-[#B5945B]" />
                                <span>Live Store</span>
                            </Link>

                            <button
                                onClick={loadProducts}
                                disabled={isLoading}
                                title="Refresh Catalog"
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 text-[#B5945B] ${isLoading ? 'animate-spin' : ''}`} />
                            </button>

                            {viewMode === 'list' ? (
                                <button
                                    onClick={handleStartAdd}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#B5945B] to-[#D4AF37] hover:from-[#A3834E] hover:to-[#B5945B] text-[#070F2B] text-xs font-extrabold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Product</span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleBackToList}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                                >
                                    <ArrowLeft className="w-4 h-4 text-[#B5945B]" />
                                    <span>Back to List</span>
                                </button>
                            )}

                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-200 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Notification Toast */}
            {feedbackMessage && (
                <div className="fixed top-20 right-4 sm:right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md border ${
                        feedbackMessage.type === 'success'
                            ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
                            : 'bg-rose-950/90 border-rose-500/40 text-rose-200'
                    }`}>
                        {feedbackMessage.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span className="text-xs font-bold">{feedbackMessage.text}</span>
                        <button
                            onClick={() => setFeedbackMessage(null)}
                            className="ml-2 text-white/60 hover:text-white cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Workspace */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* View Mode: Add or Edit Form */}
                {viewMode === 'add' || viewMode === 'edit' ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-white/10">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black font-serif uppercase tracking-tight text-white flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-[#B5945B]" />
                                    <span>{viewMode === 'edit' ? 'Edit Luxury Product' : 'Add New Streetwear Piece'}</span>
                                </h2>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {viewMode === 'edit'
                                        ? 'Update pricing, images, sizing availability, or visibility status'
                                        : 'Upload multiple product angles and configure launch pricing & sizing'
                                    }
                                </p>
                            </div>
                            <button
                                onClick={handleBackToList}
                                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
                            >
                                Cancel &amp; Return
                            </button>
                        </div>

                        <ProductForm
                            productId={selectedProductId || undefined}
                            onSuccess={() => {
                                showFeedback(
                                    'success',
                                    viewMode === 'edit'
                                        ? 'Product updated successfully!'
                                        : 'New product created successfully!'
                                );
                                handleBackToList();
                            }}
                        />
                    </div>
                ) : (
                    /* View Mode: Products List */
                    <div className="space-y-6">

                        {/* Top KPI Ribbon */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-[#070F2B]/85 backdrop-blur-xl rounded-2xl p-4 border border-[#B5945B]/25 shadow-lg">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total in Database</div>
                                <div className="text-2xl sm:text-3xl font-black font-serif text-white mt-1">
                                    {pagination.total || products.length}
                                </div>
                                <div className="text-[10px] font-semibold text-[#B5945B] mt-0.5">All drops &amp; editions</div>
                            </div>

                            <div className="bg-[#070F2B]/85 backdrop-blur-xl rounded-2xl p-4 border border-emerald-500/25 shadow-lg">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Live on Store</div>
                                <div className="text-2xl sm:text-3xl font-black font-serif text-white mt-1">
                                    {publishedCount}
                                </div>
                                <div className="text-[10px] font-semibold text-emerald-400/80 mt-0.5">Visible to customers</div>
                            </div>

                            <div className="bg-[#070F2B]/85 backdrop-blur-xl rounded-2xl p-4 border border-amber-500/25 shadow-lg">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Hidden / Draft</div>
                                <div className="text-2xl sm:text-3xl font-black font-serif text-white mt-1">
                                    {hiddenCount}
                                </div>
                                <div className="text-[10px] font-semibold text-amber-400/80 mt-0.5">Hidden from store</div>
                            </div>

                            <div className="bg-gradient-to-br from-[#B5945B]/20 via-[#070F2B] to-[#070F2B] rounded-2xl p-4 border border-[#B5945B]/40 shadow-lg flex flex-col justify-between">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-[#B5945B]">Quick Action</div>
                                <button
                                    onClick={handleStartAdd}
                                    className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-[#B5945B] to-[#D4AF37] hover:from-[#A3834E] hover:to-[#B5945B] text-[#070F2B] text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add New Item</span>
                                </button>
                            </div>
                        </div>

                        {/* Search and Filters Console */}
                        <div className="bg-[#070F2B]/85 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/10 shadow-lg space-y-4">
                            <div className="flex flex-col md:flex-row gap-3">
                                {/* Search Bar */}
                                <div className="relative flex-1">
                                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        placeholder="Search by product title or slug..."
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#B5945B]/60 focus:outline-none text-xs text-white placeholder:text-gray-500 transition-all"
                                    />
                                    {searchInput && (
                                        <button
                                            onClick={() => setSearchInput('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>

                                {/* Visibility Status Filter */}
                                <div className="w-full md:w-56">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white focus:border-[#B5945B]/60 focus:outline-none cursor-pointer"
                                    >
                                        <option value="all" className="bg-[#070F2B] text-white">All Statuses</option>
                                        <option value="published" className="bg-[#070F2B] text-white">🟢 Live on Store (Published)</option>
                                        <option value="draft" className="bg-[#070F2B] text-white">🟡 Hidden from Store (Draft)</option>
                                        <option value="archived" className="bg-[#070F2B] text-white">📦 Archived</option>
                                    </select>
                                </div>

                                {/* Category Filter */}
                                <div className="w-full md:w-52">
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white focus:border-[#B5945B]/60 focus:outline-none cursor-pointer"
                                    >
                                        <option value="all" className="bg-[#070F2B] text-white">All Categories</option>
                                        <option value="casual" className="bg-[#070F2B] text-white">Streetwear / Casual</option>
                                        <option value="unisex" className="bg-[#070F2B] text-white">Unisex</option>
                                        <option value="t-shirts" className="bg-[#070F2B] text-white">T-Shirts</option>
                                        <option value="formal" className="bg-[#070F2B] text-white">Formal</option>
                                        <option value="ethnic" className="bg-[#070F2B] text-white">Ethnic</option>
                                        <option value="sports" className="bg-[#070F2B] text-white">Sports</option>
                                    </select>
                                </div>
                            </div>

                            {/* Active Filter Indicators */}
                            {(statusFilter !== 'all' || categoryFilter !== 'all' || searchInput) && (
                                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 text-xs text-gray-400">
                                    <span className="font-bold">Active filters:</span>
                                    {searchInput && (
                                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[10px]">
                                            Query: &quot;{searchInput}&quot;
                                        </span>
                                    )}
                                    {statusFilter !== 'all' && (
                                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[10px]">
                                            Status: {statusFilter}
                                        </span>
                                    )}
                                    {categoryFilter !== 'all' && (
                                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[10px]">
                                            Category: {categoryFilter}
                                        </span>
                                    )}
                                    <button
                                        onClick={() => {
                                            setSearchInput('');
                                            setStatusFilter('all');
                                            setCategoryFilter('all');
                                        }}
                                        className="text-[#B5945B] hover:underline ml-auto font-bold cursor-pointer text-[11px]"
                                    >
                                        Reset all filters
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Products Content Display */}
                        {isLoading ? (
                            <div className="py-20 text-center bg-[#070F2B]/60 rounded-3xl border border-white/5">
                                <div className="w-10 h-10 border-2 border-[#B5945B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">Loading Atelier Products...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="py-16 text-center bg-[#070F2B]/60 rounded-3xl border border-white/10 p-8">
                                <Package className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                                <h3 className="text-base font-bold text-white font-serif uppercase">No products match your criteria</h3>
                                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                                    Try clearing your search or filters to see all pieces in the catalog.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchInput('');
                                        setStatusFilter('all');
                                        setCategoryFilter('all');
                                    }}
                                    className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-all cursor-pointer"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {products.map((product) => {
                                    const isLive = product.status === 'published';
                                    const isActing = actionLoadingId === product._id;
                                    const mainImg = (product.images && product.images.length > 0)
                                        ? product.images[0]
                                        : '/images/products/placeholder.jpg';

                                    return (
                                        <div
                                            key={product._id}
                                            className={`rounded-2xl bg-[#070F2B]/90 border transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-lg ${
                                                isLive
                                                    ? 'border-white/10 hover:border-[#B5945B]/60 hover:shadow-[0_10px_30px_rgba(181,148,91,0.15)]'
                                                    : 'border-amber-500/30 opacity-80 hover:opacity-100 hover:border-amber-500/60'
                                            }`}
                                        >
                                            {/* Top Preview Frame */}
                                            <div className="relative aspect-[4/5] bg-[#0E1630] overflow-hidden flex items-center justify-center p-3">
                                                <img
                                                    src={mainImg}
                                                    alt={product.title}
                                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/images/logos/zeynix-logo-rbg.png';
                                                    }}
                                                />

                                                {/* Live / Hidden Badge */}
                                                <div className="absolute top-2.5 left-2.5 z-10">
                                                    {isLive ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 shadow-sm backdrop-blur-md">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                            Live on Store
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-950/90 text-amber-300 border border-amber-500/40 shadow-sm backdrop-blur-md">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                            Hidden from Store
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Fit Badge */}
                                                <div className="absolute top-2.5 right-2.5 z-10">
                                                    <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-black/75 text-[#B5945B] border border-white/10 backdrop-blur-md">
                                                        {product.productFit || 'OVERSIZED'}
                                                    </span>
                                                </div>

                                                {/* Image count pill */}
                                                {product.images && product.images.length > 1 && (
                                                    <div className="absolute bottom-2 right-2 z-10">
                                                        <span className="px-2 py-0.5 rounded-md text-[8px] font-bold text-gray-300 bg-black/60 backdrop-blur-xs">
                                                            {product.images.length} angles
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                                <div>
                                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                                        <span>{product.brand || 'ZEYNIX'}</span>
                                                        <span className="text-[#B5945B] capitalize">{product.category}</span>
                                                    </div>

                                                    <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-[#B5945B] transition-colors" title={product.title}>
                                                        {product.title}
                                                    </h3>

                                                    {/* Pricing */}
                                                    <div className="flex items-baseline gap-2 mt-2">
                                                        <span className="text-sm font-black text-white font-mono">
                                                            ₹{(product.discountPrice || product.actualPrice || 0).toLocaleString('en-IN')}
                                                        </span>
                                                        {product.actualPrice > (product.discountPrice || 0) && (
                                                            <>
                                                                <span className="text-[11px] line-through text-gray-500 font-mono">
                                                                    ₹{product.actualPrice.toLocaleString('en-IN')}
                                                                </span>
                                                                <span className="text-[10px] font-bold text-emerald-400">
                                                                    {product.discount}% OFF
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Sizing Stock Pills */}
                                                    {product.sizes && product.sizes.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-2.5">
                                                            {product.sizes.map((s, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className={`px-1.5 py-0.5 rounded text-[8px] font-bold font-mono border ${
                                                                        s.inStock !== false
                                                                            ? 'bg-white/5 border-white/15 text-gray-300'
                                                                            : 'bg-red-950/30 border-red-500/20 text-red-400 line-through'
                                                                    }`}
                                                                >
                                                                    {s.size}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Controls */}
                                                <div className="pt-3 border-t border-white/10 space-y-2">
                                                    {/* Hide / Show Toggle Button */}
                                                    <button
                                                        onClick={() => handleToggleVisibility(product._id!, product.status, product.title)}
                                                        disabled={isActing}
                                                        className={`w-full py-2 px-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 ${
                                                            isLive
                                                                ? 'bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300'
                                                                : 'bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300'
                                                        }`}
                                                    >
                                                        {isActing ? (
                                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                                        ) : isLive ? (
                                                            <>
                                                                <EyeOff className="w-3.5 h-3.5" />
                                                                <span>Hide from Store</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Eye className="w-3.5 h-3.5" />
                                                                <span>Make Live on Store</span>
                                                            </>
                                                        )}
                                                    </button>

                                                    {/* Edit & Delete Actions */}
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button
                                                            onClick={() => handleStartEdit(product._id!)}
                                                            className="py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-gray-300 hover:text-white flex items-center justify-center gap-1 transition-all cursor-pointer"
                                                        >
                                                            <Edit3 className="w-3 h-3 text-[#B5945B]" />
                                                            <span>Edit</span>
                                                        </button>

                                                        <button
                                                            onClick={() => setProductToDelete({ id: product._id!, title: product.title })}
                                                            className="py-1.5 px-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-[11px] font-bold text-red-300 hover:text-white flex items-center justify-center gap-1 transition-all cursor-pointer"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                            <span>Delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pagination Bar */}
                        {pagination.pages > 1 && (
                            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
                                <span className="text-gray-400">
                                    Page <strong className="text-white">{pagination.page}</strong> of <strong className="text-white">{pagination.pages}</strong> ({pagination.total} products)
                                </span>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            if (pagination.page > 1 && user) {
                                                getAllProducts(user.id, {
                                                    page: pagination.page - 1,
                                                    status: statusFilter,
                                                    category: categoryFilter,
                                                    search: searchInput,
                                                    limit: 12
                                                });
                                            }
                                        }}
                                        disabled={pagination.page <= 1}
                                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all disabled:opacity-40 cursor-pointer"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={() => {
                                            if (pagination.page < pagination.pages && user) {
                                                getAllProducts(user.id, {
                                                    page: pagination.page + 1,
                                                    status: statusFilter,
                                                    category: categoryFilter,
                                                    search: searchInput,
                                                    limit: 12
                                                });
                                            }
                                        }}
                                        disabled={pagination.page >= pagination.pages}
                                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all disabled:opacity-40 cursor-pointer"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Delete Confirmation Modal */}
            {productToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md rounded-3xl bg-[#070F2B] border border-red-500/30 p-6 shadow-2xl space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-base font-bold text-white font-serif uppercase">
                                Permanently Delete Product?
                            </h3>
                            <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                                Are you sure you want to delete <strong className="text-white">&quot;{productToDelete.title}&quot;</strong>? This action cannot be reversed.
                            </p>
                            <p className="text-[11px] text-[#B5945B] mt-2 font-medium">
                                Tip: If you only want to temporarily hide it from customers, click &quot;Hide from Store&quot; instead.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                onClick={() => setProductToDelete(null)}
                                className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-gray-300 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={Boolean(actionLoadingId)}
                                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-black uppercase tracking-wider text-white transition-all cursor-pointer shadow-md disabled:opacity-50"
                            >
                                {actionLoadingId ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="relative z-20 w-full px-6 py-6 text-center border-t border-white/5 mt-12">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">
                    Zeynix Atelier • Catalog Control Console • Wear The Luxury
                </p>
            </footer>
        </div>
    );
}

