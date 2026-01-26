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
} from "lucide-react";

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-primary text-secondary">
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
                ]}
            />

            {/* CONTENIDO */}
            <main className="flex-1 flex flex-col bg-primary text-secondary">
                {/* TOP BAR */}
                <div className="flex justify-end px-8 py-4 border-b border-secondary/30">
                    <LogoutButton />
                </div>

                {/* PAGE CONTENT */}
                <div className="flex-1 p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
