import { Outlet } from "react-router-dom";
import WaiterTopNav from "../components/waiter/WaiterTopNav";
import FooterNav from "../shared/components/FooterNav";
import WaiterSafeWrapper from "./WaiterSafeWrapper";

const WaiterLayout = () => {
    return (
        <WaiterSafeWrapper>
            <div className="min-h-full flex flex-col bg-primary text-secondary">

                {/* TOP NAV */}
                <WaiterTopNav />

                {/* CONTENIDO */}
                <main
                    className="
                        flex-1
                        overflow-y-auto
                        px-4
                        py-6
                        bg-primary
                        pb-[90px]
                    "
                >
                    <Outlet />
                </main>
            </div>
        </WaiterSafeWrapper>
    );
};

export default WaiterLayout;
