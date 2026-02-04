import { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import {
    UserPlus,
    Phone,
    Lock,
    BadgeCheck,
    ChefHat,
    Users,
} from "lucide-react";

type StaffRole = "mozo" | "cocinero";

const AdminCreateWaiterPage = () => {
    const [role, setRole] = useState<StaffRole>("mozo");
    const [codigo, setCodigo] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // 🧹 Limpia campos que no aplican según el rol
    useEffect(() => {
        if (role === "cocinero") {
            setPhone("");
        }
    }, [role]);

    const createStaff = async (e: React.FormEvent) => {
        e.preventDefault();

        const normalizedCode = codigo.trim().toUpperCase();

        if (
            !normalizedCode ||
            !password ||
            (role === "mozo" && !phone)
        ) {
            setMessage("Completa todos los campos requeridos");
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
            body: {
                codigo: normalizedCode,
                password,
                phone: role === "mozo" ? phone : null,
                role, // "mozo" | "cocinero"
            },
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        setLoading(false);

        if (error) {
            setMessage(
                error.message.includes("409")
                    ? "El código ya existe"
                    : "Error al crear usuario"
            );
            return;
        }

        setMessage(
            role === "mozo"
                ? "Mozo creado correctamente"
                : "Cocinero creado correctamente"
        );

        setCodigo("");
        setPassword("");
        setPhone("");
    };

    return (
        <div className="max-w-3xl mx-auto space-y-10">
            <header>
                <h2 className="text-4xl font-black tracking-tight text-zinc-900">
                    Crear personal
                </h2>
                <p className="text-zinc-500 mt-1">
                    Registro de mozos y cocineros
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* FORM */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-lg border border-zinc-200">
                    <form onSubmit={createStaff} className="space-y-6">
                        {/* ROL */}
                        <div>
                            <label className="text-xs font-semibold text-zinc-600 mb-1 block">
                                TIPO DE PERSONAL
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole("mozo")}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold ${role === "mozo"
                                        ? "bg-orange-500 text-white border-orange-500"
                                        : "bg-zinc-50 text-zinc-600"
                                        }`}
                                >
                                    <Users size={16} /> Mozo
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setRole("cocinero")}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold ${role === "cocinero"
                                        ? "bg-emerald-600 text-white border-emerald-600"
                                        : "bg-zinc-50 text-zinc-600"
                                        }`}
                                >
                                    <ChefHat size={16} /> Cocinero
                                </button>
                            </div>
                        </div>

                        {/* CÓDIGO */}
                        <div>
                            <label className="text-xs font-semibold text-zinc-600 flex items-center gap-2">
                                <BadgeCheck size={14} /> CÓDIGO
                            </label>
                            <input
                                type="text"
                                className="mt-1 w-full p-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:ring-2 focus:ring-orange-500"
                                placeholder={role === "mozo" ? "MZ001" : "CK001"}
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value)}
                            />
                        </div>

                        {/* PASSWORD */}
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

                        {/* TELÉFONO SOLO MOZOS */}
                        {role === "mozo" && (
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
                        )}

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !codigo ||
                                !password ||
                                (role === "mozo" && !phone)
                            }
                            className="w-full mt-6 py-3 rounded-full bg-accent hover:bg-accent/80 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <UserPlus size={18} />
                            {loading
                                ? "Creando..."
                                : role === "mozo"
                                    ? "Crear mozo"
                                    : "Crear cocinero"}
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

                {/* ASIDE */}
                <aside className="bg-zinc-900 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-4">
                            Buenas prácticas
                        </h3>
                        <ul className="space-y-3 text-sm text-zinc-300">
                            <li>• Códigos únicos por usuario</li>
                            <li>• Cocineros no requieren teléfono</li>
                            <li>• No compartas contraseñas</li>
                        </ul>
                    </div>

                    <div className="mt-8 text-xs text-zinc-400">
                        Roles sincronizados automáticamente
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default AdminCreateWaiterPage;
