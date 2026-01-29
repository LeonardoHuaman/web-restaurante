import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { useRestaurantSettings } from "../../hooks/useRestaurantSettings";

const AdminTopNav = () => {
    const navigate = useNavigate();
    const settings = useRestaurantSettings();

    const logout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-30 w-full h-16 bg-primary border-b border-secondary/20">
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

                <div className="flex items-center gap-3">
                    {settings?.logo_url ? (
                        <img src={settings.logo_url} className="h-9 w-9 object-contain" />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                            🍽️
                        </div>
                    )}
                    <span className="font-extrabold text-lg">
                        {settings?.name ?? "Restaurante"}
                    </span>
                </div>

                <nav className="flex gap-2 bg-secondary/10 rounded-full p-1">
                    <NavLink to="/admin" end className={({ isActive }) =>
                        `px-4 py-1.5 rounded-full text-sm font-semibold
                        ${isActive ? "bg-secondary text-primary" : "text-secondary"}`
                    }>
                        Dashboard
                    </NavLink>

                    <NavLink to="/admin/menu" className={({ isActive }) =>
                        `px-4 py-1.5 rounded-full text-sm font-semibold
                        ${isActive ? "bg-secondary text-primary" : "text-secondary"}`
                    }>
                        Menu
                    </NavLink>

                    <NavLink to="/admin/mesas" className={({ isActive }) =>
                        `px-4 py-1.5 rounded-full text-sm font-semibold
                        ${isActive ? "bg-secondary text-primary" : "text-secondary"}`
                    }>
                        Tables
                    </NavLink>

                    <NavLink to="/admin/estadisticas" className={({ isActive }) =>
                        `px-4 py-1.5 rounded-full text-sm font-semibold
                        ${isActive ? "bg-secondary text-primary" : "text-secondary"}`
                    }>
                        Kitchen
                    </NavLink>
                </nav>

                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-sm">
                        AD
                    </div>
                    <button onClick={logout} className="text-sm text-red-500 hover:underline">
                        Salir
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminTopNav;
