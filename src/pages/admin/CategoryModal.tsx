import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { supabase } from "../../services/supabaseClient";
import { foodIcons, FoodIconName } from "../../shared/constants/foodIcons";

interface Props {
    onClose: () => void;
    onSaved: () => void;
}

const CategoryModal = ({ onClose, onSaved }: Props) => {
    const [name, setName] = useState("");
    const [icon, setIcon] = useState<FoodIconName>("Utensils");
    const [sortOrder, setSortOrder] = useState<number>(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadNextOrder = async () => {
            const { data } = await supabase
                .from("categories")
                .select("sort_order")
                .order("sort_order", { ascending: false })
                .limit(1);

            setSortOrder((data?.[0]?.sort_order ?? 0) + 1);
        };

        loadNextOrder();
    }, []);

    const save = async () => {
        if (!name.trim()) return;

        setLoading(true);

        await supabase.from("categories").insert({
            name,
            icon,
            sort_order: sortOrder,
            is_active: true,
        });

        setLoading(false);
        onSaved();
        onClose();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-md bg-white rounded-3xl p-6 space-y-5"
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-extrabold">New Category</h2>
                        <button onClick={onClose}>
                            <X />
                        </button>
                    </div>

                    <div>
                        <label className="text-xs font-semibold">
                            NOMBRE (ESPAÑOL)
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold">
                            SORT ORDER
                        </label>
                        <input
                            type="number"
                            value={sortOrder}
                            onChange={(e) =>
                                setSortOrder(Number(e.target.value))
                            }
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold">ICON</label>
                        <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto">
                            {Object.entries(foodIcons).map(([key, Icon]) => (
                                <button
                                    key={key}
                                    onClick={() =>
                                        setIcon(key as FoodIconName)
                                    }
                                    className={`h-12 rounded-xl flex items-center justify-center ${icon === key
                                        ? "bg-accent text-white"
                                        : "bg-gray-100"
                                        }`}
                                >
                                    <Icon />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            onClick={save}
                            className="flex-1 py-3 rounded-xl bg-accent text-white font-bold"
                        >
                            Save
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CategoryModal;
