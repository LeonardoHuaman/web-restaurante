import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

type UserWithRole = {
    role: {
        name: "admin" | "mozo" | "cocinero";
    };
};

const LoginPage = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const login = async () => {
        setError("");

        let email = identifier;

        /**
         * ============================
         * 1. SI NO ES EMAIL → ES CÓDIGO
         * ============================
         */
        if (!identifier.includes("@")) {
            const { data, error: rpcError } = await supabase.rpc(
                "get_user_email_by_code",
                { p_codigo: identifier }
            );

            if (rpcError || !data) {
                setError("Código inválido");
                return;
            }

            email = data;
        }

        /**
         * ============================
         * 2. LOGIN CON SUPABASE AUTH
         * ============================
         */
        const { error: loginError } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (loginError) {
            setError("Credenciales incorrectas");
            return;
        }

        /**
         * ============================
         * 3. OBTENER SESIÓN
         * ============================
         */
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
            setError("Sesión no disponible");
            return;
        }

        /**
         * ============================
         * 4. OBTENER ROL DESDE DB
         * ============================
         */
        const { data: profile, error: profileError } = await supabase
            .from("users")
            .select("role:role_id(name)")
            .eq("id", session.user.id)
            .single<UserWithRole>();

        if (profileError || !profile) {
            setError("Error al obtener rol");
            return;
        }

        /**
         * ============================
         * 5. REDIRECCIÓN POR ROL
         * ============================
         */
        const role = profile.role.name;

        if (role === "admin") {
            navigate("/admin");
        } else if (role === "mozo") {
            navigate("/waiter");
        } else if (role === "cocinero") {
            navigate("/cocina");
        } else {
            setError("Rol no autorizado");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-primary px-6">
            <div className="w-full max-w-sm bg-secondary text-primary p-6 rounded-2xl shadow-xl">
                <h1 className="text-2xl font-extrabold text-center mb-6">
                    Iniciar sesión
                </h1>

                <div className="space-y-4">
                    <input
                        className="
                            w-full p-3 rounded-lg
                            border border-primary/20
                            bg-secondary
                            text-primary
                            placeholder:text-primary/50
                            focus:outline-none focus:ring-2 focus:ring-accent
                        "
                        placeholder="Email o código (MZ001 / CK001)"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                    />

                    <input
                        type="password"
                        className="
                            w-full p-3 rounded-lg
                            border border-primary/20
                            bg-secondary
                            text-primary
                            placeholder:text-primary/50
                            focus:outline-none focus:ring-2 focus:ring-accent
                        "
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <p className="text-sm text-accent font-medium">
                            {error}
                        </p>
                    )}

                    <button
                        onClick={login}
                        className="
                            w-full py-3 rounded-lg
                            font-semibold
                            bg-accent
                            text-secondary
                            hover:brightness-110
                            transition
                        "
                    >
                        Entrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
