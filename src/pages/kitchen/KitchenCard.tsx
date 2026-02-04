import { OrderItem } from "../../stores/kitchenStore";
import { supabase } from "../../services/supabaseClient";

type Props = {
    item: OrderItem;
};

export default function KitchenCard({ item }: Props) {
    const nextStatus =
        item.status === "por_preparar"
            ? "en_cocina"
            : item.status === "en_cocina"
                ? "listo"
                : null;

    const handleAction = async () => {
        if (!nextStatus) return;
        await supabase
            .from("order_items")
            .update({ status: nextStatus })
            .eq("id", item.id);
    };

    return (
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-2xl font-bold">M-{item.table_number}</h3>
                    <p className="text-xs text-gray-400 uppercase">Mesa</p>
                </div>
            </div>

            <div className="flex items-center justify-between border-t pt-3">
                <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm font-semibold">
                        {item.quantity}
                    </span>
                    <span className="font-medium">{item.product_name}</span>
                </div>

                {nextStatus && (
                    <button
                        onClick={handleAction}
                        className="h-10 w-10 flex items-center justify-center rounded-lg border hover:bg-gray-100"
                    >
                        {item.status === "por_preparar" ? "🍳" : "🍽️"}
                    </button>
                )}
            </div>
        </div>
    );
}
