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
import { usePeopleTodayByHour } from "../../hooks/usePeopleTodayByHour";
import PeopleChart from "../../components/admin/PeopleChart";

/* ---------- COMPONENTES ---------- */

const QuickAction = ({
    icon,
    label,
    onClick,
    iconBg,
    iconColor,
}: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    iconBg: string;
    iconColor: string;
}) => (
    <button
        onClick={onClick}
        className="
      group relative
      flex items-center gap-4
      p-4 sm:p-5
      h-20 sm:h-24
      w-full
      rounded-2xl
      bg-secondary text-primary
      transition-all
      hover:-translate-y-1 hover:shadow-xl
      active:scale-[0.97]
      overflow-hidden
    "
    >
        <div
            className={`
        absolute inset-0 opacity-0
        group-hover:opacity-100
        transition
        ${iconBg} blur-2xl
      `}
        />
        <div
            className={`
        relative z-10
        w-12 h-12 sm:w-14 sm:h-14
        flex items-center justify-center
        rounded-2xl
        ${iconBg} ${iconColor}
        shadow-lg
        group-hover:scale-110 transition
      `}
        >
            {icon}
        </div>
        <span className="relative z-10 font-semibold text-base sm:text-lg">
            {label}
        </span>
    </button>
);

const StatCard = ({
    label,
    value,
    icon,
    accentBg,
    accentText,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    accentBg: string;
    accentText: string;
}) => (
    <div
        className="
      relative
      bg-secondary text-primary
      rounded-2xl p-4 sm:p-6
      shadow-md
      flex items-center gap-4
      sm:block
    "
    >
        <div
            className={`
        sm:absolute sm:top-4 sm:right-4
        w-10 h-10
        flex items-center justify-center
        rounded-full
        ${accentBg} ${accentText}
      `}
        >
            {icon}
        </div>

        <div>
            <p className="text-xs sm:text-sm font-semibold text-primary/60">
                {label}
            </p>
            <p className="text-2xl sm:text-4xl font-extrabold">
                {value}
            </p>
        </div>
    </div>
);

/* ---------- PAGE ---------- */

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const stats = useAdminDashboardRealtime();
    const people = usePeopleTodayByHour();
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .then(({ count }) => count && setTotalProducts(count));
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
            path: "/admin/menu",
            iconBg: "bg-gradient-to-br from-orange-500 to-red-600",
            iconColor: "text-white",
        },
        {
            icon: <Layers />,
            label: "Crear categoría",
            path: "/admin/menu",
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
            {/* QUICK ACTIONS */}
            <section>
                <h2 className="text-xl font-bold mb-4">
                    Acciones rápidas
                </h2>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {actions.map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                        >
                            <QuickAction
                                {...item}
                                onClick={() => navigate(item.path)}
                            />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ESTADO DEL RESTAURANTE */}
            <section>
                <h2 className="text-xl font-bold mb-4">
                    Estado del restaurante
                </h2>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-5">
                    <StatCard
                        label="Mesas ocupadas"
                        value={stats.tablesOccupied}
                        icon={<UtensilsCrossed size={18} />}
                        accentBg="bg-red-100"
                        accentText="text-red-600"
                    />
                    <StatCard
                        label="Mesas libres"
                        value={stats.tablesFree}
                        icon={<LayoutGrid size={18} />}
                        accentBg="bg-green-100"
                        accentText="text-green-600"
                    />
                    <StatCard
                        label="Mozos activos"
                        value={stats.activeWaiters}
                        icon={<Users size={18} />}
                        accentBg="bg-blue-100"
                        accentText="text-blue-600"
                    />
                    <StatCard
                        label="Pedidos activos"
                        value={stats.activeOrders}
                        icon={<BarChart3 size={18} />}
                        accentBg="bg-orange-100"
                        accentText="text-orange-600"
                    />
                    <StatCard
                        label="Total productos"
                        value={totalProducts}
                        icon={<Package size={18} />}
                        accentBg="bg-purple-100"
                        accentText="text-purple-600"
                    />
                </div>
            </section>

            {/* GRÁFICA */}
            <section>
                <div className="bg-secondary rounded-2xl p-3 sm:p-6 overflow-x-auto">
                    <div className="min-w-[600px] sm:min-w-0">
                        <PeopleChart data={people} />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboardPage;
