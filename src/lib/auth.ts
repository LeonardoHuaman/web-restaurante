import { supabase } from "../services/supabaseClient";

export const getCurrentUserWithRole = async () => {
    const { data, error } = await supabase.functions.invoke(
        "get-current-user-role"
    );

    if (error || !data) return null;

    return {
        user: data.user,
        role: data.role,
    };
};
