import { Outlet } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import FooterNav from "../components/layout/FooterNav";

import { usePartyStore } from "../stores/partyStore";
import { usePartyCartRealtime } from "../hooks/usePartyCartRealtime";

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
