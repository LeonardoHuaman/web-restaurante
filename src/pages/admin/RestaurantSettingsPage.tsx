import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import {
    Upload,
    Save,
    Clock,
    Store,
    Image as ImageIcon,
} from "lucide-react";

const RestaurantSettingsPage = () => {
    const [id, setId] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    const [openingHour, setOpeningHour] = useState<number>(8);
    const [closingHour, setClosingHour] = useState<number>(23);

    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const { data } = await supabase
                .from("restaurant_settings")
                .select("id, name, logo_url, opening_hour, closing_hour")
                .single();

            if (data) {
                setId(data.id);
                setName(data.name ?? "");
                setLogoUrl(data.logo_url ?? null);
                setOpeningHour(data.opening_hour ?? 8);
                setClosingHour(data.closing_hour ?? 23);
            }
        };

        load();
    }, []);

    const showSuccess = (msg: string) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(null), 3000);
    };

    const saveGeneral = async () => {
        if (!id || !name.trim()) return;

        setSaving(true);

        await supabase
            .from("restaurant_settings")
            .update({
                name: name.trim(),
                opening_hour: openingHour,
                closing_hour: closingHour,
            })
            .eq("id", id);

        setSaving(false);
        showSuccess("Configuración guardada correctamente");
    };

    const uploadLogo = async (file: File) => {
        setError(null);
        if (!id) return;

        if (file.type !== "image/png") {
            setError("El logo debe ser un archivo PNG");
            return;
        }

        setUploading(true);

        const filePath = `logo-${id}.png`;

        const { error: uploadError } = await supabase.storage
            .from("restaurant-assets")
            .upload(filePath, file, { upsert: true });

        if (uploadError) {
            setError("Error al subir el logo");
            setUploading(false);
            return;
        }

        const { data } = supabase.storage
            .from("restaurant-assets")
            .getPublicUrl(filePath);

        await supabase
            .from("restaurant_settings")
            .update({ logo_url: data.publicUrl })
            .eq("id", id);

        setLogoUrl(data.publicUrl);
        setUploading(false);
        showSuccess("Logo actualizado correctamente");
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            <header>
                <h1 className="text-4xl font-black tracking-tight text-zinc-900">
                    Settings
                </h1>
                <p className="text-zinc-500 mt-1">
                    Configuración general del restaurante
                </p>
            </header>

            {success && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-600 font-semibold">
                    {success}
                </div>
            )}

            {error && (
                <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-600 font-semibold">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-xl border border-zinc-200 space-y-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wide text-zinc-600 flex items-center gap-2">
                            <Store size={14} />
                            NOMBRE DEL RESTAURANTE
                        </label>

                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nombre del restaurante"
                            className="
                                w-full p-4 rounded-2xl
                                bg-zinc-50 border border-zinc-300
                                focus:ring-2 focus:ring-indigo-400
                            "
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold tracking-wide text-zinc-600 flex items-center gap-2">
                            <Clock size={14} />
                            HORARIO DE ATENCIÓN
                        </label>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs text-zinc-500">
                                    Apertura
                                </span>
                                <select
                                    value={openingHour}
                                    onChange={(e) =>
                                        setOpeningHour(Number(e.target.value))
                                    }
                                    className="
                                        w-full mt-1 p-3 rounded-xl
                                        bg-gradient-to-br from-indigo-50 to-sky-50
                                        border border-indigo-200
                                        font-semibold text-indigo-700
                                    "
                                >
                                    {Array.from({ length: 24 }, (_, h) => (
                                        <option key={h} value={h}>
                                            {String(h).padStart(2, "0")}:00
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <span className="text-xs text-zinc-500">
                                    Cierre
                                </span>
                                <select
                                    value={closingHour}
                                    onChange={(e) =>
                                        setClosingHour(Number(e.target.value))
                                    }
                                    className="
                                        w-full mt-1 p-3 rounded-xl
                                        bg-gradient-to-br from-rose-50 to-orange-50
                                        border border-rose-200
                                        font-semibold text-rose-700
                                    "
                                >
                                    {Array.from({ length: 24 }, (_, h) => (
                                        <option key={h} value={h}>
                                            {String(h).padStart(2, "0")}:00
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={saveGeneral}
                        disabled={saving}
                        className="
                            mt-4 w-full py-3 rounded-full
                            bg-accent
                            text-white font-bold
                            hover:brightness-110
                            transition
                            disabled:opacity-50
                        "
                    >
                        {saving ? "Guardando..." : "Guardar configuración"}
                    </button>
                </div>

                <aside className="bg-zinc-900 text-white rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <ImageIcon size={18} />
                            Logo
                        </h3>
                        <p className="text-sm text-zinc-400 mt-1">
                            Imagen visible en todo el sistema
                        </p>
                    </div>

                    {logoUrl && (
                        <img
                            src={logoUrl}
                            alt="Logo actual"
                            className="h-24 object-contain bg-white rounded-2xl p-3"
                        />
                    )}

                    <label
                        className="
                            flex flex-col items-center justify-center
                            border-2 border-dashed border-zinc-600
                            rounded-2xl p-6
                            cursor-pointer
                            hover:bg-zinc-800
                            transition
                        "
                    >
                        <Upload className="w-6 h-6 mb-2" />
                        <span className="text-sm">
                            {uploading
                                ? "Subiendo logo..."
                                : "Subir logo (PNG)"}
                        </span>

                        <input
                            type="file"
                            accept="image/png"
                            hidden
                            onChange={(e) =>
                                e.target.files &&
                                uploadLogo(e.target.files[0])
                            }
                        />
                    </label>
                </aside>
            </div>
        </div>
    );
};

export default RestaurantSettingsPage;
