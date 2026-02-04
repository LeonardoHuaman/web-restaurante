import { useState } from "react";
import { Clock } from "lucide-react";
import { KitchenReadyGroup } from "../../stores/kitchenStore";
import { minutesBetween, formatElapsed } from "../../utils/kitchen";

type Props = {
    group: KitchenReadyGroup;
};

export default function KitchenReadyCard({ group }: Props) {
    const [open, setOpen] = useState(false);
    const minutes = minutesBetween(group.items[0].created_at);

    /**
     * 🔥 AGRUPAR PRODUCTOS IGUALES
     */
    const groupedItems = Object.values(
        group.items.reduce((acc, item) => {
            const key = item.product_name.trim();

            if (!acc[key]) {
                acc[key] = {
                    product_name: key,
                    quantity: 0,
                };
            }

            acc[key].quantity += item.quantity;
            return acc;
        }, {} as Record<string, { product_name: string; quantity: number }>)
    );

    return (
        <div
            onClick={() => setOpen((v) => !v)}
            className="rounded-xl bg-white shadow-sm overflow-hidden cursor-pointer"
        >
            {/* barra superior */}
            <div className="h-2 bg-green-500" />

            {/* HEADER (SIEMPRE VISIBLE) */}
            <div className="p-4 flex justify-between items-start">
                <div>
                    <h3 className="text-2xl font-extrabold">
                        M-{group.table_number}
                    </h3>
                    <span className="text-xs text-gray-400">
                        {group.items.length} productos listos
                    </span>
                </div>

                <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-600 font-semibold">
                        Total
                    </span>
                    <div className="text-xl font-bold mt-1">
                        S/ {group.total.toFixed(2)}
                    </div>
                </div>
            </div>

            {/* CONTENIDO EXPANDIBLE */}
            {open && (
                <div className="mx-4 mb-4 rounded-xl border bg-gray-50 p-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatElapsed(minutes)}
                        </span>
                        <span className="font-semibold text-orange-500">
                            S/ {group.total.toFixed(2)}
                        </span>
                    </div>

                    {groupedItems.map((item, index) => (
                        <div
                            key={item.product_name}
                            className={`flex items-center gap-2 py-2 ${index !== groupedItems.length - 1
                                ? "border-b border-dashed border-gray-300"
                                : ""
                                }`}
                        >
                            <span className="px-2 py-1 rounded-md bg-primary text-orange-500 text-xs font-semibold">
                                {item.quantity}
                            </span>
                            <span className="text-sm text-gray-700">
                                {item.product_name}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
