// src/hooks/usePartyMembers.ts
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export const usePartyMembers = (partyId: string | null) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!partyId) {
            setCount(0);
            return;
        }

        const fetchCount = async () => {
            const { count } = await supabase
                .from("party_members")
                .select("*", { count: "exact", head: true })
                .eq("party_id", partyId);

            setCount(count || 0);
        };

        fetchCount();

        const channel = supabase
            .channel(`party-members-${partyId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "party_members",
                    filter: `party_id=eq.${partyId}`,
                },
                fetchCount
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [partyId]);

    return count;
};
