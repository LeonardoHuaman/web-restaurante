import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

type Role = "admin" | "mozo";

type AuthState = {
    loading: boolean;
    role: Role | null;
};

const AuthContext = createContext<AuthState>({
    loading: true,
    role: null,
});

export const AuthProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<Role | null>(null);

    useEffect(() => {
        let mounted = true;

        const loadSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!mounted) return;

            if (!session?.user) {
                setRole(null);
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("users")
                .select("role:role_id(name)")
                .eq("id", session.user.id)
                .single();

            if (error || !data) {
                setRole(null);
                setLoading(false);
                return;
            }

            const rawRole = (data as any).role;

            let roleName: Role | null = null;

            if (Array.isArray(rawRole)) {
                roleName = rawRole[0]?.name ?? null;
            } else if (rawRole && typeof rawRole === "object") {
                roleName = rawRole.name ?? null;
            }

            setRole(roleName);
            setLoading(false);
        };

        loadSession();

        const { data: listener } = supabase.auth.onAuthStateChange(
            () => {
                loadSession();
            }
        );

        return () => {
            mounted = false;
            if (listener?.subscription) {
                listener.subscription.unsubscribe();
            }
        };
    }, []);

    return (
        <AuthContext.Provider value={{ loading, role }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
