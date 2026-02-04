import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

const KitchenGuard = ({ children }: { children: JSX.Element }) => {
    const { loading, role } = useAuth();

    if (loading) {
        return <div className="p-4">Cargando sesión...</div>;
    }

    if (role === null) {
        return <Navigate to="/login" replace />;
    }

    if (role !== "cocinero") {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default KitchenGuard;
