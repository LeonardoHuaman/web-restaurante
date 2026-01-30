import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../../services/supabaseClient";

type UserWithRole = {
    role: {
        name: "admin" | "mozo";
    };
};

const AdminGuard = ({ children }: { children: JSX.Element }) => {
    const [loading, setLoading] = useState(true);
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        const check = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session?.user) {
                setAllowed(false);
                setLoading(false);
                return;
            }

            const { data: profile, error } = await supabase
                .from("users")
                .select("role:role_id(name)")
                .eq("id", session.user.id)
                .single<UserWithRole>();

            if (error || !profile) {
                console.error("AdminGuard profile error:", error);
                setAllowed(false);
            } else {
                setAllowed(profile.role.name === "admin");
            }

            setLoading(false);
        };

        check();
    }, []);

    if (loading) return null;

    if (!allowed) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default AdminGuard;
