import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

/* =======================
   TIPOS
======================= */

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

/* =======================
   ESTILOS Y LABELS
======================= */

const STATUS_LABEL: Record<OrderStatus, string> = {
    generado: "Generado",
    en_curso: "En curso",
    finalizado: "Finalizado",
};

const STATUS_STYLE: Record<OrderStatus, string> = {
    generado: "bg-green-100 text-green-800 border-green-500",
    en_curso: "bg-orange-100 text-orange-800 border-orange-500",
    finalizado: "bg-red-100 text-red-800 border-red-500",
};

/* =======================
   COMPONENTE
======================= */

const WaiterPartyDetailPage = () => {
    const { partyId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const from = location.state?.from;

    /* =======================
       NAVEGACIÓN REGRESAR
    ======================= */
    const goBack = () => {
        if (from === "mine") navigate("/waiter/my-tables");
        else navigate("/waiter");
    };

    /* =======================
       FETCH PEDIDOS
    ======================= */
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

        if (error) {
            console.error("Error cargando pedidos:", error);
            return;
        }

        setOrders(data?.orders || []);
        setLoading(false);
    };

    /* =======================
       UPDATE ESTADO
    ======================= */
    const updateStatus = async (
        orderId: string,
        newStatus: OrderStatus
    ) => {
        await supabase
            .from("orders")
            .update({ status: newStatus })
            .eq("id", orderId);

        fetchOrders();
    };

    useEffect(() => {
        fetchOrders();
    }, [partyId]);

    /* =======================
       ORDEN FIJO (CLAVE)
       🔒 NUNCA SE ROMPE
    ======================= */
    const orderedOrders = useMemo(() => {
        return [...orders].sort(
            (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
        );
    }, [orders]);

    if (loading) return <p>Cargando pedidos...</p>;

    /* =======================
       RENDER
    ======================= */
    return (
        <div>
            <button
                onClick={goBack}
                className="mb-6 text-orange-600 font-semibold"
            >
                ← Regresar
            </button>

            <h1 className="text-2xl font-bold mb-6">
                Detalle de la mesa
            </h1>

            {orderedOrders.length === 0 && (
                <p className="text-gray-500">
                    No hay pedidos aún 🍽️
                </p>
            )}

            <div className="space-y-6">
                {orderedOrders.map((order, index) => (
                    <div
                        key={order.id}
                        className="border rounded-xl p-4 bg-white shadow"
                    >
                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-bold">
                                Pedido {index + 1}
                            </h2>

                            <span
                                className={`px-3 py-1 text-sm rounded-full border
                  ${STATUS_STYLE[order.status]}
                `}
                            >
                                {STATUS_LABEL[order.status]}
                            </span>
                        </div>

                        {/* ITEMS */}
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

                        {/* ACCIONES */}
                        <div className="flex gap-3">
                            {order.status !== "generado" && (
                                <button
                                    onClick={() =>
                                        updateStatus(order.id, "generado")
                                    }
                                    className="px-3 py-1 text-sm border rounded hover:bg-green-50"
                                >
                                    Generado
                                </button>
                            )}

                            {order.status !== "en_curso" && (
                                <button
                                    onClick={() =>
                                        updateStatus(order.id, "en_curso")
                                    }
                                    className="px-3 py-1 text-sm border rounded hover:bg-orange-50"
                                >
                                    En curso
                                </button>
                            )}

                            {order.status !== "finalizado" && (
                                <button
                                    onClick={() =>
                                        updateStatus(order.id, "finalizado")
                                    }
                                    className="px-3 py-1 text-sm border rounded hover:bg-red-50"
                                >
                                    Finalizado
                                </button>
                            )}
                        </div>

                        {/* TOTAL */}
                        <div className="mt-3 text-right font-semibold">
                            Total pedido: S/ {order.total}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WaiterPartyDetailPage;
