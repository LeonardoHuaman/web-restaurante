import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";

const AdminStatsPage = () => {
    const [ingresos, setIngresos] = useState(0);
    const [parties, setParties] = useState(0);
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [topWaiters, setTopWaiters] = useState<any[]>([]);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        const { data: ingresosHoy } = await supabase.rpc("ingresos_hoy");
        const { data: partiesHoy } = await supabase.rpc("parties_hoy");
        const { data: products } = await supabase.rpc("top_products_month");
        const { data: waiters } = await supabase.rpc("top_waiters_month");

        setIngresos(ingresosHoy || 0);
        setParties(partiesHoy || 0);
        setTopProducts(products || []);
        setTopWaiters(waiters || []);
    };

    const monthName = new Date().toLocaleString("es-PE", {
        month: "long",
    });

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-extrabold capitalize">
                Estadísticas — {monthName}
            </h2>

            {/* CARDS */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-primary border border-secondary/20 rounded-xl p-6">
                    <p className="text-secondary/70">Ingresos hoy</p>
                    <p className="text-3xl font-bold">
                        S/ {ingresos.toFixed(2)}
                    </p>
                </div>

                <div className="bg-primary border border-secondary/20 rounded-xl p-6">
                    <p className="text-secondary/70">Parties hoy</p>
                    <p className="text-3xl font-bold">
                        {parties}
                    </p>
                </div>
            </div>

            {/* TOP PRODUCTOS */}
            <div>
                <h3 className="text-xl font-bold mb-4">
                    Top 5 productos del mes
                </h3>

                <div className="grid grid-cols-5 gap-4">
                    {topProducts.map((p) => (
                        <div
                            key={p.product_id}
                            className="bg-primary border border-secondary/20 rounded-lg p-4 text-center"
                        >
                            <img
                                src={p.image_url}
                                alt={p.name}
                                className="w-full h-24 object-cover rounded-md mb-2"
                            />
                            <p className="font-semibold text-sm">
                                {p.name}
                            </p>
                            <p className="text-secondary/70 text-sm">
                                {p.total_quantity} vendidos
                            </p>
                        </div>
                    ))}

                    {topProducts.length === 0 && (
                        <p className="text-secondary/70">
                            No hay datos este mes
                        </p>
                    )}
                </div>
            </div>

            {/* TOP MOZOS */}
            <div>
                <h3 className="text-xl font-bold mb-4">
                    Top 5 mozos del mes
                </h3>

                <div className="bg-primary border border-secondary/20 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="border-b border-secondary/20">
                            <tr>
                                <th className="p-4 text-left">Mozo</th>
                                <th className="p-4 text-center">Parties</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topWaiters.map((w) => (
                                <tr
                                    key={w.codigo_mozo}
                                    className="border-t border-secondary/10"
                                >
                                    <td className="p-4">
                                        {w.codigo_mozo}
                                    </td>
                                    <td className="p-4 text-center">
                                        {w.total_parties}
                                    </td>
                                </tr>
                            ))}

                            {topWaiters.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={2}
                                        className="p-6 text-center text-secondary/70"
                                    >
                                        No hay datos este mes
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminStatsPage;
