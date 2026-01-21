import { NavLink } from "react-router-dom";

interface SidebarItem {
    label: string;
    to: string;
}

interface Props {
    title: string;
    items: SidebarItem[];
}

const Sidebar = ({ title, items }: Props) => {
    return (
        <aside className="w-64 bg-black text-white min-h-screen p-5">
            <h1 className="text-xl font-extrabold mb-8">{title}</h1>

            <nav className="space-y-3">
                {items.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `block px-4 py-2 rounded-lg font-medium ${isActive
                                ? "bg-black"
                                : "hover:bg-gray-800"
                            }`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
