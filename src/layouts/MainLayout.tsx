import { Outlet } from "react-router-dom";
import TopBar from "../shared/components/TopBar";
import FooterNav from "../shared/components/FooterNav";

import { usePartyStore } from "../stores/partyStore";
import { usePartyCartRealtime } from "../features/orders/hooks/usePartyCartRealtime";

const MainLayout = () => {
    const { partyId } = usePartyStore();
    usePartyCartRealtime(partyId);

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-primary">
            <TopBar onToggleSidebar={() => { }} />

            <main className="flex-1 overflow-y-auto bg-primary app-safe">
                <Outlet />
            </main>

            <FooterNav />
        </div>
    );
};

export default MainLayout;
