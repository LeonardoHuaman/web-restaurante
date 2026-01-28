// src/pages/admin/AdminDashboardPage.tsx
import { useNavigate } from "react-router-dom";
import {
    UserPlus,
    Pizza,
    Layers,
    LayoutGrid,
    BarChart3,
    Users,
    UtensilsCrossed,
} from "lucide-react";

import { useAdminDashboardRealtime } from "../../hooks/useAdminDashboardRealtime";
import { useSalesTodayByHour } from "../../hooks/useSalesTodayByHour";
import { SalesChart } from "../../components/admin/SalesChart";

const QuickAction = ({
    icon,
    label,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className="flex items-center gap-4 p-5 rounded-xl bg-secondary text-primary active:scale-[0.98]"
    >
        <div className="p-3 rounded-xl bg-primary text-secondary">
            {icon}
        </div>
        <span className="font-semibold text-lg">{label}</span>
    </button>
);

const StatCard = ({
    label,
    value,
    icon,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
}) => (
    <div className="p-5 rounded-xl bg-secondary text-primary flex items-center gap-4">
        <div className="p-3 rounded-xl bg-primary text-secondary">
            {icon}
        </div>
        <div>
            <p className="text-sm text-primary/60">{label}</p>
            <p className="text-3xl font-extrabold">{value}</p>
        </div>
    </div>
);

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const stats = useAdminDashboardRealtime();
    const sales = useSalesTodayByHour();

    return (
        <div className="space-y-10 pb-6">
            <div>
                <h1 className="text-3xl font-extrabold">Dashboard</h1>
                <p className="text-secondary/60">
                    Control general del restaurante
                </p>
            </div>

            <section>
                <h2 className="text-xl font-bold mb-4">
                    Acciones rápidas
                </h2>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    <QuickAction icon={<UserPlus />} label="Agregar mozo" onClick={() => navigate("/admin/mozos")} />
                    <QuickAction icon={<Pizza />} label="Agregar producto" onClick={() => navigate("/admin/productos")} />
                    <QuickAction icon={<Layers />} label="Crear categoría" onClick={() => navigate("/admin/categorias")} />
                    <QuickAction icon={<LayoutGrid />} label="Ver mesas" onClick={() => navigate("/admin/mesas")} />
                    <QuickAction icon={<BarChart3 />} label="Estadísticas" onClick={() => navigate("/admin/estadisticas")} />
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-4">
                    Estado del restaurante
                </h2>

                <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Mesas ocupadas" value={stats.tablesOccupied} icon={<UtensilsCrossed />} />
                    <StatCard label="Mesas libres" value={stats.tablesFree} icon={<LayoutGrid />} />
                    <StatCard label="Mozos" value={stats.activeWaiters} icon={<Users />} />
                    <StatCard label="Pedidos activos" value={stats.activeOrders} icon={<BarChart3 />} />
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
