import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { OrderItem } from "../../stores/kitchenStore";
import { ChefHat, Check, Loader2 } from "lucide-react";

export default function KitchenItemRow({ item }: { item: OrderItem }) {
    const [loading, setLoading] = useState(false);

    const next =
        item.status === "por_preparar"
            ? "en_cocina"
            : item.status === "en_cocina"
                ? "listo"
                : null;

    const advance = async () => {
        if (!next || loading) return;

        setLoading(true);

        const { error } = await supabase
            .from("order_items")
            .update({ status: next })
            .eq("id", item.id);

        if (error) {
            console.error("Error al actualizar", error);
            setLoading(false);
        }
    };

    // Configuración visual según el estado
    const buttonConfig = item.status === "por_preparar"
        ? {
            color: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100",
            icon: ChefHat
        }
        : {
            color: "bg-green-50 text-green-600 border-green-200 hover:bg-green-100",
            icon: Check
        };

    const Icon = buttonConfig.icon;

    return (
        <div className="flex justify-between items-center py-3 border-b border-dashed border-gray-200 last:border-0">
            <div className="flex gap-3 pr-2 items-center">
                {/* Cantidad Resaltada (Fondo oscuro para lectura rápida) */}
                <div className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-lg bg-slate-800 text-white font-bold text-lg leading-none shadow-sm">
                    {item.quantity}
                </div>

                {/* Nombre del Producto */}
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-lg leading-tight">
                        {item.product_name}
                    </span>
                    {/* Eliminamos la sección de notas para evitar errores */}
                </div>
            </div>

            {next && (
                <button
                    onClick={advance}
                    disabled={loading}
                    className={`
                        h-12 w-12 flex-shrink-0 flex items-center justify-center 
                        rounded-xl border transition-all duration-200
                        ${buttonConfig.color}
                        ${loading ? "opacity-50 cursor-not-allowed scale-95" : "active:scale-95 shadow-sm"}
                    `}
                >
                    {loading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <Icon size={22} strokeWidth={2.5} />
                    )}
                </button>
            )}
        </div>
    );
}