import { create } from "zustand";
import { useProductsStore, type Product } from "./useProductsStore";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface UpdateProductState {
    isUpdating: boolean;
    error: string | null;
    updateProduct: (id: string, data: FormData) => Promise<boolean>;
}

export const useUpdateProductStore = create<UpdateProductState>((set) => ({
    isUpdating: false,
    error: null,

    updateProduct: async (id: string, data: FormData) => {
        set({ isUpdating: true, error: null });

        try {
            const res = await fetch(`${BASE_URL}/api/products/${id}`, {
                method: "PUT",
                body: data,
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || "Failed to update product");
            }

            let updated: Product | null = null;

            try {
                const json = await res.json();
                updated = (json?.product ?? json) as Product;
            } catch {
                updated = null;
            }

            if (updated && updated._id) {
                const { products, setProducts } = useProductsStore.getState();
                setProducts(
                    products.map((p) => (p._id === updated._id ? updated : p))
                );
            }

            return true;
        } catch (err) {
            set({
                error:
                    err instanceof Error ? err.message : "Unknown error while updating",
            });
            return false;
        } finally {
            set({ isUpdating: false });
        }
    },
}));
