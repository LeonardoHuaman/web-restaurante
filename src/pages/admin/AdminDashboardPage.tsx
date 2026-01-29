// src/pages/admin/AdminDashboardPage.tsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    UserPlus,
    Pizza,
    Layers,
    LayoutGrid,
    BarChart3,
    Users,
    UtensilsCrossed,
    Package,
} from "lucide-react";

import { supabase } from "../../services/supabaseClient";
import { useAdminDashboardRealtime } from "../../hooks/useAdminDashboardRealtime";
import { useSalesTodayByHour } from "../../hooks/useSalesTodayByHour";
import { SalesChart } from "../../components/admin/SalesChart";

interface QuickActionProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    iconBg: string;
    iconColor: string;
}

const QuickAction = ({
    icon,
    label,
    onClick,
    iconBg,
    iconColor,
}: QuickActionProps) => (
    <button
        onClick={onClick}
        className="
            group relative
            flex items-center gap-4
            p-5 h-24 w-full
            rounded-2xl
            bg-secondary text-primary
            transition-all duration-300 ease-out
            hover:-translate-y-1 hover:shadow-2xl
            active:scale-[0.96]
            overflow-hidden
        "
    >
        <div
            className={`
                absolute inset-0 opacity-0
                group-hover:opacity-100
                transition duration-300
                ${iconBg} blur-2xl
            `}
        />

        <div
            className={`
                relative z-10
                w-14 h-14
                flex items-center justify-center
                rounded-2xl
                ${iconBg}
                ${iconColor}
                shadow-lg
                transition-transform duration-300
                group-hover:scale-110 group-hover:rotate-3
            `}
        >
            {icon}
        </div>

        <span className="relative z-10 font-semibold text-lg leading-tight">
            {label}
        </span>
    </button>
);

interface StatCardProps {
    label: string;
    value: number;
    icon: React.ReactNode;
    accentBg: string;
    accentText: string;
    subtitle?: string;
}

const StatCard = ({
    label,
    value,
    icon,
    accentBg,
    accentText,
    subtitle,
}: StatCardProps) => (
    <div
        className="
            relative
            bg-secondary text-primary
            rounded-2xl p-6
            shadow-lg
            transition-all duration-300
            hover:-translate-y-1 hover:shadow-2xl
        "
    >
        <div
            className={`
                absolute top-4 right-4
                w-10 h-10
                flex items-center justify-center
                rounded-full
                ${accentBg} ${accentText}
                shadow-md
            `}
        >
            {icon}
        </div>

        <p className="text-sm font-semibold tracking-wide text-primary/60">
            {label}
        </p>

        <p className="text-4xl font-extrabold mt-2">
            {value}
        </p>

        {subtitle && (
            <p className={`mt-2 text-sm font-medium ${accentText}`}>
                {subtitle}
            </p>
        )}
    </div>
);

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const stats = useAdminDashboardRealtime();
    const sales = useSalesTodayByHour();

    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        const loadTotalProducts = async () => {
            const { count } = await supabase
                .from("products")
                .select("*", { count: "exact", head: true });

            if (count !== null) {
                setTotalProducts(count);
            }
        };

        loadTotalProducts();
    }, []);

    const actions = [
        {
            icon: <UserPlus />,
            label: "Agregar mozo",
            path: "/admin/mozos",
            iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
            iconColor: "text-white",
        },
        {
            icon: <Pizza />,
            label: "Agregar producto",
            path: "/admin/productos",
            iconBg: "bg-gradient-to-br from-orange-500 to-red-600",
            iconColor: "text-white",
        },
        {
            icon: <Layers />,
            label: "Crear categoría",
            path: "/admin/categorias",
            iconBg: "bg-gradient-to-br from-purple-500 to-fuchsia-600",
            iconColor: "text-white",
        },
        {
            icon: <LayoutGrid />,
            label: "Ver mesas",
            path: "/admin/mesas",
            iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
            iconColor: "text-white",
        },
        {
            icon: <BarChart3 />,
            label: "Estadísticas",
            path: "/admin/estadisticas",
            iconBg: "bg-gradient-to-br from-yellow-400 to-amber-500",
            iconColor: "text-black",
        },
    ];

    return (
        <div className="space-y-10 pb-6">
            <section>
                <h2 className="text-xl font-bold mb-4">
                    Acciones rápidas
                </h2>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {actions.map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: i * 0.08,
                                duration: 0.4,
                                ease: "easeOut",
                            }}
                        >
                            <QuickAction
                                icon={item.icon}
                                label={item.label}
                                onClick={() => navigate(item.path)}
                                iconBg={item.iconBg}
                                iconColor={item.iconColor}
                            />
                        </motion.div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-4">
                    Estado del restaurante
                </h2>

                <div className="grid gap-4 grid-cols-2 xl:grid-cols-5">
                    {[
                        {
                            label: "Mesas ocupadas",
                            value: stats.tablesOccupied,
                            icon: <UtensilsCrossed size={18} />,
                            accentBg: "bg-red-100",
                            accentText: "text-red-600",
                        },
                        {
                            label: "Mesas libres",
                            value: stats.tablesFree,
                            icon: <LayoutGrid size={18} />,
                            accentBg: "bg-green-100",
                            accentText: "text-green-600",
                        },
                        {
                            label: "Mozos",
                            value: stats.activeWaiters,
                            icon: <Users size={18} />,
                            accentBg: "bg-blue-100",
                            accentText: "text-blue-600",
                        },
                        {
                            label: "Pedidos activos",
                            value: stats.activeOrders,
                            icon: <BarChart3 size={18} />,
                            accentBg: "bg-orange-100",
                            accentText: "text-orange-600",
                        },
                        {
                            label: "Total productos",
                            value: totalProducts,
                            icon: <Package size={18} />,
                            accentBg: "bg-purple-100",
                            accentText: "text-purple-600",
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: i * 0.08,
                                duration: 0.35,
                                ease: "easeOut",
                            }}
                        >
                            <StatCard {...item} />
                        </motion.div>
                    ))}
                </div>
            </section>

            <section>
                <div className="grid xl:grid-cols-2 gap-6">
                    <SalesChart data={sales} />
                </div>
            </section>
        </div>
    );
};

export default AdminDashboardPage;
