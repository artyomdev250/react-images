import { useState, useCallback } from "react";
import type { Product } from "../store/useProductsStore";

export const useEditProductForm = () => {
    const [name, setName] = useState("");
    const [sku, setSku] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [status, setStatus] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState<File | null>(null);

    // Only integers
    const handleQuantityChange = (value: string) => {
        if (/^\d*$/.test(value)) {
            setQuantity(value);
        }
    };

    // Number or number with dot
    const handlePriceChange = (value: string) => {
        if (/^\d*\.?\d*$/.test(value)) {
            setPrice(value);
        }
    };

    // hydrate the form from existing product
    const hydrateFromProduct = useCallback((product: Product) => {
        setName(product.name);
        setSku(product.sku);
        setBrand(product.brand);
        setCategory(product.category);
        setQuantity(String(product.availableQuantity));
        setStatus(product.status);
        setPrice(String(product.price));
        // image is left null – user can pick a new one if they want to change it
    }, []);

    const validate = (): string | null => {
        if (!name || !sku || !brand || !category || !status || !quantity || !price) {
            return "Please fill in all fields and choose Category and Status.";
        }

        if (!/^\d+$/.test(quantity)) {
            return "Quantity must be a whole number (no dots or commas).";
        }

        if (!/^\d+(\.\d+)?$/.test(price)) {
            return "Price must be a number or a number with a dot (e.g. 10 or 10.99).";
        }

        // image is OPTIONAL for edit – if present, it will be sent
        return null;
    };

    const buildFormData = () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("sku", sku);
        formData.append("brand", brand);
        formData.append("category", category);
        formData.append("availableQuantity", quantity);
        formData.append("status", status);
        formData.append("price", price);

        if (image) {
            // same field name as in your Postman: "image"
            formData.append("image", image);
        }

        return formData;
    };

    return {
        // state
        name,
        sku,
        brand,
        category,
        quantity,
        status,
        price,
        image,

        // setters
        setName,
        setSku,
        setBrand,
        setCategory,
        setStatus,
        setImage,

        // handlers
        handleQuantityChange,
        handlePriceChange,

        // helpers
        hydrateFromProduct,
        validate,
        buildFormData,
    };
};
