import { useState } from "react";
import { supabase } from "../../services/supabaseClient";

const AdminCreateWaiterPage = () => {
    const [codigo, setCodigo] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const createWaiter = async () => {
        setMessage("");
        setLoading(true);

        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            setMessage("Sesión no válida");
            setLoading(false);
            return;
        }

        const { error } = await supabase.functions.invoke(
            "create_waiter",
            {
                body: { codigo, password },
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            }
        );

        setLoading(false);

        if (error) {
            console.error(error);
            setMessage("Error al crear mozo");
            return;
        }

        setMessage("Mozo creado correctamente");
        setCodigo("");
        setPassword("");
    };


    return (
        <div className="max-w-lg">
            <h2 className="text-2xl font-extrabold mb-6">
                Agregar mozo
            </h2>

            <div className="space-y-4">
                <input
                    className="w-full border p-3 rounded-lg"
                    placeholder="Código de mozo (ej: MZ001)"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                />

                <input
                    type="password"
                    className="w-full border p-3 rounded-lg"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={createWaiter}
                    disabled={loading || !codigo || !password}
                    className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                    {loading ? "Creando..." : "Crear mozo"}
                </button>

                {message && (
                    <p className="text-sm">{message}</p>
                )}
            </div>
        </div>
    );
};

export default AdminCreateWaiterPage;
