import { useEffect } from "react";
import { usePartyStore } from "../stores/partyStore";
import { usePartyCartStore } from "../stores/partyCartStore";

export const useLoadPartyCart = () => {
    const { partyId } = usePartyStore();
    const loadCart = usePartyCartStore((s) => s.loadCart);

    useEffect(() => {
        if (partyId) {
            loadCart(partyId);
        }
    }, [partyId, loadCart]);
};
