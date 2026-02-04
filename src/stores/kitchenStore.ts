import { create } from "zustand";

export type OrderItemStatus = "por_preparar" | "en_cocina" | "listo";

export type OrderItem = {
    id: string;
    order_id: string;
    table_number: number;
    product_name: string;
    quantity: number;
    price: number;
    status: OrderItemStatus;
    created_at: string;
};


export type KitchenOrderGroup = {
    order_id: string;
    table_number: number;
    items: OrderItem[];
};

export type KitchenReadyGroup = {
    table_number: number;
    items: OrderItem[];
    total: number;
};

type KitchenState = {
    orders: KitchenOrderGroup[];
    setOrders: (orders: KitchenOrderGroup[]) => void;
};

export const useKitchenStore = create<KitchenState>((set) => ({
    orders: [],
    setOrders: (orders) => set({ orders }),
}));
