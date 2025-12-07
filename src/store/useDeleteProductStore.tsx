import { create } from "zustand";
import { useProductsStore } from "./useProductsStore";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface DeleteProductState {
    isDeleting: boolean;
    error: string | null;
    deleteProduct: (id: string) => Promise<void>;
}

export const useDeleteProductStore = create<DeleteProductState>((set) => ({
    isDeleting: false,
    error: null,

    deleteProduct: async (id: string) => {
        set({ isDeleting: true, error: null });

        try {
            const res = await fetch(`${BASE_URL}/api/products/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete product");
            }

            useProductsStore.getState().removeProduct(id);
        } catch (err) {
            set({
                error:
                    err instanceof Error ? err.message : "Unknown error while deleting",
            });
        } finally {
            set({ isDeleting: false });
        }
    },
}));
