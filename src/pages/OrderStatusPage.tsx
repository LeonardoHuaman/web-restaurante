// src/pages/OrderStatusPage.tsx
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { usePartyStore } from "../stores/partyStore";
import {
    X,
    Receipt,
    Clock,
    CheckCircle2,
    Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Order {
    id: string;
    status: "generado" | "en_curso" | "finalizado";
    total: number;
    created_at: string;
}

interface OrderItem {
    product_id: string;
    quantity: number;
    price: number;
    products: {
        name: string;
        image_url?: string;
    };
}

const statusConfig = {
    generado: {
        label: "Generado",
        icon: Clock,
        color: "text-green-600",
    },
    en_curso: {
        label: "En curso",
        icon: Loader2,
        color: "text-orange-600",
    },
    finalizado: {
        label: "Entregado",
        icon: CheckCircle2,
        color: "text-red-600",
    },
};

const OrderStatusPage = () => {
    const { partyId } = usePartyStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

    useEffect(() => {
        if (!partyId) return;

        const fetchOrders = async () => {
            const { data } = await supabase
                .from("orders")
                .select("id, status, total, created_at")
                .eq("party_id", partyId)
                .order("created_at", { ascending: true });

            setOrders(data || []);
        };

        fetchOrders();

        const channel = supabase
            .channel(`orders-${partyId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "orders",
                    filter: `party_id=eq.${partyId}`,
                },
                fetchOrders
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [partyId]);

    const totalParty = orders.reduce((sum, o) => sum + o.total, 0);

    const openOrder = async (order: Order) => {
        setSelectedOrder(order);

        const { data, error } = await supabase
            .from("order_items")
            .select(`
                product_id,
                quantity,
                price,
                products (
                    name,
                    image_url
                )
            `)
            .eq("order_id", order.id);
        console.log("📦 RAW order_items:", data);
        if (error) {
            console.error("Error cargando detalle:", error);
            return;
        }
        if (!data) return;

        const formattedData: OrderItem[] = data.map((item: any) => ({
            ...item,
            products: Array.isArray(item.products) ? item.products[0] : item.products,
        }));

        setOrderItems(formattedData);
    };

    return (
        <div className="bg-primary text-secondary px-4 pt-4 pb-24">
            <h1 className="text-2xl font-extrabold mb-6">
                Estado de tus pedidos
            </h1>

            <div className="space-y-5">
                {orders.map((order, index) => {
                    const cfg = statusConfig[order.status];
                    const StatusIcon = cfg.icon;

                    return (
                        <motion.button
                            key={order.id}
                            onClick={() => openOrder(order)}
                            whileTap={{ scale: 0.97 }}
                            className="
                                w-full text-left
                                bg-secondary text-primary
                                rounded-2xl
                                p-5 shadow-md
                                relative overflow-hidden
                            "
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Receipt className="w-6 h-6" />
                                    <span className="text-lg font-semibold">
                                        Pedido {index + 1}
                                    </span>
                                </div>

                                <span className="text-lg font-bold">
                                    S/ {order.total}
                                </span>
                            </div>

                            <div className="flex justify-between mt-3">
                                <div className={`flex items-center gap-2 ${cfg.color}`}>
                                    <StatusIcon className="w-4 h-4" />
                                    {cfg.label}
                                </div>

                                <span className="text-primary/60 text-sm">
                                    {new Date(order.created_at).toLocaleTimeString()}
                                </span>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {orders.length > 0 && (
                <div className="fixed bottom-16 left-0 right-0 bg-primary border-t border-secondary/10 p-4">
                    <div className="flex justify-between text-xl font-extrabold">
                        <span>Total acumulado</span>
                        <span className="text-primary">
                            S/ {totalParty}
                        </span>
                    </div>
                </div>
            )}

            {/* MODAL DETALLE */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 z-50 flex items-end"
                    >
                        <motion.div
                            initial={{ y: 80 }}
                            animate={{ y: 0 }}
                            exit={{ y: 80 }}
                            className="
                                bg-secondary text-primary
                                w-full rounded-t-2xl
                                p-5 max-h-[85vh]
                                overflow-y-auto
                            "
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">
                                    Detalle del pedido
                                </h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 rounded-full hover:bg-primary/10"
                                >
                                    <X />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {orderItems.map((item) => (
                                    <div
                                        key={item.product_id}
                                        className="flex items-center gap-3"
                                    >
                                        {item.products.image_url && (
                                            <img
                                                src={item.products.image_url}
                                                alt={item.products.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                        )}

                                        <div className="flex-1">
                                            <div className="font-medium">
                                                {item.products.name}
                                            </div>
                                            <div className="text-primary/60 text-sm">
                                                {item.quantity} × S/ {item.price}
                                            </div>
                                        </div>

                                        <div className="font-semibold">
                                            S/ {item.quantity * item.price}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between font-bold text-lg mt-5">
                                <span>Total</span>
                                <span className="text-primary">
                                    S/ {selectedOrder.total}
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderStatusPage;
