import { create } from "zustand";

interface CartProduct {
    id: string;
    name: string;
    price: number;
    image_url: string;
    quantity: number;
}

interface CartStore {
    items: CartProduct[];
    addItem: (product: Omit<CartProduct, "quantity">) => void;
    removeItem: (id: string) => void;
    getItemQuantity: (id: string) => number;
    getTotalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],

    addItem: (product) => {
        const items = get().items;
        const existing = items.find(i => i.id === product.id);

        if (existing) {
            set({
                items: items.map(i =>
                    i.id === product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                )
            });
        } else {
            set({
                items: [...items, { ...product, quantity: 1 }]
            });
        }
    },

    removeItem: (id) => {
        const items = get().items;
        const existing = items.find(i => i.id === id);
        if (!existing) return;

        if (existing.quantity === 1) {
            set({ items: items.filter(i => i.id !== id) });
        } else {
            set({
                items: items.map(i =>
                    i.id === id
                        ? { ...i, quantity: i.quantity - 1 }
                        : i
                )
            });
        }
    },

    getItemQuantity: (id) =>
        get().items.find(i => i.id === id)?.quantity ?? 0,

    getTotalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0)
}));
