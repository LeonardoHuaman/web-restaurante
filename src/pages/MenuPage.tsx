// src/pages/MenuPage.tsx
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Product } from "../types/Product";
import { Category } from "../types/Category";
import CategoryCarousel from "../components/menu/CategoryCarousel";
import ProductCard from "../components/menu/ProductCard";
import { useTranslation } from "react-i18next";

const MenuPage = () => {
    const { t } = useTranslation();

    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] =
        useState<string | null>(null);

    /* ===============================
       CARGAR CATEGORÍAS ACTIVAS
    =============================== */
    useEffect(() => {
        supabase
            .from("categories")
            .select("*")
            .eq("is_active", true)
            .then(({ data, error }) => {
                if (error) {
                    console.error("Error cargando categorías:", error);
                    return;
                }
                setCategories(data || []);
            });
    }, []);

    /* ===============================
       CARGAR PRODUCTOS POR CATEGORÍA
    =============================== */
    useEffect(() => {
        if (!selectedCategoryId) return;

        supabase
            .from("product_categories")
            .select(`
                product:products (
                    id,
                    name,
                    description,
                    price,
                    image_url
                )
            `)
            .eq("category_id", selectedCategoryId)
            .then(({ data, error }) => {
                if (error) {
                    console.error("Error cargando productos:", error);
                    return;
                }

                const mapped =
                    data?.map((d: any) => d.product).filter(Boolean) || [];
                setProducts(mapped);
            });
    }, [selectedCategoryId]);

    const activeCategory = categories.find(
        (c) => c.id === selectedCategoryId
    );

    return (
        <div className="bg-primary px-4 pt-4 pb-6">
            {/* CATEGORÍAS */}
            <CategoryCarousel
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelect={setSelectedCategoryId}
            />

            {/* TÍTULO DE CATEGORÍA */}
            {activeCategory && (
                <h2
                    className="
                        text-secondary
                        text-lg sm:text-xl
                        font-bold
                        tracking-wide
                        mt-6 mb-4
                    "
                >
                    {t(`categories.${activeCategory.name}`)}
                </h2>
            )}

            {/* PRODUCTOS */}
            <div
                className="
                    grid gap-4
                    grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-5
                "
            >
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </div>
    );
};

export default MenuPage;
