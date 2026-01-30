import { Plus, Minus } from "lucide-react";
import { Product } from "../../types/Product";
import { usePartyCartStore } from "../../stores/partyCartStore";
import { usePartyStore } from "../../stores/partyStore";

interface Props {
    product: Product;
}

const ProductCard = ({ product }: Props) => {
    const { partyId } = usePartyStore();
    const { items, addItem, decreaseItem } = usePartyCartStore();

    const quantity =
        items.find((i) => i.product_id === product.id)?.quantity ?? 0;

    return (
        <div className="bg-secondary text-primary rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col min-w-0">
            <div className="w-full aspect-[4/3] overflow-hidden">
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="p-4 flex flex-col gap-2 flex-1 bg-secondary">
                <h3 className="font-semibold leading-tight line-clamp-2">
                    {product.name}
                </h3>

                {product.description && (
                    <p className="text-sm text-primary/70 line-clamp-2">
                        {product.description}
                    </p>
                )}

                <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="font-bold text-accent">
                        S/ {product.price}
                    </span>

                    <div className="flex items-center gap-2">
                        {quantity > 0 && (
                            <button
                                onClick={() =>
                                    partyId &&
                                    decreaseItem(partyId, product.id)
                                }
                                className="w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                        )}

                        {quantity > 0 && (
                            <span className="w-5 text-center font-medium">
                                {quantity}
                            </span>
                        )}

                        <button
                            disabled={!partyId}
                            onClick={() =>
                                partyId &&
                                addItem(partyId, product.id)
                            }
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${partyId
                                ? "bg-accent text-secondary"
                                : "bg-accent/30 text-secondary/60 cursor-not-allowed"
                                }`}
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
