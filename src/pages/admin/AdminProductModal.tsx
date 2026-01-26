import { useEffect, useRef, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { Upload, Image as ImageIcon } from "lucide-react";

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

    const [name, setName] = useState(product?.name || "");
    const [description, setDescription] = useState(product?.description || "");
    const [price, setPrice] = useState(product?.price?.toString() || "");
    const [isActive, setIsActive] = useState(product?.is_active ?? true);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        product?.image_url || null
    );

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCategories();
        if (product) loadProductCategories();
    }, []);

    /* =======================
       LOAD CATEGORIES
    ======================= */
    const loadCategories = async () => {
        const { data } = await supabase
            .from("categories")
            .select("id, name")
            .eq("is_active", true)
            .order("name");

        setCategories(data || []);
    };

    /* =======================
       LOAD PRODUCT CATEGORIES
    ======================= */
    const loadProductCategories = async () => {
        if (!product) return;

        const { data } = await supabase
            .from("product_categories")
            .select("category_id")
            .eq("product_id", product.id);

        setSelectedCategories(data?.map((d) => d.category_id) || []);
    };

    const toggleCategory = (id: string) => {
        setSelectedCategories((prev) =>
            prev.includes(id)
                ? prev.filter((c) => c !== id)
                : [...prev, id]
        );
    };

    /* =======================
       IMAGE HANDLERS
    ======================= */
    const handleFile = (file: File) => {
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    /* =======================
       SAVE PRODUCT
    ======================= */
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
                console.error(error);
                alert("Error subiendo imagen");
                setLoading(false);
                return;
            }

            const { data } = supabase.storage
                .from("products_images")
                .getPublicUrl(fileName);

            imageUrl = data.publicUrl;
        }

        let productId = product?.id;

        if (isEditing && productId) {
            const { error } = await supabase
                .from("products")
                .update({
                    name,
                    description,
                    price: Number(price),
                    is_active: isActive,
                    image_url: imageUrl,
                })
                .eq("id", productId);

            if (error) {
                console.error(error);
                alert("Error actualizando producto");
                setLoading(false);
                return;
            }

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
                console.error(error);
                alert("Error creando producto");
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

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-primary text-secondary w-full max-w-2xl p-8 rounded-2xl space-y-4">
                <h3 className="text-2xl font-bold">
                    {isEditing ? "Editar producto" : "Nuevo producto"}
                </h3>

                <input
                    className="w-full p-3 rounded bg-secondary text-primary"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <textarea
                    className="w-full p-3 rounded bg-secondary text-primary"
                    placeholder="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                />

                <input
                    type="number"
                    className="w-full p-3 rounded bg-secondary text-primary"
                    placeholder="Precio"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                {/* 🔥 DROPZONE */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={onDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center cursor-pointer hover:border-accent transition"
                >
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            className="mx-auto h-40 object-contain rounded"
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
                        accept="image/*"
                        hidden
                        onChange={onFileChange}
                    />
                </div>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => setIsActive(!isActive)}
                    />
                    Activo
                </label>

                {/* CATEGORÍAS COMO CHIPS */}
                <div>
                    <p className="font-semibold mb-2">Categorías</p>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((c) => {
                            const selected = selectedCategories.includes(c.id);
                            return (
                                <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => toggleCategory(c.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition
                    ${selected
                                            ? "bg-accent text-secondary"
                                            : "bg-secondary text-primary hover:bg-gray-300"
                                        }`}
                                >
                                    {c.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded bg-gray-500 text-white"
                    >
                        Cancelar
                    </button>

                    <button
                        disabled={loading}
                        onClick={saveProduct}
                        className="px-5 py-2 rounded bg-accent text-secondary font-semibold"
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminProductModal;
