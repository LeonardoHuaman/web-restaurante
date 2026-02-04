import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import {
    Receipt,
    Clock,
    Loader2,
    CheckCircle2,
    type LucideIcon,
} from "lucide-react";

type OrderStatus =
    | "generado"
    | "en_proceso"
    | "listo"
    | "finalizado";

interface Order {
    status: OrderStatus;
    total: number;
}

interface Party {
    id: string;
    table_number: number;
    orders: Order[];
}

const STATUS_CONFIG: Record<
    OrderStatus,
    { label: string; icon: LucideIcon; badge: string }
> = {
    generado: {
        label: "Generado",
        icon: Clock,
        badge: "bg-gray-200 text-gray-800",
    },
    en_proceso: {
        label: "En proceso",
        icon: Loader2,
        badge: "bg-orange-200 text-orange-800",
    },
    listo: {
        label: "Listo",
        icon: CheckCircle2,
        badge: "bg-green-200 text-green-800",
    },
    finalizado: {
        label: "Finalizado",
        icon: CheckCircle2,
        badge: "bg-blue-200 text-blue-800",
    },
};

const WaiterMyTablesPage = () => {
    const [parties, setParties] = useState<Party[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchMyTables = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data } = await supabase
            .from("table_parties")
            .select(`
                id,
                tables!inner(table_number),
                orders(status, total)
            `)
            .eq("waiter_id", user.id)
            .eq("is_active", true);

        if (!data) {
            setParties([]);
            setLoading(false);
            return;
        }

        // 🔥 Normalizamos la respuesta de Supabase
        const normalized: Party[] = data.map((p: any) => ({
            id: p.id,
            table_number: p.tables[0]?.table_number,
            orders: p.orders ?? [],
        }));

        setParties(normalized);
        setLoading(false);
    };

    const finalizeParty = async (
        e: React.MouseEvent,
        partyId: string
    ) => {
        e.stopPropagation();

        const ok = window.confirm(
            "¿Finalizar esta mesa? Se cerrarán los pedidos y las sesiones activas."
        );
        if (!ok) return;

        const { error } = await supabase.rpc(
            "finalize_party_and_sessions",
            { p_party_id: partyId }
        );

        if (!error) fetchMyTables();
    };

    useEffect(() => {
        fetchMyTables();

        const channel = supabase
            .channel("waiter-my-tables-realtime")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "orders" },
                fetchMyTables
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "table_parties" },
                fetchMyTables
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (loading) {
        return (
            <div className="bg-primary text-secondary min-h-full p-6">
                Cargando mesas...
            </div>
        );
    }

    return (
        <div className="bg-primary text-secondary min-h-full p-6">
            <h1 className="text-3xl font-extrabold mb-6">
                Mis mesas
            </h1>

            {parties.length === 0 && (
                <p className="text-secondary/60">
                    No tienes mesas activas
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {parties.map((party) => {
                    const total = party.orders.reduce(
                        (s, o) => s + o.total,
                        0
                    );

                    return (
                        <div
                            key={party.id}
                            onClick={() =>
                                navigate(`/waiter/party/${party.id}`, {
                                    state: { from: "mine" },
                                })
                            }
                            className="cursor-pointer bg-secondary text-primary rounded-2xl p-5 shadow-md flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-bold">
                                    Mesa {party.table_number}
                                </h2>

                                <div className="flex items-center gap-2 text-sm">
                                    <Receipt className="w-4 h-4 text-primary/60" />
                                    {party.orders.length}
                                </div>
                            </div>

                            <p className="font-semibold text-accent mb-3">
                                Total: S/ {total}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {party.orders.map((order, i) => {
                                    const cfg =
                                        STATUS_CONFIG[order.status];
                                    const Icon = cfg.icon;

                                    return (
                                        <span
                                            key={i}
                                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${cfg.badge}`}
                                        >
                                            <Icon className="w-3 h-3" />
                                            {cfg.label}
                                        </span>
                                    );
                                })}
                            </div>

                            <button
                                onClick={(e) =>
                                    finalizeParty(e, party.id)
                                }
                                className="mt-auto w-full py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition"
                            >
                                Finalizar mesa
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WaiterMyTablesPage;
