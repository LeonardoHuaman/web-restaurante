import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { supabase } from "../../services/supabaseClient";
import CategoryModal from "./CategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import { formatCategoryName } from "../../utils/formatCategoryName";
import { FoodIconName } from "../../constants/foodIcons";

interface CategoryRow {
    id: string;
    name: string;
    icon: FoodIconName;
    sort_order: number;
    products_count: number;
}

interface Props {
    selectedCategoryId: string | null;
    onSelect: (id: string | null) => void;
}

const CategoriesPanel = ({ selectedCategoryId, onSelect }: Props) => {
    const [categories, setCategories] = useState<CategoryRow[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const { data, error } = await supabase
            .from("categories")
            .select(`
                id,
                name,
                icon,
                sort_order,
                product_categories(id)
            `)
            .eq("is_active", true)
            .order("sort_order", { ascending: true });

        if (error) {
            console.error(error);
            return;
        }

        const mapped: CategoryRow[] =
            data?.map((c: any) => ({
                id: c.id,
                name: c.name,
                icon: c.icon,
                sort_order: c.sort_order,
                products_count: c.product_categories?.length ?? 0,
            })) ?? [];

        setCategories(mapped);
    };

    return (
        <aside className="bg-secondary/5 rounded-3xl p-4 space-y-4">
            <div className="flex justify-between items-center px-2">
                <h3 className="font-bold text-lg">Categories</h3>
                <button
                    onClick={() => setOpenModal(true)}
                    className="text-accent text-sm font-semibold"
                >
                    + New
                </button>
            </div>

            <div className="space-y-2">
                {categories.map((cat) => {
                    const active = selectedCategoryId === cat.id;

                    return (
                        <motion.button
                            key={cat.id}
                            onClick={() => onSelect(cat.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            layout
                            className={`
                                w-full flex items-center justify-between
                                px-4 py-3 rounded-2xl text-left
                                transition
                                ${active
                                    ? "bg-accent/10 border border-accent"
                                    : "bg-white hover:bg-secondary/10"
                                }
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <div>
                                    <p className="font-semibold">
                                        {formatCategoryName(cat.name)}
                                    </p>
                                    <p className="text-xs text-secondary/60">
                                        {cat.products_count} items
                                    </p>
                                </div>
                            </div>

                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingCategory(cat);
                                }}
                                className="text-secondary/60 hover:text-secondary cursor-pointer"
                            >
                                <Pencil size={16} />
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            {openModal && (
                <CategoryModal
                    onClose={() => setOpenModal(false)}
                    onSaved={loadCategories}
                />
            )}

            {editingCategory && (
                <EditCategoryModal
                    category={editingCategory}
                    onClose={() => setEditingCategory(null)}
                    onSaved={loadCategories}
                />
            )}
        </aside>
    );
};

export default CategoriesPanel;
