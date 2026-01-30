import { Outlet } from "react-router-dom";
import AdminTopNav from "../components/admin/AdminTopNav";
import AdminSafeWrapper from "../components/layout/AdminSafeWrapper";

const AdminLayout = () => {
    return (
        <AdminSafeWrapper>
            {/* CONTENEDOR RAÍZ */}
            <div className="min-h-full flex flex-col bg-primary text-secondary">

                {/* TOP NAV */}
                <AdminTopNav />

                {/* CONTENIDO SCROLLEABLE */}
                <main
                    className="
                        flex-1
                        overflow-y-auto
                        px-6 sm:px-8
                        py-6
                        bg-primary
                    "
                >
                    <Outlet />
                </main>

            </div>
        </AdminSafeWrapper>
    );
};

export default AdminLayout;
