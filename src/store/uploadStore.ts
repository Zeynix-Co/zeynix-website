import { create } from 'zustand';

interface UploadedImage {
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
    original_filename: string;
}

interface UploadState {
    isUploading: boolean;
    uploadProgress: number;
    uploadedImages: UploadedImage[];
    error: string | null;
}

interface UploadActions {
    uploadImage: (file: File, userId: string) => Promise<UploadedImage>;
    uploadMultipleImages: (files: File[], userId: string) => Promise<UploadedImage[]>;
    deleteImage: (publicId: string, userId: string) => Promise<void>;
    clearError: () => void;
    resetUploadState: () => void;
}

const useUploadStore = create<UploadState & UploadActions>((set) => ({
    isUploading: false,
    uploadProgress: 0,
    uploadedImages: [],
    error: null,

    uploadImage: async (file: File, userId: string): Promise<UploadedImage> => {
        try {
            set({ isUploading: true, error: null, uploadProgress: 0 });

            const formData = new FormData();
            formData.append('image', file);
            formData.append('userId', userId);

            const response = await fetch('/api/admin/upload/image', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to upload image');
            }

            if (data.success) {
                const uploadedImage = data.data;
                set(state => ({
                    uploadedImages: [...state.uploadedImages, uploadedImage],
                    isUploading: false,
                    uploadProgress: 100
                }));
                return uploadedImage;
            } else {
                throw new Error(data.message || 'Failed to upload image');
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
            set({ error: errorMessage, isUploading: false, uploadProgress: 0 });
            throw error;
        }
    },

    uploadMultipleImages: async (files: File[], userId: string): Promise<UploadedImage[]> => {
        try {
            set({ isUploading: true, error: null, uploadProgress: 0 });

            const formData = new FormData();
            files.forEach(file => {
                formData.append('images', file);
            });
            formData.append('userId', userId);

            const response = await fetch('/api/admin/upload/multiple', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to upload images');
            }

            if (data.success) {
                const uploadedImages = data.data;
                set(state => ({
                    uploadedImages: [...state.uploadedImages, ...uploadedImages],
                    isUploading: false,
                    uploadProgress: 100
                }));
                return uploadedImages;
            } else {
                throw new Error(data.message || 'Failed to upload images');
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to upload images';
            set({ error: errorMessage, isUploading: false, uploadProgress: 0 });
            throw error;
        }
    },

    deleteImage: async (publicId: string, userId: string): Promise<void> => {
        try {
            set({ error: null });

            const response = await fetch('/api/admin/upload/image', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ public_id: publicId, userId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete image');
            }

            if (data.success) {
                set(state => ({
                    uploadedImages: state.uploadedImages.filter(img => img.public_id !== publicId)
                }));
            } else {
                throw new Error(data.message || 'Failed to delete image');
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete image';
            set({ error: errorMessage });
            throw error;
        }
    },

    clearError: () => set({ error: null }),

    resetUploadState: () => set({
        isUploading: false,
        uploadProgress: 0,
        uploadedImages: [],
        error: null
    }),
}));

export default useUploadStore;
