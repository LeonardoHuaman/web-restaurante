import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export interface PeopleByHour {
    hour_24: string;
    total: number;
}

export const usePeopleTodayByHour = () => {
    const [data, setData] = useState<PeopleByHour[]>([]);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const { data: settings } = await supabase
            .from("restaurant_settings")
            .select("opening_hour, closing_hour")
            .single();

        if (!settings) return;

        const { opening_hour, closing_hour } = settings;

        const { data: raw } = await supabase.rpc("people_by_hour_today");

        const map = new Map<string, number>(
            (raw ?? []).map((r: any) => [r.hour_24, Number(r.total)])
        );

        const filled: PeopleByHour[] = [];

        for (let h = opening_hour; h <= closing_hour; h++) {
            const hour = String(h).padStart(2, "0");
            filled.push({
                hour_24: hour,
                total: map.get(hour) ?? 0,
            });
        }

        setData(filled);
    };

    return data;
};
