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
        <div className="bg-white rounded-xl border shadow-sm hover:shadow transition w-full sm:w-72 md:w-80 lg:w-96 mx-auto">
            <div className="w-full aspect-[4/3] overflow-hidden rounded-t-xl">
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="p-4 sm:p-5 flex flex-col gap-2">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold leading-tight line-clamp-2">
                    {product.name}
                </h3>

                {product.description && (
                    <p className="text-xs sm:text-sm md:text-base text-gray-500 line-clamp-2">
                        {product.description}
                    </p>
                )}

                <div className="flex justify-between items-center mt-2 sm:mt-3">
                    <span className="text-sm sm:text-base md:text-lg font-bold text-orange-600">
                        S/ {product.price}
                    </span>

                    <div className="flex items-center gap-2">
                        {quantity > 0 && (
                            <button
                                onClick={() =>
                                    partyId &&
                                    decreaseItem(partyId, product.id)
                                }
                                className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center"
                            >
                                <Minus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                            </button>
                        )}

                        {quantity > 0 && (
                            <span className="text-sm sm:text-base md:text-lg w-6 text-center font-medium">
                                {quantity}
                            </span>
                        )}

                        <button
                            disabled={!partyId}
                            onClick={() =>
                                partyId &&
                                addItem(partyId, product.id)
                            }
                            className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full 
                              ${partyId ? "bg-orange-600" : "bg-gray-300"} 
                              text-white flex items-center justify-center`}
                        >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
