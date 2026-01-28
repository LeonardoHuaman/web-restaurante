import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import LogoutButton from "../components/LogoutButton";
import {
    LayoutDashboard,
    UserPlus,
    Layers,
    Pizza,
    LayoutGrid,
    BarChart3,
    Settings,
} from "lucide-react";

const AdminLayout = () => {
    return (
        <div className="flex h-screen bg-primary text-secondary">
            {/* SIDEBAR */}
            <Sidebar
                title="Administrador"
                items={[
                    {
                        label: "Dashboard",
                        to: "/admin",
                        icon: <LayoutDashboard />,
                    },
                    {
                        label: "Crear mozo",
                        to: "/admin/mozos",
                        icon: <UserPlus />,
                    },
                    {
                        label: "Categorías",
                        to: "/admin/categorias",
                        icon: <Layers />,
                    },
                    {
                        label: "Productos",
                        to: "/admin/productos",
                        icon: <Pizza />,
                    },
                    {
                        label: "Mesas",
                        to: "/admin/mesas",
                        icon: <LayoutGrid />,
                    },
                    {
                        label: "Estadísticas",
                        to: "/admin/estadisticas",
                        icon: <BarChart3 />,
                    },
                    {
                        label: "Configuración",
                        to: "/admin/configuracion",
                        icon: <Settings />,
                    },
                ]}
            />

            {/* CONTENIDO */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* TOP BAR */}
                <div className="flex justify-end px-8 py-4 border-b border-secondary/30 shrink-0">
                    <LogoutButton />
                </div>

                {/* PAGE CONTENT */}
                <div className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
