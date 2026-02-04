import { supabase } from "./supabaseClient";
import { useKitchenStore, OrderItem, KitchenOrderGroup } from "../stores/kitchenStore";

export const subscribeKitchenRealtime = () => {
    const { setOrders } = useKitchenStore.getState();

    return supabase
        .channel("kitchen-realtime")
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "order_items" },
            async () => {
                const { data } = await supabase
                    .from("kitchen_order_items")
                    .select("*");

                if (!data) return;

                const typed = data as OrderItem[];

                const grouped: KitchenOrderGroup[] = Object.values(
                    typed.reduce((acc, item) => {
                        acc[item.order_id] ??= {
                            order_id: item.order_id,
                            table_number: item.table_number,
                            items: [],
                        };
                        acc[item.order_id].items.push(item);
                        return acc;
                    }, {} as Record<string, KitchenOrderGroup>)
                );

                setOrders(grouped);
            }
        )
        .subscribe();
};
