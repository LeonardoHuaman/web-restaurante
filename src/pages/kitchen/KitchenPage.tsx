import { useEffect, useState } from "react";
import KitchenBoard from "./KitchenBoard";
import { supabase } from "../../services/supabaseClient";
import { useKitchenStore, OrderItem, KitchenOrderGroup } from "../../stores/kitchenStore";
import { subscribeKitchenRealtime } from "../../services/kitchenRealtime";
import { Clock } from "lucide-react";

export default function KitchenPage() {
    const setOrders = useKitchenStore((s) => s.setOrders);
    const [currentTime, setCurrentTime] = useState(new Date());

    // 1. Reloj
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // 2. Carga de Datos
    useEffect(() => {
        const load = async () => {
            const { data } = await supabase.from("kitchen_order_items").select("*");
            if (!data) return;

            const typed = data as OrderItem[];
            const grouped: KitchenOrderGroup[] = Object.values(
                typed.reduce((acc, item) => {
                    acc[item.order_id] ??= {
                        order_id: item.order_id,
                        table_number: item.table_number,
                        items: [],
                    };
                    acc[item.order_id].items.push(item);
                    return acc;
                }, {} as Record<string, KitchenOrderGroup>)
            );
            setOrders(grouped);
        };

        load();
        const channel = subscribeKitchenRealtime();
        return () => { supabase.removeChannel(channel); };
    }, []);

    return (
        // Quitamos bg-white. Dejamos que herede el color del Layout.
        <div className="h-full flex flex-col">

            {/* === ENCABEZADO LIMPIO (Sin fondo, sin bordes extra) === */}
            <div className="px-4 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">

                {/* Izquierda: Título y Texto recuperado */}
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            Progreso de Pedidos
                        </h1>

                        {/* Badge "En Vivo" integrado al título */}
                        <div className="flex items-center gap-2 px-2 py-0.5 bg-red-100/50 border border-red-200 rounded-full self-center">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                            </span>
                            <span className="text-[10px] font-bold text-red-600 tracking-wider uppercase">
                                En Vivo
                            </span>
                        </div>
                    </div>

                    {/* ✅ TEXTO RECUPERADO */}
                    <p className="text-sm sm:text-base text-gray-500">
                        Prioriza los tickets críticos para asegurar la calidad.
                    </p>
                </div>

                {/* Derecha: Reloj (Discreto) */}
                <div className="hidden sm:flex items-center gap-2 text-gray-400 bg-white/60 px-3 py-1.5 rounded-lg border border-gray-200/50 shadow-sm">
                    <Clock size={16} />
                    <span className="font-mono text-base font-semibold text-gray-600">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>

            {/* === EL TABLERO === */}
            <div className="flex-1 overflow-hidden px-4 sm:px-6 pb-4">
                <KitchenBoard />
            </div>
        </div>
    );
}