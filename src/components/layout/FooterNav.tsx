import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useThemeStore } from "../../stores/themeStore";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import { usePartyCartStore } from "../../stores/partyCartStore";
import OrderModal from "../order/OrderModal";

const FooterNav = () => {
    const selectedNavOptionActive = (pathname: string) => {
        if (pathname === "/") {
            return { menu: true, cart: false, status: false };
        }

        if (pathname.startsWith("/order-status")) {
            return { menu: false, cart: false, status: true };
        }

        return { menu: false, cart: false, status: false };
    };

    interface FooterNavBtnProps {
        icon: string;
        label: string;
        isActive: boolean;
        onClick: () => void;
        badge?: number;
    }

    const FooterNavBtn = ({
        icon,
        label,
        isActive,
        onClick,
        badge,
    }: FooterNavBtnProps) => {
        const { getTextColor } = useThemeStore();

        return (
            <button
                onClick={onClick}
                className={`relative flex flex-col items-center gap-1 text-sm font-semibold
          ${isActive ? "text-orange-600" : getTextColor()}
          hover:text-orange-600 transition-colors`}
            >
                <Icon icon={icon} width={22} />
                <span>{label}</span>

                {badge !== undefined && badge > 0 && (
                    <span className="absolute -top-1 right-1 h-4 w-4 bg-orange-600 rounded-full text-xs text-white flex items-center justify-center">
                        {badge}
                    </span>
                )}
            </button>
        );
    };

    const { pathname } = useLocation();
    const navigate = useNavigate();
    const active = selectedNavOptionActive(pathname);

    const { getNavBackgroundColor } = useThemeStore();
    const { t } = useTranslation();

    const { items } = usePartyCartStore();
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

    const [orderOpen, setOrderOpen] = useState(false);

    return (
        <>
            <footer
                className={`sticky bottom-0 w-full py-3
        ${getNavBackgroundColor()} z-10 flex justify-around`}
            >
                <FooterNavBtn
                    icon="mdi:silverware-fork-knife"
                    label={t("menu")}
                    isActive={active.menu}
                    onClick={() => navigate("/")}
                />

                <FooterNavBtn
                    icon="mdi:cart"
                    label={t("order")}
                    isActive={orderOpen}
                    badge={totalItems}
                    onClick={() => setOrderOpen(true)}
                />

                <FooterNavBtn
                    icon="mdi:clock-outline"
                    label={t("order-status")}
                    isActive={active.status}
                    onClick={() => navigate("/order-status")}
                />
            </footer>

            <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} />
        </>
    );
};

export default FooterNav;
