import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { Upload, Save } from "lucide-react";

const RestaurantSettingsPage = () => {
    const [id, setId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    /* =====================
       CARGAR CONFIG
    ===================== */
    useEffect(() => {
        const load = async () => {
            const { data } = await supabase
                .from("restaurant_settings")
                .select("id, name, logo_url")
                .single();

            if (data) {
                setId(data.id);
                setName(data.name ?? "");
                setLogoUrl(data.logo_url ?? null);
            }
        };

        load();
    }, []);

    /* =====================
       GUARDAR NOMBRE (OPCIONAL)
    ===================== */
    const saveName = async () => {
        if (!id || !name.trim()) return;

        await supabase
            .from("restaurant_settings")
            .update({ name: name.trim() })
            .eq("id", id);

        setSuccess("Nombre del restaurante actualizado");
        setTimeout(() => setSuccess(null), 3000);
    };


    /* =====================
       SUBIR LOGO (PNG ONLY)
    ===================== */
    const uploadLogo = async (file: File) => {
        setError(null);

        if (!id) return;

        // 🔒 VALIDACIÓN PNG
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

        setSuccess("Logo actualizado correctamente");
        setTimeout(() => setSuccess(null), 3000);

    };

    return (
        <div className="max-w-xl space-y-8">
            <h1 className="text-2xl font-bold">
                Configuración del restaurante
            </h1>
            {success && (
                <div className="p-3 rounded-lg bg-green-500/10 text-green-600 text-sm">
                    {success}
                </div>
            )}
            {/* ERROR */}
            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                    {error}
                </div>
            )}

            {/* =====================
         NOMBRE (INDEPENDIENTE)
      ===================== */}
            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Nombre del restaurante
                </label>

                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre del restaurante"
                    className="
            w-full p-3 rounded-xl
            bg-secondary text-primary
            outline-none
          "
                />

                <button
                    onClick={saveName}
                    className="
            inline-flex items-center gap-2
            px-4 py-2
            rounded-xl
            bg-accent text-white
          "
                >
                    <Save className="w-4 h-4" />
                    Guardar nombre
                </button>
            </div>

            {/* =====================
         LOGO (PNG ONLY)
      ===================== */}
            <div className="space-y-3">
                <label className="text-sm font-medium">
                    Logo del restaurante (PNG)
                </label>

                {logoUrl && (
                    <img
                        src={logoUrl}
                        alt="Logo actual"
                        className="h-20 object-contain"
                    />
                )}

                <label
                    className="
            flex flex-col items-center justify-center
            border-2 border-dashed border-secondary/40
            rounded-xl p-6
            cursor-pointer
            hover:bg-secondary/10
          "
                >
                    <Upload className="w-6 h-6 mb-2" />
                    <span className="text-sm">
                        {uploading ? "Subiendo..." : "Subir logo PNG"}
                    </span>

                    <input
                        type="file"
                        accept="image/png"
                        hidden
                        onChange={(e) =>
                            e.target.files && uploadLogo(e.target.files[0])
                        }
                    />
                </label>
            </div>
        </div>
    );
};

export default RestaurantSettingsPage;
