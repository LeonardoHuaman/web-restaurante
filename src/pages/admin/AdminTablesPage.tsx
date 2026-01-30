import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { Users, Plus, Trash2, Printer } from "lucide-react";

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
    qr_image_url: string | null;
    table_parties: TableParty[];
}

const getCodigoMozo = (waiter: Waiter): string => {
    if (!waiter) return "Libre";
    if (Array.isArray(waiter)) return waiter[0]?.codigo_mozo ?? "Libre";
    return waiter.codigo_mozo ?? "Libre";
};

const AdminTablesPage = () => {
    const [tables, setTables] = useState<TableRow[]>([]);
    const [loading, setLoading] = useState(false);

    const [tableNumber, setTableNumber] = useState(1);
    const [seats, setSeats] = useState(4);
    const [creating, setCreating] = useState(false);

    const [qrToPrint, setQrToPrint] = useState<string | null>(null);

    useEffect(() => {
        loadTables();
    }, []);

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
        qr_image_url,
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

    const createTable = async () => {
        if (!tableNumber || seats <= 0) return;

        setCreating(true);

        const res = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-table-with-qr`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
                },
                body: JSON.stringify({
                    table_number: tableNumber,
                    seats,
                }),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            console.error(data);
            alert(JSON.stringify(data));
            setCreating(false);
            return;
        }

        setCreating(false);
        setTableNumber(tableNumber + 1);
        setSeats(4);
        loadTables();
    };

    const closeParty = async (partyId: string) => {
        await supabase.rpc("finalize_table_party", {
            p_party_id: partyId,
        });
        loadTables();
    };

    const deleteTable = async (tableId: string) => {
        const ok = confirm("¿Eliminar esta mesa definitivamente?");
        if (!ok) return;

        await supabase.from("tables").delete().eq("id", tableId);
        loadTables();
    };

    const printQrInline = (url: string) => {
        setQrToPrint(url);
        setTimeout(() => {
            window.print();
            setQrToPrint(null);
        }, 100);
    };

    return (
        <>
            {qrToPrint && (
                <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center print:flex">
                    <img src={qrToPrint} className="w-72 h-72" />
                </div>
            )}

            <div className="space-y-10 print:hidden">
                <header>
                    <h2 className="text-4xl font-black tracking-tight text-zinc-900">
                        Mesas & QR
                    </h2>
                    <p className="text-zinc-500 mt-1">
                        Gestión moderna y permanente de mesas
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-white rounded-3xl p-7 shadow-lg border border-zinc-200">
                        <h3 className="font-bold text-lg mb-6 text-zinc-900">
                            Agregar mesa
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-zinc-600">
                                    NÚMERO
                                </label>
                                <input
                                    type="number"
                                    value={tableNumber}
                                    onChange={(e) => setTableNumber(Number(e.target.value))}
                                    className="mt-1 w-full p-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-zinc-600">
                                    ASIENTOS
                                </label>
                                <input
                                    type="number"
                                    value={seats}
                                    onChange={(e) => setSeats(Number(e.target.value))}
                                    className="mt-1 w-full p-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <button
                                onClick={createTable}
                                disabled={creating}
                                className="w-full mt-6 py-3 rounded-full bg-accent hover:bg-accent/80 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Plus size={18} />
                                {creating ? "Creando..." : "Crear mesa"}
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-bold text-xl text-zinc-900">
                                Mesas registradas
                            </h3>
                            <span className="text-sm px-4 py-1 rounded-full bg-zinc-900 text-white">
                                {tables.length} mesas
                            </span>
                        </div>

                        {loading ? (
                            <p className="text-zinc-500">Cargando...</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {tables.map((t) => {
                                    const activeParty = t.table_parties.find(
                                        (p) => p.is_active
                                    );

                                    return (
                                        <div
                                            key={t.id}
                                            className="bg-white rounded-3xl p-6 shadow-lg border border-zinc-200"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="text-2xl font-black text-zinc-900">
                                                        M-{t.table_number}
                                                    </h4>
                                                    <span className="text-xs text-zinc-500">
                                                        Capacidad {t.seats}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1 text-xs bg-zinc-100 px-3 py-1 rounded-full text-zinc-700">
                                                    <Users size={14} />
                                                    {t.seats}
                                                </div>
                                            </div>

                                            {t.qr_image_url && (
                                                <div className="mt-4 flex justify-center bg-zinc-50 p-4 rounded-2xl border">
                                                    <img
                                                        src={t.qr_image_url}
                                                        alt={`QR Mesa ${t.table_number}`}
                                                        className="w-40 h-40"
                                                    />
                                                </div>
                                            )}

                                            <div className="mt-5 flex gap-2">
                                                {t.qr_image_url && (
                                                    <button
                                                        onClick={() => printQrInline(t.qr_image_url!)}
                                                        className="flex-1 py-2.5 rounded-full bg-zinc-900 text-white font-semibold hover:bg-zinc-800 flex items-center justify-center gap-2"
                                                    >
                                                        <Printer size={16} />
                                                        Imprimir
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => deleteTable(t.id)}
                                                    className="px-4 py-2.5 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 flex items-center justify-center"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            {activeParty ? (
                                                <button
                                                    onClick={() => closeParty(activeParty.id)}
                                                    className="w-full mt-3 py-2.5 rounded-full bg-rose-100 text-rose-700 font-semibold hover:bg-rose-200"
                                                >
                                                    Finalizar mesa ({getCodigoMozo(activeParty.waiter)})
                                                </button>
                                            ) : (
                                                <div className="mt-3 text-center text-xs text-emerald-600 font-semibold">
                                                    Mesa libre
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminTablesPage;
