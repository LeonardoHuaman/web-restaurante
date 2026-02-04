import { NavLink } from "react-router-dom";
import { useRestaurantSettings } from "../../features/restaurant/useRestaurantSettings";
import { Menu } from "lucide-react";
import { useState } from "react";

const KitchenTopNav = () => {
    const settings = useRestaurantSettings();
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-30 w-full bg-primary border-b border-secondary/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* LEFT: Logo + Name + Cocina */}
                <div className="hidden sm:flex items-center gap-3">
                    {settings?.logo_url && (
                        <img
                            src={settings.logo_url}
                            className="h-9 w-9 object-contain"
                            alt="Restaurant Logo"
                        />
                    )}

                    {settings?.name && (
                        <span className="font-extrabold text-lg">
                            {settings.name}
                            <span className="ml-2 text-secondary/60 font-semibold text-accent">
                                Cocina
                            </span>
                        </span>
                    )}
                </div>

                {/* MOBILE MENU BUTTON */}
                <button
                    onClick={() => setOpen(!open)}
                    className="sm:hidden p-2 rounded-lg bg-secondary/10"
                >
                    <Menu size={20} />
                </button>

                {/* CENTER NAV */}
                <nav className="hidden sm:flex gap-2 bg-secondary/10 rounded-full p-1">
                    <NavLink
                        to="/cocina"
                        end
                        className={({ isActive }) =>
                            `px-4 py-1.5 rounded-full text-sm font-semibold
              ${isActive ? "bg-secondary text-primary" : "text-secondary"}`
                        }
                    >
                        Comandas
                    </NavLink>

                    <NavLink
                        to="/cocina/stock"
                        className={({ isActive }) =>
                            `px-4 py-1.5 rounded-full text-sm font-semibold
              ${isActive ? "bg-secondary text-primary" : "text-secondary"}`
                        }
                    >
                        Stock
                    </NavLink>
                </nav>

                {/* RIGHT: ROLE */}
                <div className="hidden sm:flex items-center gap-3">
                    <div className="text-sm font-semibold text-secondary">
                        Chef Principal
                    </div>
                </div>
            </div>

            {/* MOBILE DROPDOWN */}
            {open && (
                <div className="sm:hidden border-t border-secondary/20 bg-primary px-4 py-3 space-y-2">
                    <NavLink
                        to="/cocina"
                        end
                        onClick={() => setOpen(false)}
                        className="block py-2 font-semibold"
                    >
                        Comandas
                    </NavLink>

                    <NavLink
                        to="/cocina/stock"
                        onClick={() => setOpen(false)}
                        className="block py-2 font-semibold"
                    >
                        Stock
                    </NavLink>

                    <div className="pt-2 text-sm text-secondary font-semibold">
                        Chef Principal
                    </div>
                </div>
            )}
        </header>
    );
};

export default KitchenTopNav;
