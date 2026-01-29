// src/pages/admin/AdminMenuCMSPage.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import CategoriesPanel from "./CategoriesPanel";
import ProductsTable, { Product } from "./ProductsTable";
import AdminProductModal from "./AdminProductModal";
import { Plus } from "lucide-react";

const AdminMenuCMSPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);

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
                    categories (
                        name
                    ),
                    category_id
                )
            `);

        // 🔥 FILTRO REAL POR CATEGORÍA (ADMIN)
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
            console.error("Error loading admin products:", error);
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
            {/* HEADER */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-secondary">
                        Menu CMS
                    </h1>
                    <p className="text-secondary/60 mt-1">
                        Manage your products and categories
                    </p>
                </div>

                <button
                    onClick={() => {
                        setEditingProduct(null);
                        setOpenModal(true);
                    }}
                    className="
                        flex items-center gap-2
                        px-6 py-3
                        rounded-full
                        bg-accent
                        text-white
                        font-bold
                        shadow-md
                        hover:brightness-110
                        transition
                    "
                >
                    <Plus className="w-5 h-5" />
                    Add New Product
                </button>
            </div>

            {/* CONTENT */}
            <div className="grid grid-cols-[300px_1fr] gap-6">
                <CategoriesPanel
                    selectedCategoryId={selectedCategory}
                    onSelect={setSelectedCategory}
                />

                <section className="space-y-4">
                    <input
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                    />

                    {loading ? (
                        <div className="text-secondary/60">
                            Loading products...
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
