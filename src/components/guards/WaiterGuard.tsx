import { Navigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

const WaiterGuard = ({ children }: { children: JSX.Element }) => {
    const { loading, role } = useAuth();
    if (loading) {
        return <div className="p-4">Cargando sesión...</div>;
    }

    if (role === null) {
        return <Navigate to="/login" replace />;
    }

    if (role !== "mozo") {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default WaiterGuard;
