import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";

export interface RestaurantSettings {
    id: string;
    name: string;
    logo_url: string | null;
}

export const useRestaurantSettings = () => {
    const [settings, setSettings] = useState<RestaurantSettings | null>(null);

    const fetchSettings = async () => {
        const { data } = await supabase
            .from("restaurant_settings")
            .select("id, name, logo_url")
            .order("created_at", { ascending: true })
            .limit(1);

        if (data && data.length > 0) {
            setSettings(data[0]);
        }
    };

    useEffect(() => {
        fetchSettings();

        const channel = supabase
            .channel("restaurant-settings-realtime")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "restaurant_settings",
                },
                () => {
                    fetchSettings();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return settings;
};
