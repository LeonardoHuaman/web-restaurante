import { NavLink } from "react-router-dom";

const AdminTopNav = () => {
    return (
        <header className="w-full bg-primary border-b border-secondary/20">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* IZQUIERDA: LOGO + NOMBRE */}
                <div className="flex items-center gap-3">
                    {/* LOGO */}
                    <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                        🍽️
                    </div>

                    {/* NOMBRE RESTAURANTE */}
                    <span className="font-extrabold text-lg">
                        Liberta
                    </span>
                </div>

                {/* CENTRO: NAVEGACIÓN */}
                <nav className="flex items-center gap-2 bg-secondary/10 rounded-full p-1">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            `px-4 py-1.5 rounded-full text-sm font-semibold transition
               ${isActive ? "bg-secondary text-primary" : "text-secondary"}`
                        }
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/admin/productos"
                        className={({ isActive }) =>
                            `px-4 py-1.5 rounded-full text-sm font-semibold transition
               ${isActive ? "bg-secondary text-primary" : "text-secondary"}`
                        }
                    >
                        Menu
                    </NavLink>

                    <NavLink
                        to="/admin/mesas"
                        className={({ isActive }) =>
                            `px-4 py-1.5 rounded-full text-sm font-semibold transition
               ${isActive ? "bg-secondary text-primary" : "text-secondary"}`
                        }
                    >
                        Tables
                    </NavLink>

                    <NavLink
                        to="/admin/estadisticas"
                        className={({ isActive }) =>
                            `px-4 py-1.5 rounded-full text-sm font-semibold transition
               ${isActive ? "bg-secondary text-primary" : "text-secondary"}`
                        }
                    >
                        Kitchen
                    </NavLink>
                </nav>

                {/* DERECHA: PERFIL */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-sm">
                        AD
                    </div>
                </div>

            </div>
        </header>
    );
};

export default AdminTopNav;
