import {
    AlertTriangle,
    Clock,
    ChefHat,
    Utensils,
    CheckCircle2,
} from "lucide-react";
import { KitchenOrderGroup, OrderItem } from "../../stores/kitchenStore";
import {
    minutesBetween,
    getUrgency,
    formatElapsed,
} from "../../utils/kitchen";
import { supabase } from "../../services/supabaseClient";

type Props = {
    order: KitchenOrderGroup;
    status: "por_preparar" | "en_cocina";
    onOpen: (order: KitchenOrderGroup) => void;
};

export default function KitchenOrderCard({ order, status, onOpen }: Props) {
    // ⏱️ usar el ITEM MÁS NUEVO
    const minutes = Math.max(
        ...order.items.map((i) => minutesBetween(i.created_at))
    );

    const urgency = getUrgency(minutes);

    const urgencyConfig = {
        nuevo: {
            label: "Nuevo",
            bar: "bg-green-500",
            badge: "bg-green-100 text-green-700",
            ring: "",
            icon: CheckCircle2,
        },
        en_tiempo: {
            label: "En tiempo",
            bar: "bg-amber-500",
            badge: "bg-amber-100 text-amber-700",
            ring: "",
            icon: Clock,
        },
        critico: {
            label: "Crítico",
            bar: "bg-red-500",
            badge: "bg-red-100 text-red-700",
            ring: "animate-critical ring-2 ring-red-400",
            icon: AlertTriangle,
        },
    } as const;

    const cfg = urgencyConfig[urgency];
    const StatusIcon = cfg.icon;

    const advanceItem = async (item: OrderItem) => {
        const next = status === "por_preparar" ? "en_cocina" : "listo";

        await supabase
            .from("order_items")
            .update({ status: next })
            .eq("id", item.id);
    };

    return (
        <div
            onClick={() => onOpen(order)}
            className={`rounded-xl bg-white shadow-sm overflow-hidden cursor-pointer ${cfg.ring}`}
        >
            {/* BARRA SUPERIOR */}
            <div className={`h-2 ${cfg.bar}`} />

            {/* HEADER */}
            <div className="p-3 flex justify-between">
                <div>
                    <h3 className="text-2xl font-extrabold">
                        M-{order.table_number}
                    </h3>
                    <span className="text-xs text-gray-400">MESA</span>
                </div>

                <div className="flex flex-col items-end gap-1">
                    <span
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.badge}`}
                    >
                        <StatusIcon size={12} />
                        {cfg.label}
                    </span>

                    <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={12} />
                        {formatElapsed(minutes)}
                    </span>
                </div>
            </div>

            {/* ITEMS */}
            <div className="px-3">
                {order.items.map((item, index) => (
                    <div
                        key={item.id}
                        className={`flex justify-between items-center py-3 ${index !== order.items.length - 1
                            ? "border-b border-dashed border-gray-300"
                            : ""
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <span className="px-2 py-1 rounded-md bg-primary text-orange-500 text-sm font-semibold">
                                {item.quantity}
                            </span>

                            <span className="text-sm font-medium text-gray-800">
                                {item.product_name}
                            </span>
                        </div>

                        {/* 🔴 SOLO ESTE BOTÓN BLOQUEA EL CLICK */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                advanceItem(item);
                            }}
                            className="h-10 w-10 flex items-center justify-center rounded-xl border bg-white hover:bg-gray-50"
                        >
                            {status === "por_preparar" ? (
                                <ChefHat size={18} />
                            ) : (
                                <Utensils size={18} />
                            )}
                        </button>
                    </div>
                ))}
            </div>

            <div className="px-3 py-2 text-xs text-gray-400 border-t">
                {order.items.length} item(s) en esta fase
            </div>
        </div>
    );
}
