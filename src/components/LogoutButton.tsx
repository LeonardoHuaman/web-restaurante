import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
    const navigate = useNavigate();

    const logout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    return (
        <button onClick={logout} className="text-sm text-red-600">
            Cerrar sesión
        </button>
    );
};

export default LogoutButton;
