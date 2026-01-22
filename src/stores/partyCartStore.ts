// src/stores/partyCartStore.ts
import { create } from "zustand";
import { supabase } from "../services/supabaseClient";

export interface PartyCartItem {
    product_id: string;
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
}

interface PartyCartState {
    items: PartyCartItem[];

    setItems: (items: PartyCartItem[]) => void;
    clearCart: () => void;

    loadCart: (partyId: string | null) => Promise<void>;
    addItem: (partyId: string | null, productId: string) => Promise<void>;
    decreaseItem: (partyId: string | null, productId: string) => Promise<void>;
}

export const usePartyCartStore = create<PartyCartState>((set) => ({
    items: [],

    setItems: (items) => set({ items }),

    clearCart: () => set({ items: [] }),

    /* ===============================
       CARGAR CARRITO (FUENTE DE VERDAD)
       TRAE IMAGEN, NOMBRE Y PRECIO
    =============================== */
    loadCart: async (partyId) => {
        if (!partyId) return;

        const { data, error } = await supabase
            .from("party_cart_items")
            .select(`
                product_id,
                quantity,
                product:products (
                    name,
                    price,
                    image_url
                )
            `)
            .eq("party_id", partyId);

        if (error) {
            console.error("Error loading cart:", error.message);
            return;
        }

        const mapped: PartyCartItem[] =
            data?.map((row: any) => ({
                product_id: row.product_id,
                quantity: row.quantity,
                name: row.product.name,
                price: row.product.price,
                image_url: row.product.image_url,
            })) || [];

        set({ items: mapped });
    },

    /* ===============================
       AGREGAR ITEM (RPC + RECARGA)
    =============================== */
    addItem: async (partyId, productId) => {
        if (!partyId) return;

        const { error } = await supabase.rpc("party_cart_add", {
            p_party_id: partyId,
            p_product_id: productId,
        });

        if (error) {
            console.error("RPC party_cart_add failed:", error.message);
            return;
        }

        // 🔑 CLAVE: refrescar carrito inmediatamente
        await usePartyCartStore.getState().loadCart(partyId);
    },

    /* ===============================
       DISMINUIR ITEM (RPC + RECARGA)
    =============================== */
    decreaseItem: async (partyId, productId) => {
        if (!partyId) return;

        const { error } = await supabase.rpc("party_cart_decrease", {
            p_party_id: partyId,
            p_product_id: productId,
        });

        if (error) {
            console.error("RPC party_cart_decrease failed:", error.message);
            return;
        }

        // 🔑 CLAVE: refrescar carrito inmediatamente
        await usePartyCartStore.getState().loadCart(partyId);
    },
}));
