// src/components/categories/CategoryCarousel.tsx
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { categoryIcons } from "../../constants/categoryIcons";
import { useTranslation } from "react-i18next";
import { Category } from "../../types/Category";

interface Props {
    categories: Category[];
    selectedCategoryId: string | null;
    onSelect: (id: string) => void;
}

const SCROLL_AMOUNT = 260;

const CategoryCarousel = ({
    categories,
    selectedCategoryId,
    onSelect,
}: Props) => {
    const { t } = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null);

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    /* ===============================
       DEFAULT: PRIMERA CATEGORÍA (CHEF)
       👉 visualmente igual, lógicamente correcto
    =============================== */
    useEffect(() => {
        if (!selectedCategoryId && categories.length > 0) {
            onSelect(categories[0].id);
        }
    }, [categories, selectedCategoryId, onSelect]);

    const updateScrollState = () => {
        const el = scrollRef.current;
        if (!el) return;

        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(
            el.scrollLeft + el.clientWidth < el.scrollWidth - 1
        );
    };

    useEffect(() => {
        updateScrollState();
        const el = scrollRef.current;
        if (!el) return;

        el.addEventListener("scroll", updateScrollState);
        window.addEventListener("resize", updateScrollState);

        return () => {
            el.removeEventListener("scroll", updateScrollState);
            window.removeEventListener("resize", updateScrollState);
        };
    }, [categories]);

    const scrollLeft = () => {
        scrollRef.current?.scrollBy({
            left: -SCROLL_AMOUNT,
            behavior: "smooth",
        });
    };

    const scrollRight = () => {
        scrollRef.current?.scrollBy({
            left: SCROLL_AMOUNT,
            behavior: "smooth",
        });
    };

    return (
        <div className="w-full flex items-center gap-2 px-2">
            {/* BOTÓN IZQUIERDO */}
            <div className="w-10 flex justify-center">
                {canScrollLeft && (
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollLeft}
                        className="
                            p-2 rounded-full
                            bg-secondary text-primary
                            shadow-md
                            hover:brightness-110
                        "
                    >
                        <ChevronLeft size={18} />
                    </motion.button>
                )}
            </div>

            {/* CAROUSEL (MISMO LOOK) */}
            <div
                ref={scrollRef}
                className="
                    flex-1 flex gap-3
                    overflow-x-auto no-scrollbar
                    scroll-smooth
                "
            >
                {categories.map((category) => {
                    const isActive = selectedCategoryId === category.id;
                    const Icon = categoryIcons[category.name];

                    return (
                        <motion.button
                            key={category.id}
                            onClick={() => onSelect(category.id)}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.94 }}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                            className={`
                                relative flex items-center gap-2
                                px-5 py-3
                                rounded-2xl
                                whitespace-nowrap
                                text-sm font-semibold
                                transition-all
                                border
                                ${isActive
                                    ? "bg-secondary text-primary border-secondary shadow-xl"
                                    : "bg-primary/20 text-secondary border-secondary/30 hover:bg-primary/30"
                                }
                            `}
                        >
                            {Icon && (
                                <Icon
                                    style={{
                                        width: "1.3em",
                                        height: "1.3em",
                                    }}
                                />
                            )}

                            <span>
                                {t(`categories.${category.name}`)}
                            </span>

                            {isActive && (
                                <motion.span
                                    layoutId="active-category"
                                    className="
                                        absolute inset-0
                                        rounded-2xl
                                        ring-2 ring-accent/70
                                    "
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* BOTÓN DERECHO */}
            <div className="w-10 flex justify-center">
                {canScrollRight && (
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollRight}
                        className="
                            p-2 rounded-full
                            bg-secondary text-primary
                            shadow-md
                            hover:brightness-110
                        "
                    >
                        <ChevronRight size={18} />
                    </motion.button>
                )}
            </div>
        </div>
    );
};

export default CategoryCarousel;
