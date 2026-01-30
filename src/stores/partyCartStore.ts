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

    loadCart: (partyId: string | null) => Promise<void>;
    optimisticAdd: (product: PartyCartItem) => void;
    optimisticDecrease: (productId: string) => void;

    addItem: (partyId: string | null, product: PartyCartItem) => Promise<void>;
    decreaseItem: (partyId: string | null, productId: string) => Promise<void>;
}

export const usePartyCartStore = create<PartyCartState>((set, get) => ({
    items: [],

    /* =======================
       LOAD (solo realtime / init)
    ======================= */
    loadCart: async (partyId) => {
        if (!partyId) {
            set({ items: [] });
            return;
        }

        const { data } = await supabase
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

        if (!data || data.length === 0) {
            set({ items: [] });
            return;
        }

        set({
            items: data.map((r: any) => ({
                product_id: r.product_id,
                quantity: r.quantity,
                name: r.product.name,
                price: r.product.price,
                image_url: r.product.image_url,
            })),
        });
    },

    /* =======================
       OPTIMISTIC UI
    ======================= */
    optimisticAdd: (product) =>
        set((state) => {
            const existing = state.items.find(
                (i) => i.product_id === product.product_id
            );

            if (existing) {
                return {
                    items: state.items.map((i) =>
                        i.product_id === product.product_id
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                    ),
                };
            }

            return {
                items: [...state.items, { ...product, quantity: 1 }],
            };
        }),

    optimisticDecrease: (productId) =>
        set((state) => ({
            items: state.items
                .map((i) =>
                    i.product_id === productId
                        ? { ...i, quantity: i.quantity - 1 }
                        : i
                )
                .filter((i) => i.quantity > 0),
        })),

    /* =======================
       BACKEND (NO loadCart)
    ======================= */
    addItem: async (partyId, product) => {
        if (!partyId) return;

        get().optimisticAdd(product);

        const { error } = await supabase.rpc("party_cart_add", {
            p_party_id: partyId,
            p_product_id: product.product_id,
        });

        if (error) {
            console.error(error);
            // fallback: recargar desde DB
            await get().loadCart(partyId);
        }
    },

    decreaseItem: async (partyId, productId) => {
        if (!partyId) return;

        get().optimisticDecrease(productId);

        const { error } = await supabase.rpc("party_cart_decrease", {
            p_party_id: partyId,
            p_product_id: productId,
        });

        if (error) {
            console.error(error);
            await get().loadCart(partyId);
        }
    },
}));
