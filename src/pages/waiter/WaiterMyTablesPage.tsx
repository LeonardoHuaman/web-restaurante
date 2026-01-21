import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useNavigate } from "react-router-dom";

type OrderStatus = "generado" | "en_curso" | "finalizado";

interface Order {
    status: OrderStatus;
    total: number;
}

interface Party {
    id: string;
    tables: { table_number: number };
    orders: Order[];
}

/* =======================
   ESTILOS
======================= */

const CARD_STYLE: Record<OrderStatus, string> = {
    generado: "border-green-500 bg-green-50",
    en_curso: "border-orange-500 bg-orange-50",
    finalizado: "border-gray-400 bg-gray-100",
};

const BADGE_STYLE: Record<OrderStatus, string> = {
    generado: "bg-green-200 text-green-800",
    en_curso: "bg-orange-200 text-orange-800",
    finalizado: "bg-red-200 text-red-800",
};

const WaiterMyTablesPage = () => {
    const [parties, setParties] = useState<Party[]>([]);
    const navigate = useNavigate();

    const fetchMyTables = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from("table_parties")
            .select(`
        id,
        tables!inner(table_number),
        orders(status, total)
      `)
            .eq("waiter_id", user.id)
            .eq("is_active", true);

        if (error) {
            console.error(error);
            return;
        }

        /* =======================
           NORMALIZACIÓN (CLAVE)
        ======================= */

        const normalized: Party[] =
            (data as any[])?.map((party) => ({
                id: party.id,
                tables: party.tables, // 👈 runtime ya es objeto
                orders: party.orders ?? [],
            })) ?? [];

        setParties(normalized);
    };

    const finalizeParty = async (
        e: React.MouseEvent,
        partyId: string
    ) => {
        e.stopPropagation();

        const ok = window.confirm(
            "¿Finalizar esta mesa? Ya no aparecerá en Mis Mesas."
        );
        if (!ok) return;

        await supabase
            .from("table_parties")
            .update({ is_active: false })
            .eq("id", partyId);

        fetchMyTables();
    };

    useEffect(() => {
        fetchMyTables();
    }, []);

    return (
        <>
            <h1 className="text-2xl font-bold mb-6">Mis mesas</h1>

            {parties.length === 0 && (
                <p className="text-gray-500">
                    No tienes mesas activas 🍽️
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {parties.map((party) => {
                    const total = party.orders.reduce(
                        (s, o) => s + o.total,
                        0
                    );

                    const hasEnCurso = party.orders.some(
                        (o) => o.status === "en_curso"
                    );
                    const hasGenerado = party.orders.some(
                        (o) => o.status === "generado"
                    );

                    let cardStatus: OrderStatus = "finalizado";
                    if (hasEnCurso) cardStatus = "en_curso";
                    else if (hasGenerado) cardStatus = "generado";

                    return (
                        <div
                            key={party.id}
                            onClick={() =>
                                navigate(`/waiter/party/${party.id}`, {
                                    state: { from: "mine" },
                                })
                            }
                            className={`
                cursor-pointer
                border-2 rounded-xl p-4
                transition-all duration-200
                hover:scale-[1.02] hover:shadow-lg
                ${CARD_STYLE[cardStatus]}
              `}
                        >
                            <h2 className="text-xl font-bold mb-1">
                                Mesa {party.tables.table_number}
                            </h2>

                            <p className="text-sm mb-1">
                                {party.orders.length} pedidos
                            </p>

                            <p className="font-semibold mb-3">
                                Total: S/ {total}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {party.orders.map((o, i) => (
                                    <span
                                        key={i}
                                        className={`text-xs px-2 py-1 rounded-full ${BADGE_STYLE[o.status]}`}
                                    >
                                        {o.status === "generado"
                                            ? "Generado"
                                            : o.status === "en_curso"
                                                ? "En curso"
                                                : "Finalizado"}
                                    </span>
                                ))}
                            </div>

                            <button
                                onClick={(e) => finalizeParty(e, party.id)}
                                className="w-full bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700"
                            >
                                Finalizar mesa
                            </button>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default WaiterMyTablesPage;
