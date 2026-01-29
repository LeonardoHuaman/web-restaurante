// src/pages/admin/AdminStatsPage.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { TrendingUp, Users, Flame } from "lucide-react";

type TopProduct = {
    product_id: string;
    name: string;
    image_url: string;
    total_quantity: number;
};

type TopWaiter = {
    codigo_mozo: string;
    total_parties: number;
};

const AdminStatsPage = () => {
    const [ingresos, setIngresos] = useState(0);
    const [parties, setParties] = useState(0);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [topWaiters, setTopWaiters] = useState<TopWaiter[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setLoading(true);

        const [{ data: ingresosHoy }, { data: partiesHoy }, { data: products }, { data: waiters }] =
            await Promise.all([
                supabase.rpc("ingresos_hoy"),
                supabase.rpc("parties_hoy"),
                supabase.rpc("top_products_month"),
                supabase.rpc("top_waiters_month"),
            ]);

        setIngresos(ingresosHoy || 0);
        setParties(partiesHoy || 0);
        setTopProducts(products || []);
        setTopWaiters(waiters || []);
        setLoading(false);
    };

    const monthName = new Date().toLocaleString("es-PE", { month: "long" });

    return (
        <div className="space-y-10 animate-fade-in">
            <header>
                <h2 className="text-4xl font-black capitalize tracking-tight">
                    Estadísticas · {monthName}
                </h2>
                <p className="text-zinc-500 mt-1">
                    Rendimiento del restaurante en tiempo real
                </p>
            </header>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="
          relative overflow-hidden rounded-3xl p-6
          bg-gradient-to-br from-emerald-500 to-emerald-700
          text-white shadow-xl
        ">
                    <div className="absolute -top-6 -right-6 opacity-20">
                        <TrendingUp size={120} />
                    </div>
                    <p className="text-white/80">Ingresos hoy</p>
                    <p className="text-4xl font-black mt-2">
                        S/ {ingresos.toFixed(2)}
                    </p>
                </div>

                <div className="
          relative overflow-hidden rounded-3xl p-6
          bg-gradient-to-br from-indigo-500 to-purple-600
          text-white shadow-xl
        ">
                    <div className="absolute -top-6 -right-6 opacity-20">
                        <Users size={120} />
                    </div>
                    <p className="text-white/80">Parties hoy</p>
                    <p className="text-4xl font-black mt-2">
                        {parties}
                    </p>
                </div>
            </div>

            {/* TOP PRODUCTOS */}
            <section>
                <div className="flex items-center gap-2 mb-5">
                    <Flame className="text-orange-500" />
                    <h3 className="text-2xl font-bold">
                        Top productos del mes
                    </h3>
                </div>

                {loading ? (
                    <p className="text-zinc-500">Cargando...</p>
                ) : topProducts.length === 0 ? (
                    <p className="text-zinc-500">No hay datos este mes</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                        {topProducts.map((p, i) => (
                            <div
                                key={p.product_id}
                                className="
                  group bg-white rounded-3xl p-4
                  border border-zinc-200 shadow-md
                  hover:shadow-xl transition-all
                  hover:-translate-y-1
                "
                                style={{ animationDelay: `${i * 80}ms` }}
                            >
                                <div className="overflow-hidden rounded-2xl mb-3">
                                    <img
                                        src={p.image_url}
                                        alt={p.name}
                                        className="
                      w-full h-28 object-cover
                      group-hover:scale-105 transition
                    "
                                    />
                                </div>
                                <p className="font-bold text-sm truncate">
                                    {p.name}
                                </p>
                                <p className="text-zinc-500 text-sm">
                                    {p.total_quantity} vendidos
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* TOP MOZOS */}
            <section>
                <h3 className="text-2xl font-bold mb-4">
                    Top mozos del mes
                </h3>

                <div className="
          bg-white rounded-3xl
          border border-zinc-200 shadow-lg
          overflow-hidden
        ">
                    <table className="w-full">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="p-4 text-left text-sm font-semibold text-zinc-600">
                                    Mozo
                                </th>
                                <th className="p-4 text-center text-sm font-semibold text-zinc-600">
                                    Parties atendidas
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {topWaiters.map((w, i) => (
                                <tr
                                    key={w.codigo_mozo}
                                    className="
                    border-t border-zinc-100
                    hover:bg-zinc-50 transition
                  "
                                >
                                    <td className="p-4 font-semibold">
                                        #{i + 1} · {w.codigo_mozo}
                                    </td>
                                    <td className="p-4 text-center font-bold">
                                        {w.total_parties}
                                    </td>
                                </tr>
                            ))}

                            {topWaiters.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={2}
                                        className="p-6 text-center text-zinc-500"
                                    >
                                        No hay datos este mes
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default AdminStatsPage;
