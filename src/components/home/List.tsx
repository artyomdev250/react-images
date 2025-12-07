import { useEffect } from "react";
import { Link } from "react-router-dom";
import { IconContext } from "react-icons";
import { useQuery } from "@tanstack/react-query";

import { MdModeEditOutline } from "react-icons/md";
import { PiTrashFill, PiCheckCircleFill, PiXCircleFill } from "react-icons/pi";

import { useProductsStore, type Product } from "../../store/useProductsStore";
import { useDeleteProductStore } from "../../store/useDeleteProductStore";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const fetchProducts = async (): Promise<Product[]> => {
    const res = await fetch(`${BASE_URL}/api/products`);
    if (!res.ok) {
        throw new Error("Failed to fetch products");
    }
    return res.json();
};

function List() {
    const products = useProductsStore((state) => state.products);
    const setProducts = useProductsStore((state) => state.setProducts);

    const { deleteProduct, isDeleting, error: deleteError } =
        useDeleteProductStore();

    const { data, isLoading, isError, error } = useQuery<Product[], Error>({
        queryKey: ["products"],
        queryFn: fetchProducts,
    });

    useEffect(() => {
        if (data) {
            setProducts(data);
        }
    }, [data, setProducts]);

    if (isLoading) {
        return <div>Loading products...</div>;
    }

    if (isError) {
        return (
            <div className="text-red-500">
                {error.message}
            </div>
        );
    }

    return (
        <div>
            {deleteError && (
                <div className="mb-2 text-sm text-red-500">
                    Failed to delete product: {deleteError}
                </div>
            )}

            <table className="w-full border-separate border-spacing-y-2">
                <thead>
                    <tr className="bg-white text-[#656575] text-[15px] text-left">
                        <th className="py-3 px-4 min-w-[170px]">Product Name/SKU</th>
                        <th className="py-2 px-5">Created At</th>
                        <th className="py-3 px-4">Brand</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Available Quantity</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => {
                        const createdAt = new Date(product.createdAt).toLocaleDateString(
                            "en-US",
                            {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            }
                        );

                        return (
                            <tr key={product._id} className="bg-white text-[15px] text-left">
                                <td className="py-3 px-4 min-w-[170px] flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full overflow-hidden">
                                        {product.imageUrl && (
                                            <img
                                                className="w-full h-full object-cover"
                                                src={product.imageUrl}
                                                alt={product.name}
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold">{product.name}</p>
                                        <p className="text-[#9A9AAF]">{product.sku}</p>
                                    </div>
                                </td>
                                <td className="py-2 px-5">{createdAt}</td>
                                <td className="py-2 px-5">{product.brand}</td>
                                <td className="py-2 px-5">{product.category}</td>
                                <td className="py-2 px-5">{product.availableQuantity}</td>
                                <td className="py-2 px-5">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={
                                                product.status === "Active"
                                                    ? "text-[#34C759] flex items-center gap-1"
                                                    : "text-[#FF383C] flex items-center gap-1"
                                            }
                                        >
                                            <IconContext.Provider
                                                value={{
                                                    className:
                                                        product.status === "Active"
                                                            ? "text-[20px] text-[#34C759]"
                                                            : "text-[20px] text-[#FF383C]",
                                                }}
                                            >
                                                {product.status === "Active" ? (
                                                    <PiCheckCircleFill />
                                                ) : (
                                                    <PiXCircleFill />
                                                )}
                                            </IconContext.Provider>

                                            {product.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-2 px-5 font-bold">${product.price}</td>
                                <td className="py-2 px-5">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link to={`/edit/${product._id}`} className="icon">
                                            <IconContext.Provider value={{ className: "text-[20px] text-blue-600" }}>
                                                <MdModeEditOutline />
                                            </IconContext.Provider>
                                        </Link>
                                        <button
                                            className="icon disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => deleteProduct(product._id)}
                                            disabled={isDeleting}
                                        >
                                            <IconContext.Provider
                                                value={{ className: "text-[20px] text-red-600" }}
                                            >
                                                <PiTrashFill />
                                            </IconContext.Provider>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default List;
