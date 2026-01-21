import { Navigate } from "react-router-dom";
import { useTableStore } from "../../stores/tableStore";

const TableGuard = ({ children }: { children: JSX.Element }) => {
    const { isReady, isLoading } = useTableStore();

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <span>Cargando mesa...</span>
            </div>
        );
    }

    if (!isReady) {
        return <Navigate to="/invalid-table" replace />;
    }

    return children;
};

export default TableGuard;
