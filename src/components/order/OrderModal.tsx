import { usePartyCartStore } from "../../stores/partyCartStore";
import { usePartyStore } from "../../stores/partyStore";
import { supabase } from "../../services/supabaseClient";
import { X } from "lucide-react";

interface Props {
    open: boolean;
    onClose: () => void;
}

const OrderModal = ({ open, onClose }: Props) => {
    const { items, clearCart } = usePartyCartStore();
    const { partyId } = usePartyStore();

    if (!open) return null;

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const handleGenerateOrder = async () => {
        if (items.length === 0 || !partyId) return;

        const { error } = await supabase.functions.invoke("generate-order", { body: { party_id: partyId } });

        if (error) { alert(error.message); return; }

        clearCart();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-2xl max-h-[85vh] overflow-y-auto p-4">
                <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">Tu pedido</h2><button onClick={onClose}><X /></button></div>
                <div className="space-y-3">{items.map((item) => <div key={item.product_id} className="flex justify-between text-sm"><span>{item.quantity} × {item.name}</span><span>S/ {item.price * item.quantity}</span></div>)}
                </div>
                <div className="flex justify-between font-bold mt-4"><span>Total</span><span>S/ {total}</span></div>
                <button onClick={handleGenerateOrder} disabled={items.length === 0} className="mt-5 w-full bg-orange-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300">Generar pedido</button>
            </div>
        </div>
    );
};

export default OrderModal;