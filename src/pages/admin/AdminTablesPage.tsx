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
    seats: number;
    is_active: boolean;
    qr_token: string;
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

const getTableUrl = (qrToken: string) =>
    `${window.location.origin}/?table=${qrToken}`;

/* =======================
   COMPONENT
======================= */

const AdminTablesPage = () => {
    const [tables, setTables] = useState<TableRow[]>([]);
    const [loading, setLoading] = useState(false);

    /* FORM STATE */
    const [tableNumber, setTableNumber] = useState<number>(1);
    const [seats, setSeats] = useState<number>(4);
    const [isActive, setIsActive] = useState(true);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadTables();
    }, []);

    /* =======================
       LOAD TABLES
    ======================= */
    const loadTables = async () => {
        setLoading(true);

        const { data } = await supabase
            .from("tables")
            .select(`
        id,
        table_number,
        seats,
        is_active,
        qr_token,
        table_parties (
          id,
          is_active,
          waiter:users (
            codigo_mozo
          )
        )
      `)
            .order("table_number");

        setTables((data as TableRow[]) || []);
        setLoading(false);
    };

    /* =======================
       CREATE TABLE
    ======================= */
    const createTable = async () => {
        if (!tableNumber || seats <= 0) return;

        setCreating(true);

        const { error } = await supabase
            .from("tables")
            .insert({
                table_number: tableNumber,
                seats,
                is_active: isActive,
            });

        setCreating(false);

        if (!error) {
            setTableNumber(tableNumber + 1);
            setSeats(4);
            setIsActive(true);
            loadTables();
        }
    };

    /* =======================
       CLOSE PARTY
    ======================= */
    const closeParty = async (partyId: string) => {
        const { error } = await supabase.rpc("finalize_table_party", {
            p_party_id: partyId,
        });

        if (error) {
            console.error("Error finalizando mesa:", error);
            alert("No se pudo finalizar la mesa");
            return;
        }

        loadTables();
    };


    /* =======================
       COPY QR LINK
    ======================= */
    const copyQrLink = async (qrToken: string) => {
        const url = getTableUrl(qrToken);
        await navigator.clipboard.writeText(url);
        alert("Link del QR copiado");
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-extrabold">Mesas</h2>

            {/* =======================
         CREATE FORM
      ======================= */}
            <div className="flex flex-wrap gap-3 items-end bg-secondary/5 p-4 rounded-xl">
                <div>
                    <label className="block text-sm mb-1">Mesa</label>
                    <input
                        type="number"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(Number(e.target.value))}
                        className="p-2 rounded bg-secondary text-primary w-24"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Asientos</label>
                    <input
                        type="number"
                        value={seats}
                        onChange={(e) => setSeats(Number(e.target.value))}
                        className="p-2 rounded bg-secondary text-primary w-24"
                    />
                </div>

                <div className="flex items-center gap-2 mt-6">
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <span>Activa</span>
                </div>

                <button
                    onClick={createTable}
                    disabled={creating}
                    className="
            px-5 py-2 rounded-lg
            bg-accent text-secondary
            font-semibold
            disabled:opacity-50
          "
                >
                    {creating ? "Creando..." : "Agregar mesa"}
                </button>
            </div>

            {/* =======================
         TABLE LIST
      ======================= */}
            <div className="bg-primary border border-secondary/20 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="border-b border-secondary/20">
                        <tr>
                            <th className="p-4 text-left">Mesa</th>
                            <th className="p-4 text-center">Asientos</th>
                            <th className="p-4 text-center">Estado</th>
                            <th className="p-4 text-center">Mozo</th>
                            <th className="p-4 text-center">QR</th>
                            <th className="p-4 text-center">Acción</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tables.map((t) => {
                            const activeParty = t.table_parties.find(p => p.is_active);

                            return (
                                <tr key={t.id} className="border-t border-secondary/10">
                                    <td className="p-4">Mesa #{t.table_number}</td>
                                    <td className="p-4 text-center">{t.seats}</td>
                                    <td className="p-4 text-center">
                                        {t.is_active ? "Activa" : "Inactiva"}
                                    </td>
                                    <td className="p-4 text-center">
                                        {activeParty
                                            ? getCodigoMozo(activeParty.waiter)
                                            : "Libre"}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => copyQrLink(t.qr_token)}
                                            className="px-3 py-1 rounded-md bg-secondary text-primary text-sm"
                                        >
                                            Copiar link
                                        </button>
                                    </td>
                                    <td className="p-4 text-center">
                                        {activeParty && (
                                            <button
                                                onClick={() => closeParty(activeParty.id)}
                                                className="px-4 py-1 rounded-md bg-secondary text-primary"
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
                                <td colSpan={6} className="p-6 text-center text-secondary/70">
                                    No hay mesas registradas
                                </td>
                            </tr>
                        )}

                        {loading && (
                            <tr>
                                <td colSpan={6} className="p-6 text-center">
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
