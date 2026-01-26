import { useState } from "react";
import { supabase } from "../../services/supabaseClient";

const AdminCreateWaiterPage = () => {
    const [codigo, setCodigo] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const createWaiter = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!codigo || !password || !phone) {
            setMessage("Completa todos los campos");
            return;
        }

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
                body: { codigo, password, phone },
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            }
        );

        setLoading(false);

        if (error) {
            if (error.message.includes("409")) {
                setMessage("El mozo ya existe");
            } else {
                setMessage("Error al crear mozo");
            }
            return;
        }

        setMessage("Mozo creado correctamente");
        setCodigo("");
        setPassword("");
        setPhone("");
    };

    return (
        <div className="max-w-lg bg-primary text-secondary p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-extrabold mb-6">
                Agregar mozo
            </h2>

            <form
                autoComplete="off"
                onSubmit={createWaiter}
                className="space-y-4"
            >
                {/* inputs fake anti-autofill */}
                <input type="text" name="fake-user" autoComplete="username" className="hidden" />
                <input type="password" name="fake-pass" autoComplete="new-password" className="hidden" />

                <input
                    type="text"
                    name="codigo_mozo"
                    autoComplete="off"
                    className="w-full p-3 rounded-lg bg-secondary text-primary"
                    placeholder="Código de mozo (ej: MZ001)"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                />

                <input
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    className="w-full p-3 rounded-lg bg-secondary text-primary"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type="tel"
                    name="phone"
                    autoComplete="off"
                    className="w-full p-3 rounded-lg bg-secondary text-primary"
                    placeholder="Teléfono (ej: +51981234567)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <button
                    type="submit"
                    disabled={loading || !codigo || !password || !phone}
                    className="w-full bg-accent text-secondary py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                    {loading ? "Creando..." : "Crear mozo"}
                </button>

                {message && (
                    <p className="text-sm">
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
};

export default AdminCreateWaiterPage;
