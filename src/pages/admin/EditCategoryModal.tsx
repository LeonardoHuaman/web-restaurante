import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { supabase } from "../../services/supabaseClient";
import { foodIcons, FoodIconName } from "../../shared/constants/foodIcons";

interface Props {
    category: {
        id: string;
        name: string;
        icon: FoodIconName;
        sort_order: number;
    };
    onClose: () => void;
    onSaved: () => void;
}

const EditCategoryModal = ({ category, onClose, onSaved }: Props) => {
    const [name, setName] = useState(category.name);
    const [icon, setIcon] = useState<FoodIconName>(category.icon);
    const [sortOrder, setSortOrder] = useState<number>(category.sort_order);

    const save = async () => {
        await supabase
            .from("categories")
            .update({
                name,
                icon,
                sort_order: sortOrder,
            })
            .eq("id", category.id);

        onSaved();
        onClose();
    };

    const deleteCategory = async () => {
        if (!confirm("Delete category?")) return;

        await supabase.from("categories").delete().eq("id", category.id);

        onSaved();
        onClose();
    };

    return (
        <AnimatePresence>
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <motion.div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-5">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-extrabold">Edit Category</h2>
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
                            onClick={save}
                            className="flex-1 py-3 rounded-xl bg-accent text-white font-bold"
                        >
                            Save
                        </button>
                    </div>

                    <button
                        onClick={deleteCategory}
                        className="w-full text-center text-sm text-red-500 hover:underline"
                    >
                        Delete Category
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EditCategoryModal;
