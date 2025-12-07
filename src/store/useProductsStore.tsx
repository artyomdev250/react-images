import { create } from "zustand";

export interface Product {
    _id: string;
    name: string;
    sku: string;
    brand: string;
    category: string;
    availableQuantity: number;
    status: string;
    price: number;
    imageUrl: string;
    createdAt: string;
}

interface ProductsState {
    products: Product[];
    setProducts: (products: Product[]) => void;
}

export const useProductsStore = create<ProductsState>((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
}));
