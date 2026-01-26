import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";

interface Category {
    id: string;
    name: string;
    is_active: boolean;
}

const AdminCategoriesPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const { data } = await supabase
            .from("categories")
            .select("id, name, is_active")
            .order("created_at", { ascending: false });

        setCategories(data || []);
    };

    const createCategory = async () => {
        if (!name.trim()) return;

        setLoading(true);

        const { error } = await supabase
            .from("categories")
            .insert({ name });

        setLoading(false);

        if (!error) {
            setName("");
            loadCategories();
        }
    };

    const toggleCategory = async (id: string, is_active: boolean) => {
        await supabase
            .from("categories")
            .update({ is_active: !is_active })
            .eq("id", id);

        loadCategories();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-extrabold">
                Categorías
            </h2>

            {/* CREAR */}
            <div className="flex gap-3 max-w-md">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre de la categoría"
                    className="flex-1 p-3 rounded-lg bg-secondary text-primary"
                />

                <button
                    onClick={createCategory}
                    disabled={loading || !name.trim()}
                    className="px-6 rounded-lg bg-accent text-secondary font-semibold disabled:opacity-50"
                >
                    {loading ? "..." : "Agregar"}
                </button>
            </div>

            {/* LISTA */}
            <div className="bg-primary border border-secondary/20 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="border-b border-secondary/20">
                        <tr>
                            <th className="text-left p-4">Nombre</th>
                            <th className="text-center p-4">Estado</th>
                            <th className="text-center p-4">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr
                                key={cat.id}
                                className="border-t border-secondary/10"
                            >
                                <td className="p-4">{cat.name}</td>

                                <td className="p-4 text-center">
                                    {cat.is_active ? "Activa" : "Inactiva"}
                                </td>

                                <td className="p-4 text-center">
                                    <button
                                        onClick={() =>
                                            toggleCategory(cat.id, cat.is_active)
                                        }
                                        className="
                      px-4 py-1 rounded-md text-sm font-semibold
                      bg-secondary text-primary
                    "
                                    >
                                        {cat.is_active ? "Desactivar" : "Activar"}
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {categories.length === 0 && (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="p-6 text-center text-secondary/70"
                                >
                                    No hay categorías registradas
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCategoriesPage;
