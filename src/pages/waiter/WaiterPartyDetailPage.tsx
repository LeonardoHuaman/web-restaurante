import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { Clock, Loader2, CheckCircle2 } from "lucide-react";

type OrderStatus = "generado" | "en_curso" | "finalizado";

interface OrderItem {
    quantity: number;
    price: number;
    products: {
        name: string;
    };
}

interface Order {
    id: string;
    status: OrderStatus;
    total: number;
    created_at: string;
    order_items: OrderItem[];
}

const STATUS_LABEL: Record<OrderStatus, string> = {
    generado: "Generado",
    en_curso: "En curso",
    finalizado: "Finalizado",
};

const STATUS_STYLE: Record<OrderStatus, string> = {
    generado: "bg-green-200 text-green-800",
    en_curso: "bg-orange-200 text-orange-800",
    finalizado: "bg-red-200 text-red-800",
};

const STATUS_ICON: Record<OrderStatus, any> = {
    generado: Clock,
    en_curso: Loader2,
    finalizado: CheckCircle2,
};

const WaiterPartyDetailPage = () => {
    const { partyId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const from = location.state?.from;

    const goBack = () => {
        if (from === "mine") navigate("/waiter/my-tables");
        else navigate("/waiter");
    };
    const fetchOrders = async () => {
        if (!partyId) return;

        const { data, error } = await supabase
            .from("table_parties")
            .select(`
        orders (
          id,
          status,
          total,
          created_at,
          order_items (
            quantity,
            price,
            products ( name )
          )
        )
      `)
            .eq("id", partyId)
            .single();

        if (!error) {
            setOrders(data?.orders ?? []);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        if (!partyId) return;

        const channel = supabase
            .channel(`waiter-party-${partyId}`)
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
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "order_items",
                },
                fetchOrders
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [partyId]);

    const orderedOrders = useMemo(() => {
        return [...orders].sort(
            (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
        );
    }, [orders]);

    const globalStatus: OrderStatus | null = useMemo(() => {
        if (orders.length === 0) return null;

        if (orders.every((o) => o.status === "generado"))
            return "generado";

        if (orders.some((o) => o.status === "en_curso"))
            return "en_curso";

        if (orders.every((o) => o.status === "finalizado"))
            return "finalizado";

        return "en_curso";
    }, [orders]);

    const GlobalIcon =
        globalStatus !== null ? STATUS_ICON[globalStatus] : null;

    const updateStatus = async (
        orderId: string,
        newStatus: OrderStatus
    ) => {
        await supabase
            .from("orders")
            .update({ status: newStatus })
            .eq("id", orderId);
    };

    if (loading) {
        return (
            <div className="bg-primary text-secondary h-full p-6">
                Cargando pedidos...
            </div>
        );
    }

    return (
        <div className="bg-primary text-secondary h-full overflow-y-auto p-6">
            <button
                onClick={goBack}
                className="mb-6 text-accent font-semibold"
            >
                ← Regresar
            </button>

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-extrabold">
                    Detalle de la mesa
                </h1>

                {globalStatus && (
                    <span
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${STATUS_STYLE[globalStatus]}`}
                    >
                        <GlobalIcon className="w-4 h-4" />
                        {STATUS_LABEL[globalStatus]}
                    </span>
                )}
            </div>

            {orderedOrders.length === 0 && (
                <p className="text-secondary/60">
                    No hay pedidos aún 🍽️
                </p>
            )}

            <div className="space-y-6">
                {orderedOrders.map((order, index) => {
                    const Icon = STATUS_ICON[order.status];

                    return (
                        <div
                            key={order.id}
                            className="bg-secondary text-primary rounded-2xl p-5 shadow-md"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-lg font-bold">
                                    Pedido {index + 1}
                                </h2>

                                <span
                                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${STATUS_STYLE[order.status]}`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {STATUS_LABEL[order.status]}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                {order.order_items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between text-sm"
                                    >
                                        <span>
                                            {item.quantity} × {item.products.name}
                                        </span>
                                        <span>
                                            S/ {item.price * item.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3 mb-3">
                                {order.status !== "generado" && (
                                    <button
                                        onClick={() =>
                                            updateStatus(order.id, "generado")
                                        }
                                        className="px-3 py-1 text-sm rounded border hover:bg-green-100"
                                    >
                                        Generado
                                    </button>
                                )}

                                {order.status !== "en_curso" && (
                                    <button
                                        onClick={() =>
                                            updateStatus(order.id, "en_curso")
                                        }
                                        className="px-3 py-1 text-sm rounded border hover:bg-orange-100"
                                    >
                                        En curso
                                    </button>
                                )}

                                {order.status !== "finalizado" && (
                                    <button
                                        onClick={() =>
                                            updateStatus(order.id, "finalizado")
                                        }
                                        className="px-3 py-1 text-sm rounded border hover:bg-red-100"
                                    >
                                        Finalizado
                                    </button>
                                )}
                            </div>

                            <div className="text-right font-semibold">
                                Total pedido: S/ {order.total}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WaiterPartyDetailPage;
