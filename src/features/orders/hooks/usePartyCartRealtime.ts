import { useEffect } from "react";
import { supabase } from "../../../services/supabaseClient";
import { usePartyCartStore } from "../../../stores/partyCartStore";

export const usePartyCartRealtime = (partyId: string | null) => {
    const loadCart = usePartyCartStore((s) => s.loadCart);

    useEffect(() => {
        if (!partyId) return;

        loadCart(partyId);

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
                () => {
                    loadCart(partyId);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [partyId, loadCart]);
};
