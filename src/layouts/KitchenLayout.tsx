import { Outlet } from "react-router-dom";
import KitchenTopNav from "../components/kitchen/KitchenTopNav";

export default function KitchenLayout() {
    return (
        <div className="min-h-full flex flex-col bg-primary text-secondary">

            <KitchenTopNav />
            <main className="flex-1 overflow-hidden relative">
                <Outlet />
            </main>
        </div>
    );
}