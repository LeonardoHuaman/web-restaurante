import { supabase } from "../services/supabaseClient";
import { useSessionStore } from "../stores/sessionStore";

export const getOrCreateParty = async (tableId: string): Promise<string> => {
    const sessionToken = useSessionStore.getState().sessionToken;

    if (!sessionToken) {
        throw new Error("No hay session_token");
    }

    const { data, error } = await supabase.functions.invoke(
        "get-or-create-party",
        {
            body: {
                table_id: tableId,
                session_token: sessionToken,
            },
        }
    );

    if (error) {
        throw new Error(error.message);
    }

    if (!data?.party_id) {
        throw new Error("No se pudo obtener party");
    }

    return data.party_id;
};
