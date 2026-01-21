import { create } from "zustand";
import { supabase } from "../services/supabaseClient";

export interface PartyCartItem {
    product_id: string;
    name: string;
    price: number;
    quantity: number;
}


interface PartyCartState {
    items: PartyCartItem[];

    setItems: (items: PartyCartItem[]) => void;
    clearCart: () => void;

    addItem: (partyId: string | null, productId: string) => Promise<void>;
    decreaseItem: (partyId: string | null, productId: string) => Promise<void>;
}

export const usePartyCartStore = create<PartyCartState>((set) => ({
    items: [],

    setItems: (items) => set({ items }),

    clearCart: () => set({ items: [] }),

    addItem: async (partyId, productId) => {
        if (!partyId) {
            console.warn("addItem called without partyId");
            return;
        }

        const { error } = await supabase.rpc("party_cart_add", {
            p_party_id: partyId,
            p_product_id: productId,
        });

        if (error) {
            console.error("RPC party_cart_add failed:", error.message);
        }
    },

    decreaseItem: async (partyId, productId) => {
        if (!partyId) {
            console.warn("decreaseItem called without partyId");
            return;
        }

        const { error } = await supabase.rpc("party_cart_decrease", {
            p_party_id: partyId,
            p_product_id: productId,
        });

        if (error) {
            console.error("RPC party_cart_decrease failed:", error.message);
        }
    },
}));
