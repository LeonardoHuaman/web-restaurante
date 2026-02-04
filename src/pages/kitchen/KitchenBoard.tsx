import { useState, useMemo } from "react";
import {
    useKitchenStore,
    KitchenOrderGroup,
    KitchenReadyGroup,
} from "../../stores/kitchenStore";
import KitchenColumn from "./KitchenColumn";
import KitchenOrderModal from "./KitchenOrderModal";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat } from "lucide-react";

export default function KitchenBoard() {
    const orders = useKitchenStore((s) => s.orders);
    const [selected, setSelected] = useState<KitchenOrderGroup | null>(null);

    // 1. OPTIMIZACIÓN CON USEMEMO
    // Solo recalculamos si 'orders' cambia.
    const pendingOrders = useMemo(() => {
        return orders
            .map((o) => ({
                ...o,
                items: o.items.filter((i) => i.status === "por_preparar"),
            }))
            .filter((o) => o.items.length > 0)
            .sort(
                (a, b) =>
                    new Date(a.items[0].created_at).getTime() -
                    new Date(b.items[0].created_at).getTime()
            );
    }, [orders]);

    const cookingOrders = useMemo(() => {
        return orders
            .map((o) => ({
                ...o,
                items: o.items.filter((i) => i.status === "en_cocina"),
            }))
            .filter((o) => o.items.length > 0)
            .sort(
                (a, b) =>
                    new Date(a.items[0].created_at).getTime() -
                    new Date(b.items[0].created_at).getTime()
            );
    }, [orders]);

    const readyGroups = useMemo((): KitchenReadyGroup[] => {
        const map = new Map<number, KitchenReadyGroup>();

        orders.forEach((order) => {
            const readyItems = order.items.filter((i) => i.status === "listo");
            if (readyItems.length === 0) return;

            const table = order.table_number;
            if (!map.has(table)) {
                map.set(table, {
                    table_number: table,
                    items: [],
                    total: 0,
                });
            }

            const group = map.get(table)!;
            readyItems.forEach((item) => {
                group.items.push(item);
                group.total += item.price * item.quantity;
            });
        });

        return Array.from(map.values()).sort((a, b) => {
            // Protección por si items está vacío (aunque el filtro lo previene)
            const dateA = a.items[0]?.created_at ? new Date(a.items[0].created_at).getTime() : 0;
            const dateB = b.items[0]?.created_at ? new Date(b.items[0].created_at).getTime() : 0;
            return dateA - dateB;
        });
    }, [orders]);

    // 2. ESTADO VACÍO (Empty State)
    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-slate-400">
                <div className="bg-slate-100 p-8 rounded-full mb-4 animate-pulse">
                    <ChefHat size={64} className="text-slate-300" />
                </div>
                <h2 className="text-2xl font-bold text-slate-600">Todo tranquilo por ahora</h2>
                <p>No hay comandas activas en cocina.</p>
            </div>
        );
    }

    return (
        <>
            <div className="h-full flex flex-col">
                {/* 3. ANIMACIONES DE LAYOUT */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-8 pb-10 items-start"
                >
                    <KitchenColumn
                        title="Por Preparar"
                        status="por_preparar"
                        orders={pendingOrders} // Pasamos la variable memoizada
                        onOpen={setSelected}
                        accentColor="border-t-red-500" // Diferenciación visual
                    />

                    <KitchenColumn
                        title="En Cocina"
                        status="en_cocina"
                        orders={cookingOrders} // Pasamos la variable memoizada
                        onOpen={setSelected}
                        accentColor="border-t-orange-500"
                    />

                    <KitchenColumn
                        title="Listos para Servir"
                        status="listo"
                        readyGroups={readyGroups} // Pasamos la variable memoizada
                        accentColor="border-t-green-500"
                    />
                </motion.div>
            </div>

            <AnimatePresence>
                {selected && (
                    <KitchenOrderModal
                        order={selected}
                        onClose={() => setSelected(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}