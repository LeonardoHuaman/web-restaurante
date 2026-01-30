import { supabase } from "../../services/supabaseClient";

export const getOrCreateParty = async (
    tableId: string,
    sessionToken: string
): Promise<string> => {
    const { data, error } = await supabase.functions.invoke(
        "get-or-create-party",
        {
            body: {
                table_id: tableId,
                session_token: sessionToken,
            },
        }
    );

    if (error) throw error;
    if (!data?.party_id) throw new Error("No se pudo obtener party");

    return data.party_id;
};
