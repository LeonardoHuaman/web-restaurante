import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Category } from "../../types/Category";
import { categoryIcons } from "../../constants/categoryIcons";

interface Props {
    categories: Category[];
    selectedCategoryId: string | null;
    onSelect: (id: string) => void;
}

const CategoryCarousel = ({
    categories,
    selectedCategoryId,
    onSelect,
}: Props) => {
    const { t } = useTranslation();

    const scroll = (dir: "left" | "right") => {
        const el = document.getElementById("category-scroll");
        el?.scrollBy({
            left: dir === "left" ? -200 : 200,
            behavior: "smooth",
        });
    };

    return (
        <div className="relative w-full my-4">
            <button
                type="button"
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-1 z-10"
                aria-label="Scroll left"
            >
                <ChevronLeft />
            </button>

            <div
                id="category-scroll"
                className="flex gap-3 overflow-x-auto px-8 scrollbar-hide"
            >
                {categories.map((cat) => {
                    const Icon = categoryIcons[cat.name];

                    return (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => onSelect(cat.id)}
                            className={`min-w-[150px] h-[90px] rounded-xl border flex flex-col justify-center items-center gap-2 transition-colors
                ${selectedCategoryId === cat.id
                                    ? "border-orange-600 bg-orange-50"
                                    : "border-gray-200 hover:border-orange-300"
                                }`}
                        >
                            {Icon && <Icon size={26} />}

                            <span className="text-sm font-semibold text-center">
                                {t(`categories.${cat.name}`)}
                            </span>
                        </button>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-1 z-10"
                aria-label="Scroll right"
            >
                <ChevronRight />
            </button>
        </div>
    );
};

export default CategoryCarousel;
