import { useState } from "react";
import { usePartyCartStore } from "../../stores/partyCartStore";
import { usePartyStore } from "../../stores/partyStore";
import { supabase } from "../../services/supabaseClient";
import { X, Loader2 } from "lucide-react";

interface Props {
    open: boolean;
    onClose: () => void;
}

const OrderModal = ({ open, onClose }: Props) => {
    const { items, clearCart } = usePartyCartStore();
    const { partyId } = usePartyStore();
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const total = items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
    );

    const handleGenerateOrder = async () => {
        if (loading || items.length === 0 || !partyId) return;

        const sessionToken = localStorage.getItem("session_token");
        if (!sessionToken) {
            alert("Sesión de mesa no encontrada. Escanee el QR nuevamente.");
            return;
        }

        setLoading(true);

        const { error } = await supabase.functions.invoke(
            "generate-order",
            {
                body: {
                    party_id: partyId,
                    session_token: sessionToken,
                },
            }
        );

        if (error) {
            setLoading(false);
            alert(error.message);
            return;
        }

        clearCart();
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40">
            <div
                className="
                    w-full
                    max-h-[85vh]
                    overflow-y-auto
                    rounded-t-2xl
                    bg-secondary
                    text-primary
                    p-4
                "
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">
                        Tu pedido
                    </h2>
                    <button
                        onClick={!loading ? onClose : undefined}
                        disabled={loading}
                        className="
                            p-2 rounded-full
                            hover:bg-primary/10
                            transition
                            disabled:opacity-50
                        "
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-3">
                    {items.map((item) => (
                        <div
                            key={item.product_id}
                            className="flex items-center gap-3 text-sm"
                        >
                            {item.image_url && (
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="
                                        w-12 h-12
                                        rounded-lg
                                        object-cover
                                        flex-shrink-0
                                    "
                                />
                            )}

                            <div className="flex-1">
                                <div className="font-medium">
                                    {item.name}
                                </div>
                                <div className="text-primary/60 text-xs">
                                    {item.quantity} × S/ {item.price}
                                </div>
                            </div>

                            <div className="font-semibold">
                                S/ {item.price * item.quantity}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between font-bold mt-4">
                    <span>Total</span>
                    <span className="text-accent">
                        S/ {total}
                    </span>
                </div>

                <button
                    onClick={handleGenerateOrder}
                    disabled={items.length === 0 || loading}
                    className={`
                        mt-5 w-full py-3 rounded-lg
                        font-semibold transition
                        flex items-center justify-center gap-2
                        ${!loading && items.length > 0
                            ? "bg-accent text-secondary hover:brightness-110"
                            : "bg-accent/30 text-secondary/60 cursor-not-allowed"
                        }
                    `}
                >
                    {loading && (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    )}
                    {loading ? "Enviando pedido..." : "Generar pedido"}
                </button>
            </div>
        </div>
    );
};

export default OrderModal;
