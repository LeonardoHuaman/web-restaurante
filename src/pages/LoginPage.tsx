// src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

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

        // 🧑‍🍳 Login por código de mozo
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

        const { error: loginError } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (loginError) {
            setError("Credenciales incorrectas");
            return;
        }

        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
            setError("Sesión no disponible");
            return;
        }

        const { data: profile, error: profileError } = await supabase
            .from("users")
            .select("role:role_id(name)")
            .eq("id", session.user.id)
            .single<UserWithRole>();

        if (profileError || !profile) {
            setError("Error al obtener rol");
            return;
        }

        const role = profile.role.name;

        if (role === "admin") navigate("/admin");
        else if (role === "mozo") navigate("/waiter");
        else setError("Rol no autorizado");
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
                        placeholder="Email (admin) o código de mozo"
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
