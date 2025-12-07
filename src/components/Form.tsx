import { useNavigate } from "react-router-dom";
import { useProductForm } from "../hooks/useProductForm";
import { useCreateProductStore } from "../store/useCreateProductStore";

function Form() {
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
        validate,
        buildFormData,
    } = useProductForm();

    const { isCreating, error, createProduct } = useCreateProductStore();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationError = validate();
        if (validationError) {
            alert(validationError);
            return;
        }

        const formData = buildFormData();

        const ok = await createProduct(formData);
        if (ok) {
            navigate("/");
        } else if (error) {
            alert(error);
        } else {
            alert("Failed to create product.");
        }
    };

    return (
        <div>
            <form
                className="flex flex-col gap-2 max-w-[1200px] mx-auto add-form"
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
                    <option value="">Category</option>
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
                    <option value="">Status</option>
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

                <input
                    type="file"
                    required
                    onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setImage(file);
                    }}
                />

                <button
                    className="bg-blue-600 hover:bg-blue-700 transition-all p-4 rounded-2xl text-[15px] font-bold text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isCreating}
                >
                    {isCreating ? "Adding..." : "Add product"}
                </button>

                {error && (
                    <p className="text-red-500 text-sm mt-1">
                        {error}
                    </p>
                )}
            </form>
        </div>
    );
}

export default Form;
