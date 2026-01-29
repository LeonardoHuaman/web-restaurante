// src/hooks/useMenuProducts.ts
import { supabase } from "../services/supabaseClient";

export const loadMenuProducts = async () => {
    const { data, error } = await supabase
        .from("products")
        .select(`
            id,
            name,
            description,
            price,
            image_url,
            is_active,
            product_categories(
                categories(
                    id,
                    name
                )
            )
        `)
        .eq("is_active", true);

    if (error) {
        console.error("Error loading menu products:", error);
        return [];
    }

    return (
        data?.map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            image_url: p.image_url,
            is_active: p.is_active,
            categories:
                p.product_categories?.map(
                    (pc: any) => pc.categories.name
                ) ?? [],
        })) ?? []
    );
};
