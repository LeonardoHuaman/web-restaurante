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
        <div
            className="
                rounded-3xl bg-white border border-gray-200
                overflow-x-auto
                -mx-3 sm:mx-0
            "
        >
            <table className="min-w-[720px] w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                            Producto
                        </th>

                        <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                            Categorías
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                            Precio
                        </th>

                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">
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
                            className="
                                border-b border-gray-100
                                hover:bg-gray-50
                                cursor-pointer
                                transition
                            "
                        >
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3 min-w-[220px]">
                                    <img
                                        src={p.image_url}
                                        alt={p.name}
                                        className="
                                            w-11 h-11 rounded-xl
                                            object-cover
                                            border border-gray-200
                                            shrink-0
                                        "
                                    />
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">
                                            {p.name}
                                        </p>
                                        <p className="hidden sm:block text-xs text-gray-500 line-clamp-1">
                                            {p.description}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            <td className="hidden sm:table-cell px-4 py-3">
                                <div className="flex flex-wrap gap-2">
                                    {p.categories.map((cat) => (
                                        <span
                                            key={cat}
                                            className="
                                                inline-flex items-center
                                                px-3 py-1
                                                rounded-full
                                                text-xs font-semibold
                                                bg-indigo-50 text-indigo-700
                                                border border-indigo-200
                                            "
                                        >
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </td>

                            <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                                S/ {p.price.toFixed(2)}
                            </td>

                            <td
                                className="px-4 py-3 text-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() =>
                                        onToggleActive(p.id, p.is_active)
                                    }
                                    className={`
                                        relative inline-flex h-6 w-11
                                        items-center rounded-full transition
                                        ${p.is_active
                                            ? "bg-emerald-500"
                                            : "bg-gray-300"}
                                    `}
                                >
                                    <span
                                        className={`
                                            inline-block h-5 w-5
                                            transform rounded-full bg-white
                                            transition
                                            ${p.is_active
                                                ? "translate-x-5"
                                                : "translate-x-1"}
                                        `}
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
