import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { usePartyStore } from "../stores/partyStore";
import { X } from "lucide-react";

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
    products: { name: string }[];
}

const statusLabel = {
    generado: "Generado",
    en_curso: "En curso",
    finalizado: "Entregado",
};

const statusColor = {
    generado: "text-green-600",
    en_curso: "text-orange-600",
    finalizado: "text-red-600",
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
                .order("created_at", { ascending: false });

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

        const { data } = await supabase
            .from("order_items")
            .select("product_id, quantity, price, products(name)")
            .eq("order_id", order.id);

        setOrderItems(data || []);
    };

    return (
        <div className="p-5 pb-24">
            <h1 className="text-2xl font-extrabold mb-6">
                Estado de tus pedidos
            </h1>

            {orders.length === 0 && (
                <p className="text-lg">Todavía no hay pedidos 🍽️</p>
            )}

            <div className="space-y-4">
                {orders.map((order) => (
                    <button
                        key={order.id}
                        onClick={() => openOrder(order)}
                        className="w-full text-left border rounded-2xl p-4 shadow-sm active:scale-[0.98]"
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">
                                Pedido
                            </span>
                            <span className="text-lg font-bold">
                                S/ {order.total}
                            </span>
                        </div>

                        <div className="flex justify-between mt-2 text-base">
                            <span className={`font-semibold ${statusColor[order.status]}`}>
                                {statusLabel[order.status]}
                            </span>
                            <span className="text-gray-500">
                                {new Date(order.created_at).toLocaleTimeString()}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            {orders.length > 0 && (
                <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4">
                    <div className="flex justify-between text-xl font-extrabold">
                        <span>Total acumulado</span>
                        <span>S/ {totalParty}</span>
                    </div>
                </div>
            )}

            {selectedOrder && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
                    <div className="bg-white w-full rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                Detalle del pedido
                            </h2>
                            <button onClick={() => setSelectedOrder(null)}>
                                <X />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {orderItems.map((item) => (
                                <div
                                    key={item.product_id}
                                    className="flex justify-between text-base"
                                >
                                    <span>
                                        {item.quantity} × {item.products[0]?.name}
                                    </span>
                                    <span>
                                        S/ {item.quantity * item.price}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between font-bold text-lg mt-5">
                            <span>Total</span>
                            <span>S/ {selectedOrder.total}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderStatusPage;
