import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Utensils } from "lucide-react";

const WaiterLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string, exact = false) => {
        if (exact) {
            return location.pathname === path
                ? "bg-secondary text-primary"
                : "text-secondary/70";
        }

        return location.pathname.startsWith(path)
            ? "bg-secondary text-primary"
            : "text-secondary/70";
    };

    return (
        <div className="h-screen flex bg-primary text-secondary">
            {/* SIDEBAR */}
            <aside className="w-64 bg-primary border-r border-secondary/10 p-4">
                <h1 className="text-xl font-extrabold mb-8">
                    Panel del mozo
                </h1>

                <div className="space-y-2">
                    <button
                        onClick={() => navigate("/waiter")}
                        className={`w-full flex gap-3 items-center px-4 py-3 rounded-xl transition hover:bg-secondary/10 ${isActive("/waiter", true)}`}
                    >
                        <Home size={20} />
                        Mesas disponibles
                    </button>

                    <button
                        onClick={() => navigate("/waiter/my-tables")}
                        className={`w-full flex gap-3 items-center px-4 py-3 rounded-xl transition hover:bg-secondary/10 ${isActive("/waiter/my-tables")}`}
                    >
                        <Utensils size={20} />
                        Mis mesas
                    </button>
                </div>
            </aside>

            {/* CONTENIDO */}
            <main className="flex-1 overflow-y-auto bg-primary">
                <Outlet />
            </main>
        </div>
    );
};

export default WaiterLayout;
