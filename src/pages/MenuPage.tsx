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

    useEffect(() => {
        supabase
            .from("categories")
            .select("*")
            .eq("is_active", true)
            .order("sort_order")
            .then(({ data }) => setCategories(data ?? []));
    }, []);

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
                    image_url,
                    is_active
                )
            `)
            .eq("category_id", selectedCategoryId)
            .eq("product.is_active", true)
            .then(({ data }) => {
                setProducts(
                    data?.map((r: any) => r.product).filter(Boolean) ?? []
                );
            });
    }, [selectedCategoryId]);

    const activeCategory = categories.find(
        (c) => c.id === selectedCategoryId
    );

    return (
        <div className="bg-primary px-3 sm:px-4 pt-4 pb-24 min-h-screen">
            <CategoryCarousel
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelect={setSelectedCategoryId}
            />

            {activeCategory && (
                <h2 className="text-secondary text-lg font-bold mt-5 mb-3">
                    {t(`categories.${activeCategory.name}`)}
                </h2>
            )}

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>

            {products.length === 0 && selectedCategoryId && (
                <div className="text-center text-secondary/60 mt-10">
                    No hay productos disponibles
                </div>
            )}
        </div>
    );
};

export default MenuPage;
