import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useNavigate } from "react-router-dom";

/* =======================
   TIPOS REALES
======================= */

interface Party {
    id: string;
    tables: {
        table_number: number;
    } | null;
    orders: {
        total: number;
    }[];
}

const WaiterTablesPage = () => {
    const [parties, setParties] = useState<Party[]>([]);
    const navigate = useNavigate();

    const fetchParties = async () => {
        const { data, error } = await supabase
            .from("table_parties")
            .select(`
      id,
      tables(table_number),
      orders(total)
    `)
            .eq("is_active", true)
            .is("waiter_id", null);

        if (error) {
            console.error("Error cargando mesas:", error);
            return;
        }

        const normalized: Party[] =
            (data as any[])?.map((party) => ({
                id: party.id,
                tables: party.tables ?? null,
                orders: party.orders ?? [],
            })) ?? [];

        setParties(normalized);
    };


    const takeParty = async (partyId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
            .from("table_parties")
            .update({ waiter_id: user.id })
            .eq("id", partyId);

        await supabase
            .from("orders")
            .update({ waiter_id: user.id })
            .eq("party_id", partyId)
            .is("waiter_id", null);

        navigate(`/waiter/party/${partyId}`, {
            state: { from: "available" },
        });
    };

    useEffect(() => {
        fetchParties();
    }, []);

    return (
        <>
            <h1 className="text-2xl font-bold mb-6">
                Mesas disponibles
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {parties
                    .filter((party) => party.tables !== null)
                    .map((party) => {
                        const total = party.orders.reduce(
                            (s, o) => s + o.total,
                            0
                        );

                        return (
                            <div
                                key={party.id}
                                className="bg-white p-4 rounded-xl shadow"
                            >
                                <h2 className="text-xl font-bold">
                                    Mesa {party.tables!.table_number}
                                </h2>

                                <p>{party.orders.length} pedidos</p>
                                <p className="font-semibold">
                                    Total: S/ {total}
                                </p>

                                <button
                                    onClick={() => takeParty(party.id)}
                                    className="mt-4 w-full bg-orange-600 text-white py-2 rounded-lg"
                                >
                                    Tomar mesa
                                </button>
                            </div>
                        );
                    })}
            </div>
        </>
    );
};

export default WaiterTablesPage;
