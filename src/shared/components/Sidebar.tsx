import { NavLink } from "react-router-dom";

export interface SidebarItem {
    label: string;
    to: string;
    icon?: React.ReactNode;
}

interface SidebarProps {
    title: string;
    items: SidebarItem[];
}

const Sidebar = ({ title, items }: SidebarProps) => {
    return (
        <aside
            className="
        w-64 min-h-screen
        bg-primary text-secondary
        border-r border-secondary/30
        flex flex-col
      "
        >
            <div className="px-6 py-5 border-b border-secondary/30">
                <h1 className="text-xl font-extrabold text-secondary">
                    {title}
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {items.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end
                        className={({ isActive }) =>
                            `
              flex items-center gap-3 px-4 py-3 rounded-lg
              transition-colors font-medium
              ${isActive
                                ? "bg-secondary text-primary"
                                : "text-secondary hover:bg-secondary/10"
                            }
              `
                        }
                    >
                        {item.icon && (
                            <span className="w-5 h-5 shrink-0">
                                {item.icon}
                            </span>
                        )}

                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
