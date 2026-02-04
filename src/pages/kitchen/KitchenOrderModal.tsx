import { useState, useEffect } from "react";
import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { KitchenOrderGroup } from "../../stores/kitchenStore";
import { supabase } from "../../services/supabaseClient";
import { motion } from "framer-motion";

type Props = {
    order: KitchenOrderGroup | null;
    onClose: () => void;
};

// Helper para textos bonitos
const formatStatus = (status: string) => {
    switch (status) {
        case "por_preparar": return "Por Preparar";
        case "en_cocina": return "Cocinando";
        case "listo": return "Listo";
        default: return status;
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "por_preparar": return "bg-blue-100 text-blue-700 border-blue-200";
        case "en_cocina": return "bg-orange-100 text-orange-700 border-orange-200";
        case "listo": return "bg-green-100 text-green-700 border-green-200";
        default: return "bg-gray-100 text-gray-600";
    }
};

export default function KitchenOrderModal({ order, onClose }: Props) {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [confirmCancel, setConfirmCancel] = useState(false);

    // Resetear confirmación si cambian de orden
    useEffect(() => {
        setConfirmCancel(false);
    }, [order]);

    if (!order) return null;

    // Borrar un solo item
    const removeItem = async (id: string) => {
        setDeletingId(id);
        const { error } = await supabase.from("order_items").delete().eq("id", id);
        if (error) {
            console.error(error);
            setDeletingId(null); // Restaurar si falló
        }
        // Si tiene éxito, Supabase realtime actualizará la UI, 
        // pero podemos dejar el loading un momento o esperar el refresh del store
    };

    // Cancelar orden completa con seguridad
    const handleCancelOrder = async () => {
        if (!confirmCancel) {
            setConfirmCancel(true);
            return;
        }

        setIsCancelling(true);
        await supabase.from("orders").delete().eq("id", order.order_id);
        onClose();
        setIsCancelling(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* BACKDROP (Fondo oscuro borroso) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            />

            {/* MODAL */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
            >
                {/* HEADER */}
                <div className="flex justify-between items-center p-5 border-b bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            Mesa {order.table_number}
                        </h2>
                        <span className="text-sm text-gray-500 font-medium">
                            ID: {order.order_id.slice(0, 8)}...
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* LISTA DE ITEMS */}
                <div className="p-5 space-y-3 overflow-y-auto">
                    {order.items.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            Orden vacía
                        </div>
                    ) : (
                        order.items.map((item) => (
                            <motion.div
                                layout
                                key={item.id}
                                className="flex justify-between items-center bg-white border border-gray-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Cantidad grande */}
                                    <div className="h-10 w-10 bg-slate-800 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                                        {item.quantity}
                                    </div>

                                    <div>
                                        <div className="font-bold text-gray-800 text-lg leading-tight">
                                            {item.product_name}
                                        </div>
                                        {/* Badge de Estado */}
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusColor(item.status)}`}>
                                            {formatStatus(item.status)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeItem(item.id)}
                                    disabled={deletingId === item.id}
                                    className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors disabled:opacity-50"
                                >
                                    {deletingId === item.id ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <Trash2 size={18} />
                                    )}
                                </button>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* FOOTER (Acciones Peligrosas) */}
                <div className="p-5 border-t bg-gray-50">
                    <button
                        onClick={handleCancelOrder}
                        disabled={isCancelling}
                        className={`
                            w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200
                            ${confirmCancel
                                ? "bg-red-600 text-white shadow-lg scale-[1.02] hover:bg-red-700"
                                : "bg-white border border-red-200 text-red-600 hover:bg-red-50"
                            }
                        `}
                    >
                        {isCancelling ? (
                            <Loader2 className="animate-spin" />
                        ) : confirmCancel ? (
                            <>
                                <AlertTriangle size={20} />
                                ¿Confirmar eliminación total?
                            </>
                        ) : (
                            "Cancelar Pedido Completo"
                        )}
                    </button>
                    {confirmCancel && (
                        <p className="text-center text-xs text-red-500 mt-2 font-medium">
                            Pulsa otra vez para confirmar o cierra para cancelar.
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}