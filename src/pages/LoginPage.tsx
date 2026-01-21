import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

/**
 * Perfil con rol (relación 1–1)
 */
type UserWithRole = {
    role: {
        name: "admin" | "mozo";
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

        // 🧑‍🍳 LOGIN POR CÓDIGO DE MOZO
        if (!identifier.includes("@")) {
            const { data, error: rpcError } = await supabase.rpc(
                "get_waiter_email",
                { p_codigo: identifier }
            );

            if (rpcError || !data) {
                setError("Código de mozo inválido");
                return;
            }

            email = data;
        }

        // 🔐 LOGIN SUPABASE
        const { error: loginError } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (loginError) {
            setError("Credenciales incorrectas");
            return;
        }

        // ⭐ USAR SESSION (correcto)
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
            setError("Sesión no disponible");
            return;
        }

        // 🎭 OBTENER ROL (tipado explícito)
        const { data: profile, error: profileError } = await supabase
            .from("users")
            .select("role:role_id(name)")
            .eq("id", session.user.id)
            .single<UserWithRole>();

        if (profileError || !profile) {
            console.error(profileError);
            setError("Error al obtener rol");
            return;
        }

        const role = profile.role.name;

        // 🚦 REDIRECCIÓN
        if (role === "admin") {
            navigate("/admin");
        } else if (role === "mozo") {
            navigate("/waiter");
        } else {
            setError("Rol no autorizado");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-sm">
                <h1 className="text-2xl font-extrabold text-center mb-6">
                    Iniciar sesión
                </h1>

                <div className="space-y-4">
                    <input
                        className="w-full border p-3 rounded-lg"
                        placeholder="Email (admin) o código de mozo"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                    />

                    <input
                        type="password"
                        className="w-full border p-3 rounded-lg"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <p className="text-red-600 text-sm">{error}</p>
                    )}

                    <button
                        onClick={login}
                        className="w-full bg-black text-white py-3 rounded-lg font-semibold"
                    >
                        Entrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
