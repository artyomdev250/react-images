import { create } from "zustand";
import { useProductsStore, type Product } from "./useProductsStore";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface CreateProductState {
    isCreating: boolean;
    error: string | null;
    createProduct: (data: FormData) => Promise<boolean>;
}

export const useCreateProductStore = create<CreateProductState>((set) => ({
    isCreating: false,
    error: null,

    createProduct: async (data: FormData) => {
        set({ isCreating: true, error: null });

        try {
            const res = await fetch(`${BASE_URL}/api/products`, {
                method: "POST",
                body: data,
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || "Failed to create product");
            }

            const json = await res.json();

            const newProduct: Product = json.product || json;

            const { products, setProducts } = useProductsStore.getState();
            setProducts([...products, newProduct]);

            return true;
        } catch (err) {
            set({
                error:
                    err instanceof Error ? err.message : "Unknown error while creating product",
            });
            return false;
        } finally {
            set({ isCreating: false });
        }
    },
}));
