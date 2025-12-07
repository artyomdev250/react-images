import { useState } from "react";

export const useProductForm = () => {
    const [name, setName] = useState("");
    const [sku, setSku] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [status, setStatus] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const handleQuantityChange = (value: string) => {
        if (/^\d*$/.test(value)) {
            setQuantity(value);
        }
    };

    const handlePriceChange = (value: string) => {
        if (/^\d*\.?\d*$/.test(value)) {
            setPrice(value);
        }
    };

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

        if (!image) {
            return "Please select an image.";
        }

        return null;
    };

    // Build FormData exactly like Postman request
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
            formData.append("image", image);
        }

        return formData;
    };

    return {
        name,
        sku,
        brand,
        category,
        quantity,
        status,
        price,
        image,

        setName,
        setSku,
        setBrand,
        setCategory,
        setStatus,
        setImage,

        handleQuantityChange,
        handlePriceChange,

        validate,
        buildFormData,
    };
};
