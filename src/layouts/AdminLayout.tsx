import { Outlet } from "react-router-dom";
import AdminTopNav from "../components/admin/AdminTopNav";

const AdminLayout = () => {
    return (
        <div className="h-screen flex flex-col bg-primary text-secondary overflow-hidden">
            {/* TOP NAV */}
            <AdminTopNav />

            {/* CONTENIDO */}
            <main className="flex-1 overflow-y-auto px-8 py-6 bg-primary">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
