import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export interface AdminStats {
    tablesOccupied: number;
    tablesFree: number;
    activeOrders: number;
    activeWaiters: number;
}

const MOZO_ROLE_ID = "d7d3083a-1e7d-4a5a-ae5b-a254ff852049";

export const useAdminDashboardRealtime = () => {
    const [stats, setStats] = useState<AdminStats>({
        tablesOccupied: 0,
        tablesFree: 0,
        activeOrders: 0,
        activeWaiters: 0,
    });

    const loadStats = async () => {
        const { data: activeParties } = await supabase
            .from("table_parties")
            .select("table_id")
            .eq("is_active", true);

        const tablesOccupied = new Set(
            activeParties?.map(p => p.table_id)
        ).size;

        const { count: totalTables } = await supabase
            .from("tables")
            .select("id", { count: "exact", head: true });

        const { data: activeOrdersData } = await supabase
            .from("orders")
            .select("id, table_parties!inner(is_active)")
            .in("status", ["generado", "en_curso"])
            .eq("table_parties.is_active", true);

        const activeOrders = activeOrdersData?.length ?? 0;

        const { data: waiters } = await supabase
            .from("users")
            .select("id")
            .eq("role_id", MOZO_ROLE_ID);

        const activeWaiters = new Set(
            waiters?.map(w => w.id)
        ).size;

        setStats({
            tablesOccupied,
            tablesFree: (totalTables ?? 0) - tablesOccupied,
            activeOrders,
            activeWaiters,
        });
    };

    useEffect(() => {
        loadStats();

        const channel = supabase
            .channel("admin-dashboard-realtime")
            .on(
                "postgres_changes",
                { event: "*", schema: "public" },
                loadStats
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return stats;
};
