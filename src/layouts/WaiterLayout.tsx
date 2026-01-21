import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Utensils } from "lucide-react";

const WaiterLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string, exact = false) => {
        if (exact) {
            return location.pathname === path
                ? "bg-white text-black"
                : "text-gray-300";
        }

        return location.pathname.startsWith(path)
            ? "bg-white text-black"
            : "text-gray-300";
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            <aside className="w-64 bg-black p-4 space-y-4">
                <h1 className="text-white text-xl font-bold mb-6">
                    Panel del mozo
                </h1>

                <button
                    onClick={() => navigate("/waiter")}
                    className={`flex gap-3 p-3 rounded-lg w-full ${isActive(
                        "/waiter",
                        true
                    )}`}
                >
                    <Home size={20} /> Mesas disponibles
                </button>

                <button
                    onClick={() => navigate("/waiter/my-tables")}
                    className={`flex gap-3 p-3 rounded-lg w-full ${isActive(
                        "/waiter/my-tables"
                    )}`}
                >
                    <Utensils size={20} /> Mis mesas
                </button>
            </aside>

            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default WaiterLayout;
