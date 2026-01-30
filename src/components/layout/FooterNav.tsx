import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { usePartyCartStore } from "../../stores/partyCartStore";
import OrderModal from "../order/OrderModal";

const FooterNav = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { items } = usePartyCartStore();
    const totalItems = items.reduce((s, i) => s + i.quantity, 0);

    const [orderOpen, setOrderOpen] = useState(false);

    return (
        <>
            <footer className="fixed sm:sticky bottom-0 w-full py-3 z-30 flex justify-around bg-primary border-t border-secondary/20">
                <button
                    onClick={() => navigate("/")}
                    className="flex flex-col items-center gap-1 font-semibold text-secondary"
                >
                    <Icon icon="mdi:silverware-fork-knife" width={22} />
                    <span>{t("menu")}</span>
                </button>

                <button
                    onClick={() => setOrderOpen(true)}
                    className="relative flex flex-col items-center gap-1 font-semibold text-secondary"
                >
                    <Icon icon="mdi:cart" width={22} />
                    <span>{t("order")}</span>

                    {totalItems > 0 && (
                        <span className="absolute -top-1 right-1 h-4 w-4 rounded-full bg-accent text-secondary text-xs flex items-center justify-center">
                            {totalItems}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => navigate("/order-status")}
                    className="flex flex-col items-center gap-1 font-semibold text-secondary"
                >
                    <Icon icon="mdi:clock-outline" width={22} />
                    <span>{t("order-status")}</span>
                </button>
            </footer>

            <OrderModal
                open={orderOpen}
                onClose={() => setOrderOpen(false)}
            />
        </>
    );
};

export default FooterNav;
