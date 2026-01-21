import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Product } from "../types/Product";
import { Category } from "../types/Category";
import CategoryCarousel from "../components/menu/CategoryCarousel";
import ProductCard from "../components/menu/ProductCard";

const MenuPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    useEffect(() => {
        supabase
            .from("categories")
            .select("*")
            .eq("is_active", true)
            .then(({ data }) => setCategories(data || []));
    }, []);

    useEffect(() => {
        if (!selectedCategoryId) return;

        supabase
            .from("product_categories")
            .select("product:products (id, name, description, price, image_url)")
            .eq("category_id", selectedCategoryId)
            .then(({ data }) => {
                const mapped = data?.map(d => d.product).flat() || [];
                setProducts(mapped);
            });
    }, [selectedCategoryId]);

    return (
        <div className="p-4">
            <CategoryCarousel
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelect={setSelectedCategoryId}
            />

            <div className="grid gap-4 mt-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {products.map(p => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>

        </div>
    );
};

export default MenuPage;
