// src/pages/admin/AdminCreateWaiterPage.tsx
import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { UserPlus, Phone, Lock, BadgeCheck } from "lucide-react";

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

        const { error } = await supabase.functions.invoke("create_waiter", {
            body: { codigo, password, phone },
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        setLoading(false);

        if (error) {
            setMessage(
                error.message.includes("409")
                    ? "El mozo ya existe"
                    : "Error al crear mozo"
            );
            return;
        }

        setMessage("Mozo creado correctamente");
        setCodigo("");
        setPassword("");
        setPhone("");
    };

    return (
        <div className="max-w-3xl mx-auto space-y-10">
            {/* HEADER */}
            <header>
                <h2 className="text-4xl font-black tracking-tight text-zinc-900">
                    Crear mozo
                </h2>
                <p className="text-zinc-500 mt-1">
                    Registro rápido y seguro de personal
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* FORM */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-lg border border-zinc-200">
                    <form onSubmit={createWaiter} className="space-y-6">
                        {/* fake inputs anti-autofill */}
                        <input type="text" name="fake-user" autoComplete="username" className="hidden" />
                        <input type="password" name="fake-pass" autoComplete="new-password" className="hidden" />

                        <div>
                            <label className="text-xs font-semibold text-zinc-600 flex items-center gap-2">
                                <BadgeCheck size={14} /> CÓDIGO DEL MOZO
                            </label>
                            <input
                                type="text"
                                className="mt-1 w-full p-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:ring-2 focus:ring-orange-500"
                                placeholder="Ej: MZ001"
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-zinc-600 flex items-center gap-2">
                                <Lock size={14} /> CONTRASEÑA
                            </label>
                            <input
                                type="password"
                                className="mt-1 w-full p-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:ring-2 focus:ring-orange-500"
                                placeholder="Contraseña segura"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-zinc-600 flex items-center gap-2">
                                <Phone size={14} /> TELÉFONO
                            </label>
                            <input
                                type="tel"
                                className="mt-1 w-full p-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:ring-2 focus:ring-orange-500"
                                placeholder="+51981234567"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !codigo || !password || !phone}
                            className="w-full mt-6 py-3 rounded-full bg-accent hover:bg-accent/80 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <UserPlus size={18} />
                            {loading ? "Creando..." : "Crear mozo"}
                        </button>

                        {message && (
                            <p
                                className={`text-sm font-semibold ${message.includes("correctamente")
                                    ? "text-emerald-600"
                                    : "text-rose-600"
                                    }`}
                            >
                                {message}
                            </p>
                        )}
                    </form>
                </div>

                {/* INFO CARD */}
                <aside className="bg-zinc-900 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-4">
                            Buenas prácticas
                        </h3>
                        <ul className="space-y-3 text-sm text-zinc-300">
                            <li>• Usa códigos únicos (MZ001, MZ002…)</li>
                            <li>• Contraseñas distintas por mozo</li>
                            <li>• Teléfono real para recuperación</li>
                        </ul>
                    </div>

                    <div className="mt-8 text-xs text-zinc-400">
                        Los accesos se sincronizan automáticamente
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default AdminCreateWaiterPage;
