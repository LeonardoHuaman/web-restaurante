import { supabase } from "../services/supabaseClient";

export const getOrCreateParty = async (
    tableId: string
): Promise<string> => {
    const { data, error } = await supabase.functions.invoke(
        "get-or-create-party",
        {
            body: {
                table_id: tableId,
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
