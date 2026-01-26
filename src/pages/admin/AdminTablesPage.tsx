import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";

/* =======================
   TYPES
======================= */

type Waiter =
    | { codigo_mozo: string | null }
    | { codigo_mozo: string | null }[]
    | null;

interface TableParty {
    id: string;
    is_active: boolean;
    waiter: Waiter;
}

interface TableRow {
    id: string;
    table_number: number;
    table_parties: TableParty[];
}

/* =======================
   HELPERS
======================= */

const getCodigoMozo = (waiter: Waiter): string => {
    if (!waiter) return "Libre";
    if (Array.isArray(waiter)) {
        return waiter[0]?.codigo_mozo ?? "Libre";
    }
    return waiter.codigo_mozo ?? "Libre";
};

/* =======================
   COMPONENT
======================= */

const AdminTablesPage = () => {
    const [tables, setTables] = useState<TableRow[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadTables();
    }, []);

    const loadTables = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("tables")
            .select(`
        id,
        table_number,
        table_parties (
          id,
          is_active,
          waiter:users (
            codigo_mozo
          )
        )
      `)
            .order("table_number");

        if (error) {
            console.error("Error loading tables:", error);
            setLoading(false);
            return;
        }

        setTables((data as TableRow[]) || []);
        setLoading(false);
    };

    const closeParty = async (partyId: string) => {
        const { error } = await supabase
            .from("table_parties")
            .update({ is_active: false })
            .eq("id", partyId);

        if (error) {
            console.error("Error closing party:", error);
            return;
        }

        loadTables();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-extrabold">
                Mesas
            </h2>

            <div className="bg-primary border border-secondary/20 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="border-b border-secondary/20">
                        <tr>
                            <th className="p-4 text-left">Mesa</th>
                            <th className="p-4 text-center">Estado</th>
                            <th className="p-4 text-center">Mozo</th>
                            <th className="p-4 text-center">Acción</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tables.map((t) => {
                            const activeParty = t.table_parties.find(
                                (p) => p.is_active
                            );

                            return (
                                <tr
                                    key={t.id}
                                    className="border-t border-secondary/10"
                                >
                                    <td className="p-4">
                                        Mesa #{t.table_number}
                                    </td>

                                    <td className="p-4 text-center">
                                        {activeParty ? "Ocupada" : "Libre"}
                                    </td>

                                    <td className="p-4 text-center">
                                        {activeParty
                                            ? getCodigoMozo(activeParty.waiter)
                                            : "Libre"}
                                    </td>

                                    <td className="p-4 text-center">
                                        {activeParty && (
                                            <button
                                                onClick={() => closeParty(activeParty.id)}
                                                className="
                          px-4 py-1 rounded-md
                          bg-secondary text-primary
                          font-semibold
                          hover:opacity-90
                        "
                                            >
                                                Finalizar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}

                        {!loading && tables.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="p-6 text-center text-secondary/70"
                                >
                                    No hay mesas registradas
                                </td>
                            </tr>
                        )}

                        {loading && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="p-6 text-center"
                                >
                                    Cargando...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminTablesPage;
