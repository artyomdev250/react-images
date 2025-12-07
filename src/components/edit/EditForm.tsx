import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useEditProductForm } from "../../hooks/useEditProductForm";
import { useUpdateProductStore } from "../../store/useUpdateProductStore";
import type { Product } from "../../store/useProductsStore";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const fetchProduct = async (id: string): Promise<Product> => {
    const res = await fetch(`${BASE_URL}/api/products/${id}`);
    if (!res.ok) {
        throw new Error("Failed to fetch product");
    }
    return res.json();
};

interface EditFormProps {
    productId: string;
}

function EditForm({ productId }: EditFormProps) {
    const navigate = useNavigate();

    const {
        name,
        sku,
        brand,
        category,
        quantity,
        status,
        price,
        setName,
        setSku,
        setBrand,
        setCategory,
        setStatus,
        setImage,
        handleQuantityChange,
        handlePriceChange,
        hydrateFromProduct,
        validate,
        buildFormData,
    } = useEditProductForm();

    const { isUpdating, error: updateError, updateProduct } =
        useUpdateProductStore();

    const {
        data,
        isLoading,
        isError,
        error: loadError,
    } = useQuery<Product, Error>({
        queryKey: ["product", productId],
        queryFn: () => fetchProduct(productId),
    });

    useEffect(() => {
        if (data) {
            hydrateFromProduct(data);
        }
    }, [data, hydrateFromProduct]);

    if (isLoading) {
        return <div>Loading product...</div>;
    }

    if (isError) {
        return <div className="text-red-500">{loadError?.message}</div>;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationError = validate();
        if (validationError) {
            alert(validationError);
            return;
        }

        const formData = buildFormData();
        const ok = await updateProduct(productId, formData);
        if (ok) {
            navigate("/");
        } else if (updateError) {
            alert(updateError);
        } else {
            alert("Failed to update product.");
        }
    };

    return (
        <div>
            <form
                className="flex flex-col gap-2 max-w-[1212px] mx-auto add-form"
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    placeholder="Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="SKU"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Brand"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="" disabled>Category</option>
                    <option value="Category 1">Category 1</option>
                    <option value="Category 2">Category 2</option>
                    <option value="Category 3">Category 3</option>
                </select>

                <input
                    type="text"
                    placeholder="Quantity"
                    required
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                />

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                >
                    <option value="" disabled>Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>

                <input
                    type="text"
                    placeholder="Price"
                    required
                    value={price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                />

                {/* image – optional for edit, still sent to Cloudinary if changed */}
                <input
                    type="file"
                    onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setImage(file);
                    }}
                />

                <button
                    className="bg-blue-600 hover:bg-blue-700 transition-all p-4 rounded-2xl text-[15px] font-bold text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isUpdating}
                >
                    {isUpdating ? "Saving..." : "Save changes"}
                </button>

                {updateError && (
                    <p className="text-red-500 text-sm mt-1">{updateError}</p>
                )}
            </form>
        </div>
    );
}

export default EditForm;
