// src/components/admin/ProductsTable.tsx
import { motion } from "framer-motion";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    is_active: boolean;
    categories: string[];
}

interface Props {
    products: Product[];
    onToggleActive: (id: string, current: boolean) => void;
    onSelect: (product: Product) => void;
}

const ProductsTable = ({ products, onToggleActive, onSelect }: Props) => {
    return (
        <div className="rounded-3xl bg-white border border-gray-200 overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                            Producto
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                            Categorías
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                            Precio
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">
                            Estado
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((p) => (
                        <motion.tr
                            key={p.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.15 }}
                            onClick={() => onSelect(p)}
                            className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                        >
                            {/* PRODUCTO */}
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={p.image_url}
                                        alt={p.name}
                                        className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {p.name}
                                        </p>
                                        <p className="text-xs text-gray-500 line-clamp-1">
                                            {p.description}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            {/* CATEGORÍAS */}
                            <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-2">
                                    {p.categories.map((cat) => (
                                        <span
                                            key={cat}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
                                        >
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </td>

                            {/* PRECIO */}
                            <td className="px-6 py-4 font-semibold text-gray-900">
                                S/ {p.price.toFixed(2)}
                            </td>

                            {/* STATUS TOGGLE */}
                            <td
                                className="px-6 py-4 text-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() =>
                                        onToggleActive(p.id, p.is_active)
                                    }
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${p.is_active
                                        ? "bg-emerald-500"
                                        : "bg-gray-300"
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${p.is_active
                                            ? "translate-x-5"
                                            : "translate-x-1"
                                            }`}
                                    />
                                </button>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductsTable;
