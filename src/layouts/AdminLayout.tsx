import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import LogoutButton from "../components/LogoutButton";

const AdminLayout = () => {
    return (
        <div className="flex">
            <Sidebar
                title="Administrador"
                items={[
                    { label: "Agregar mozo", to: "/admin" },
                ]}
            />

            <main className="flex-1 p-8 bg-gray-50 min-h-screen">
                <div className="flex justify-end mb-6">
                    <LogoutButton />
                </div>

                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
