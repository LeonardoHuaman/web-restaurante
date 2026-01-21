import { useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { usePartyCartStore } from "../stores/partyCartStore";

export const usePartyCartRealtime = (partyId: string | null) => {
    const { setItems } = usePartyCartStore();

    useEffect(() => {
        if (!partyId) return;

        const fetch = async () => {
            const { data, error } = await supabase
                .from("party_cart_items")
                .select(`
                    product_id,
                    quantity,
                    products (
                        name,
                        price
                    )
                `)
                .eq("party_id", partyId);

            if (error) {
                console.error("❌ Error fetching party cart:", error);
                return;
            }

            const mapped = (data || []).map((item: any) => ({
                product_id: item.product_id,
                quantity: item.quantity,
                name: item.products.name,
                price: item.products.price,
            }));

            setItems(mapped);
        };

        fetch();

        const channel = supabase
            .channel(`party-cart-${partyId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "party_cart_items",
                    filter: `party_id=eq.${partyId}`,
                },
                fetch
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [partyId, setItems]);
};
