// src/hooks/useSalesTodayByHour.ts
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export interface SalesByHour {
    hour_24: string; // "00".."23"
    total: number;
}

export const useSalesTodayByHour = () => {
    const [data, setData] = useState<SalesByHour[]>([]);

    useEffect(() => {
        const load = async () => {
            const { data, error } = await supabase.rpc("sales_today_by_hour_peru");
            if (!error && data) {
                // normaliza tipos
                setData(data.map((d: any) => ({
                    hour_24: d.hour_24,
                    total: Number(d.total),
                })));
            }
        };
        load();
    }, []);

    return data;
};
