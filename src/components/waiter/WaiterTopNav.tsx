import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { useRestaurantSettings } from "../../hooks/useRestaurantSettings";
import { Menu } from "lucide-react";
import { useState } from "react";

const WaiterTopNav = () => {
    const navigate = useNavigate();
    const settings = useRestaurantSettings();
    const [open, setOpen] = useState(false);

    const logout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-30 w-full bg-primary border-b border-secondary/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

                <div className="hidden sm:flex items-center gap-3">
                    {settings?.logo_url ? (
                        <img
                            src={settings.logo_url}
                            className="h-9 w-9 object-contain"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                            🍽️
                        </div>
                    )}
                    <span className="font-extrabold text-lg">
                        {settings?.name ?? "Restaurante"}
                    </span>
                </div>

                <button
                    onClick={() => setOpen(!open)}
                    className="sm:hidden p-2 rounded-lg bg-secondary/10"
                >
                    <Menu size={20} />
                </button>

                <nav className="hidden sm:flex gap-2 bg-secondary/10 rounded-full p-1">
                    <NavLink
                        to="/waiter"
                        end
                        className={({ isActive }) =>
                            `px-4 py-1.5 rounded-full text-sm font-semibold
                            ${isActive ? "bg-secondary text-primary" : "text-secondary"}`
                        }
                    >
                        Tables available
                    </NavLink>

                    <NavLink
                        to="/waiter/my-tables"
                        className={({ isActive }) =>
                            `px-4 py-1.5 rounded-full text-sm font-semibold
                            ${isActive ? "bg-secondary text-primary" : "text-secondary"}`
                        }
                    >
                        My tables
                    </NavLink>
                </nav>

                <div className="hidden sm:flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-sm">
                        MZ
                    </div>
                    <button
                        onClick={logout}
                        className="text-sm text-red-500 hover:underline"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {open && (
                <div className="sm:hidden border-t border-secondary/20 bg-primary px-4 py-3 space-y-2">
                    <NavLink
                        to="/waiter"
                        end
                        onClick={() => setOpen(false)}
                        className="block py-2 font-semibold"
                    >
                        Tables available
                    </NavLink>

                    <NavLink
                        to="/waiter/my-tables"
                        onClick={() => setOpen(false)}
                        className="block py-2 font-semibold"
                    >
                        My tables
                    </NavLink>

                    <button
                        onClick={logout}
                        className="block w-full text-left py-2 text-red-500 font-semibold"
                    >
                        Salir
                    </button>
                </div>
            )}
        </header>
    );
};

export default WaiterTopNav;
