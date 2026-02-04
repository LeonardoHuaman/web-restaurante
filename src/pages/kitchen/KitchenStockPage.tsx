import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { CheckCircle2, XCircle, PackageOpen, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
    id: string;
    name: string;
    price: number;
    is_active: boolean;
    image_url?: string;
    description?: string;
};

type CategoryGroup = {
    category: string;
    products: Product[];
};

// Función auxiliar para formatear texto (chef_recommendation -> Chef Recommendation)
const formatCategoryName = (name: string) => {
    if (!name) return "";
    return name
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export default function KitchenStockPage() {
    const [groups, setGroups] = useState<CategoryGroup[]>([]);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from("product_categories")
            .select(`
                products (
                    id, name, price, is_active, image_url, description
                ),
                categories ( name )
            `);

        if (error || !data) return;

        const map = new Map<string, Product[]>();

        data.forEach((row: any) => {
            const category = row.categories.name;
            const product = row.products;

            if (!map.has(category)) map.set(category, []);
            map.get(category)!.push(product);
        });

        setGroups(
            Array.from(map.entries()).map(([category, products]) => ({
                category,
                products,
            }))
        );
    };

    const toggleProduct = async (product: Product) => {
        setLoadingId(product.id);
        // Optimistic UI update (opcional: actualiza visualmente antes de la BD para que se sienta instantáneo)
        // Pero mantendremos tu lógica de fetch para seguridad.

        await supabase
            .from("products")
            .update({ is_active: !product.is_active })
            .eq("id", product.id);

        await fetchProducts();
        setLoadingId(null);
    };

    return (
        <div className="app-safe bg-slate-50 min-h-screen pb-20 bg-primary">
            <div className="px-6 pt-8 max-w-7xl mx-auto">
                <header className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                            Gestión de Stock
                        </h1>
                        <p className="text-slate-500 mt-2 text-lg">
                            Controla la disponibilidad del menú en tiempo real.
                        </p>
                    </div>
                    {/* Indicador de estado general decorativo */}
                    <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-medium text-slate-600">Sistema en línea</span>
                    </div>
                </header>

                <AnimatePresence>
                    {groups.map((group, groupIndex) => (
                        <motion.div
                            key={group.category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: groupIndex * 0.1 }}
                            className="mb-12"
                        >
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-2">
                                <h2 className="text-2xl font-bold text-slate-700">
                                    {/* AQUI ESTA LA SOLUCION DEL PUNTO 1 */}
                                    {formatCategoryName(group.category)}
                                </h2>
                                <span className="text-xs font-semibold bg-slate-200 text-slate-600 px-2 py-1 rounded-md">
                                    {group.products.length} items
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {group.products.map((p) => (
                                    <motion.div
                                        layout
                                        key={p.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`
                                            relative overflow-hidden rounded-2xl border-2 p-5 transition-all duration-300 shadow-sm
                                            ${p.is_active
                                                ? "bg-white border-green-100 shadow-green-100/50"
                                                : "bg-slate-50 border-slate-200 opacity-80"
                                            }
                                        `}
                                    >
                                        {/* Barra de estado lateral */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300 ${p.is_active ? 'bg-green-500' : 'bg-red-400'}`} />

                                        <div className="flex items-start justify-between pl-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className={`font-bold text-lg ${p.is_active ? 'text-slate-800' : 'text-slate-500 line-through decoration-slate-400'}`}>
                                                        {p.name.trim()}
                                                    </h3>
                                                    {p.is_active && (
                                                        <span className="flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-slate-500 font-medium">
                                                    S/ {p.price.toFixed(2)}
                                                </p>
                                            </div>

                                            <div className={`
                                                p-2 rounded-full 
                                                ${p.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}
                                            `}>
                                                {p.is_active ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between pl-2 pt-4 border-t border-dashed border-slate-100">
                                            <span className={`text-xs font-semibold uppercase tracking-wider ${p.is_active ? 'text-green-600' : 'text-red-500'}`}>
                                                {p.is_active ? 'En Stock' : 'Agotado'}
                                            </span>

                                            <button
                                                onClick={() => toggleProduct(p)}
                                                disabled={loadingId === p.id}
                                                className={`
                                                    px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2
                                                    ${p.is_active
                                                        ? "bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300"
                                                        : "bg-slate-800 text-white hover:bg-slate-700 hover:shadow-md"
                                                    }
                                                    ${loadingId === p.id ? "opacity-50 cursor-not-allowed" : ""}
                                                `}
                                            >
                                                {loadingId === p.id ? (
                                                    "..."
                                                ) : p.is_active ? (
                                                    <>
                                                        <AlertCircle size={16} /> Marcar Agotado
                                                    </>
                                                ) : (
                                                    <>
                                                        <PackageOpen size={16} /> Reactivar
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}