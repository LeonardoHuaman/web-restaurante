import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Utensils, Receipt, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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

        if (error) return;

        const normalized =
            (data as any[])?.map((party) => ({
                id: party.id,
                tables: party.tables ?? null,
                orders: party.orders ?? [],
            })) ?? [];

        setParties(normalized);
    };

    const takeParty = async (partyId: string) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
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

        const channel = supabase
            .channel("waiter-tables-realtime")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "orders" },
                fetchParties
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "table_parties" },
                fetchParties
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className="min-h-screen bg-primary text-secondary p-6">
            <h1 className="text-3xl font-extrabold mb-8">
                Mesas disponibles
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {parties
                    .filter((p) => p.tables !== null)
                    .map((party, i) => {
                        const total = party.orders.reduce(
                            (s, o) => s + o.total,
                            0
                        );

                        return (
                            <motion.div
                                key={party.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-secondary text-primary rounded-2xl p-5 shadow-md flex flex-col"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 rounded-xl bg-accent/20 text-accent">
                                        <Utensils />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            Mesa {party.tables!.table_number}
                                        </h2>
                                        <p className="text-sm text-primary/60">
                                            Disponible
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Receipt className="w-4 h-4" />
                                        {party.orders.length} pedidos
                                    </div>
                                    <span className="font-semibold text-accent">
                                        S/ {total}
                                    </span>
                                </div>

                                <button
                                    onClick={() => takeParty(party.id)}
                                    className="mt-auto w-full py-3 rounded-xl bg-accent text-secondary font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition"
                                >
                                    Tomar mesa
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        );
                    })}
            </div>
        </div>
    );
};

export default WaiterTablesPage;
