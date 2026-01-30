import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import CategoriesPanel from "./CategoriesPanel";
import ProductsTable, { Product } from "./ProductsTable";
import AdminProductModal from "./AdminProductModal";
import { Plus, Filter } from "lucide-react";

const AdminMenuCMSPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showCategories, setShowCategories] = useState(false);

    useEffect(() => {
        loadProducts();
    }, [selectedCategory, search]);

    const loadProducts = async () => {
        setLoading(true);

        let query = supabase
            .from("products")
            .select(`
        id,
        name,
        description,
        price,
        is_active,
        image_url,
        product_categories!inner (
          categories ( name ),
          category_id
        )
      `);

        if (selectedCategory) {
            query = query.eq(
                "product_categories.category_id",
                selectedCategory
            );
        }

        if (search) {
            query = query.ilike("name", `%${search}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error(error);
            setProducts([]);
            setLoading(false);
            return;
        }

        const mapped: Product[] =
            data?.map((p: any) => ({
                id: p.id,
                name: p.name,
                description: p.description,
                price: p.price,
                is_active: p.is_active,
                image_url: p.image_url,
                categories: p.product_categories.map(
                    (pc: any) => pc.categories.name
                ),
            })) ?? [];

        setProducts(mapped);
        setLoading(false);
    };

    const toggleProduct = async (id: string, current: boolean) => {
        const { error } = await supabase
            .from("products")
            .update({ is_active: !current })
            .eq("id", id);

        if (error) return;

        setProducts((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, is_active: !current } : p
            )
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold">
                        Menu CMS
                    </h1>
                    <p className="text-zinc-500 mt-1">
                        Gestiona productos y categorías
                    </p>
                </div>

                <button
                    onClick={() => {
                        setEditingProduct(null);
                        setOpenModal(true);
                    }}
                    className="
            flex items-center justify-center gap-2
            px-5 py-3 rounded-full
            bg-accent text-white font-bold
            shadow-md hover:brightness-110
          "
                >
                    <Plus className="w-5 h-5" />
                    Nuevo producto
                </button>
            </div>

            <div className="sm:hidden">
                <button
                    onClick={() => setShowCategories(true)}
                    className="
            w-full flex items-center justify-center gap-2
            px-4 py-3 rounded-xl
            bg-zinc-100 font-semibold
          "
                >
                    <Filter size={18} />
                    Filtrar por categoría
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] gap-6">
                <aside className="hidden sm:block">
                    <CategoriesPanel
                        selectedCategoryId={selectedCategory}
                        onSelect={setSelectedCategory}
                    />
                </aside>

                <section className="space-y-4">
                    <input
                        placeholder="Buscar productos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="
              w-full px-4 py-3 rounded-2xl
              bg-white border border-zinc-200
              focus:outline-none focus:ring-2 focus:ring-accent
            "
                    />

                    {loading ? (
                        <div className="text-zinc-500">
                            Cargando productos...
                        </div>
                    ) : (
                        <ProductsTable
                            products={products}
                            onToggleActive={toggleProduct}
                            onSelect={(product) => {
                                setEditingProduct(product);
                                setOpenModal(true);
                            }}
                        />
                    )}
                </section>
            </div>

            {showCategories && (
                <div className="fixed inset-0 z-40 bg-black/40 sm:hidden">
                    <div className="
            absolute bottom-0 left-0 right-0
            bg-white rounded-t-3xl p-6
            max-h-[80vh] overflow-auto
          ">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">
                                Categorías
                            </h3>
                            <button
                                onClick={() => setShowCategories(false)}
                                className="text-sm font-semibold text-accent"
                            >
                                Cerrar
                            </button>
                        </div>

                        <CategoriesPanel
                            selectedCategoryId={selectedCategory}
                            onSelect={(id) => {
                                setSelectedCategory(id);
                                setShowCategories(false);
                            }}
                        />
                    </div>
                </div>
            )}

            {openModal && (
                <AdminProductModal
                    product={editingProduct}
                    onClose={() => {
                        setOpenModal(false);
                        setEditingProduct(null);
                    }}
                    onSaved={loadProducts}
                />
            )}
        </div>
    );
};

export default AdminMenuCMSPage;
