// src/pages/admin/AdminProductModal.tsx
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { Upload, X, Trash2 } from "lucide-react";

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    is_active: boolean;
    image_url: string;
}

interface Props {
    product: Product | null;
    onClose: () => void;
    onSaved: () => void;
}

const AdminProductModal = ({ product, onClose, onSaved }: Props) => {
    const isEditing = Boolean(product);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState(product?.name ?? "");
    const [description, setDescription] = useState(product?.description ?? "");
    const [price, setPrice] = useState(product?.price?.toString() ?? "");
    const [isActive, setIsActive] = useState(product?.is_active ?? true);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        product?.image_url ?? null
    );

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCategories();
        if (product) loadProductCategories();
    }, []);

    const loadCategories = async () => {
        const { data } = await supabase
            .from("categories")
            .select("id, name")
            .eq("is_active", true)
            .order("sort_order");

        setCategories(data ?? []);
    };

    const loadProductCategories = async () => {
        if (!product) return;

        const { data } = await supabase
            .from("product_categories")
            .select("category_id")
            .eq("product_id", product.id);

        setSelectedCategories(data?.map((d) => d.category_id) ?? []);
    };

    const toggleCategory = (id: string) => {
        setSelectedCategories((prev) =>
            prev.includes(id)
                ? prev.filter((c) => c !== id)
                : [...prev, id]
        );
    };

    const handleFile = (file: File) => {
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const saveProduct = async () => {
        if (!name || !price) return;

        setLoading(true);
        let imageUrl = product?.image_url ?? "";

        if (imageFile) {
            const fileName = `${Date.now()}-${imageFile.name}`;
            const { error } = await supabase.storage
                .from("products_images")
                .upload(fileName, imageFile);

            if (error) {
                alert("Error subiendo imagen");
                setLoading(false);
                return;
            }

            imageUrl = supabase.storage
                .from("products_images")
                .getPublicUrl(fileName).data.publicUrl;
        }

        let productId = product?.id;

        if (isEditing && productId) {
            await supabase
                .from("products")
                .update({
                    name,
                    description,
                    price: Number(price),
                    is_active: isActive,
                    image_url: imageUrl,
                })
                .eq("id", productId);

            await supabase
                .from("product_categories")
                .delete()
                .eq("product_id", productId);
        } else {
            const { data, error } = await supabase
                .from("products")
                .insert({
                    name,
                    description,
                    price: Number(price),
                    is_active: isActive,
                    image_url: imageUrl,
                })
                .select("id")
                .single();

            if (error || !data) {
                console.error("Error creating product:", error);
                alert("Error al crear el producto");
                setLoading(false);
                return;
            }

            productId = data.id;
        }

        if (productId && selectedCategories.length > 0) {
            await supabase.from("product_categories").insert(
                selectedCategories.map((catId) => ({
                    product_id: productId!,
                    category_id: catId,
                }))
            );
        }

        setLoading(false);
        onSaved();
        onClose();
    };

    const deleteProduct = async () => {
        if (!product) return;
        if (!confirm("Eliminar producto?")) return;

        await supabase.from("products").delete().eq("id", product.id);
        onSaved();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
            <div
                className="
                    bg-white w-full
                    max-w-5xl
                    max-h-[95vh]
                    rounded-3xl
                    p-4 sm:p-8
                    space-y-6
                    overflow-y-auto
                "
            >
                {/* HEADER */}
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold">
                            {isEditing ? "Editar Producto" : "Nuevo Producto"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Configura detalles, precios y categorías
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {isEditing && (
                            <button
                                onClick={deleteProduct}
                                className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100"
                            >
                                <Trash2 size={16} />
                                <span className="hidden sm:inline">
                                    Eliminar
                                </span>
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <X />
                        </button>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* LEFT */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500">
                                NOMBRE DEL PRODUCTO
                            </label>
                            <input
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-500">
                                PRECIO (S/)
                            </label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) =>
                                    setPrice(e.target.value)
                                }
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-500">
                                DESCRIPCIÓN
                            </label>
                            <textarea
                                rows={3}
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                            />
                        </div>

                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={() =>
                                    setIsActive(!isActive)
                                }
                            />
                            Producto activo
                        </label>

                        <div>
                            <p className="text-xs font-semibold text-gray-500 mb-2">
                                CATEGORÍAS
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((c) => {
                                    const active =
                                        selectedCategories.includes(c.id);
                                    return (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() =>
                                                toggleCategory(c.id)
                                            }
                                            className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${active
                                                ? "bg-accent text-white border-accent"
                                                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                                                }`}
                                        >
                                            {c.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            if (e.dataTransfer.files?.[0]) {
                                handleFile(e.dataTransfer.files[0]);
                            }
                        }}
                        className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:border-accent transition"
                    >
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                className="rounded-xl object-cover w-full max-h-64"
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                <Upload size={32} />
                                <p className="font-semibold">
                                    Arrastra una imagen o haz clic
                                </p>
                                <p className="text-sm">
                                    JPG, PNG, WEBP
                                </p>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) =>
                                e.target.files?.[0] &&
                                handleFile(e.target.files[0])
                            }
                        />
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl bg-gray-100 font-semibold"
                    >
                        Cancelar
                    </button>
                    <button
                        disabled={loading}
                        onClick={saveProduct}
                        className="px-6 py-3 rounded-xl bg-accent text-white font-extrabold"
                    >
                        {loading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminProductModal;
