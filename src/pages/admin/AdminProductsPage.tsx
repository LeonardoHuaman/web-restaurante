import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import AdminProductModal from "./AdminProductModal";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    is_active: boolean;
    image_url: string;
}

const AdminProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const { data, error } = await supabase
            .from("products")
            .select("id, name, description, price, is_active, image_url")
            .order("id", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        setProducts(data || []);
    };

    const deleteProduct = async (product: Product) => {
        if (!confirm("¿Eliminar este producto?")) return;

        try {
            /* 1️⃣ DELETE IMAGE FROM STORAGE */
            if (product.image_url) {
                const fileName = product.image_url.split("/products_images/")[1];

                if (fileName) {
                    const { error: storageError } = await supabase.storage
                        .from("products_images")
                        .remove([fileName]);

                    if (storageError) {
                        console.error("Storage error:", storageError);
                    }
                }
            }

            /* 2️⃣ DELETE PRODUCT CATEGORIES */
            await supabase
                .from("product_categories")
                .delete()
                .eq("product_id", product.id);

            /* 3️⃣ DELETE PRODUCT */
            const { error } = await supabase
                .from("products")
                .delete()
                .eq("id", product.id);

            if (error) {
                console.error(error);
                alert("Error eliminando producto");
                return;
            }

            loadProducts();
        } catch (err) {
            console.error(err);
            alert("Error inesperado eliminando producto");
        }
    };

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-extrabold">Productos</h2>

                <button
                    onClick={() => {
                        setEditingProduct(null);
                        setOpenModal(true);
                    }}
                    className="flex items-center gap-2 bg-accent text-secondary px-6 py-3 rounded-lg font-semibold"
                >
                    <Plus size={18} />
                    Agregar producto
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-secondary rounded-xl overflow-hidden">
                <table className="w-full text-primary">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3 text-left">Imagen</th>
                            <th className="p-3 text-left">Nombre</th>
                            <th className="p-3 text-left">Precio</th>
                            <th className="p-3 text-left">Estado</th>
                            <th className="p-3 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id} className="border-t">
                                <td className="p-3">
                                    <img
                                        src={p.image_url}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                </td>
                                <td className="p-3">{p.name}</td>
                                <td className="p-3">S/ {p.price.toFixed(2)}</td>
                                <td className="p-3">
                                    {p.is_active ? "Activo" : "Inactivo"}
                                </td>
                                <td className="p-3">
                                    <div className="flex gap-2">
                                        <button
                                            title="Editar"
                                            onClick={() => {
                                                setEditingProduct(p);
                                                setOpenModal(true);
                                            }}
                                            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        <button
                                            title="Eliminar"
                                            onClick={() => deleteProduct(p)}
                                            className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {openModal && (
                <AdminProductModal
                    product={editingProduct}
                    onClose={() => setOpenModal(false)}
                    onSaved={loadProducts}
                />
            )}
        </div>
    );
};

export default AdminProductsPage;
