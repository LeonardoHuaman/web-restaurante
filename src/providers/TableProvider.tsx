import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useTableStore } from "../stores/tableStore";
import { useSessionStore } from "../stores/sessionStore";
import { usePartyStore } from "../stores/partyStore";
import { getOrCreateParty } from "../utils/party";

const TWO_HOURS = 2 * 60 * 60 * 1000;

const TableProvider = ({ children }: { children: React.ReactNode }) => {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const { setTable, setInvalid } = useTableStore();
    const { sessionToken, setSession } = useSessionStore();
    const { setParty } = usePartyStore();

    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const init = async () => {
            const tableToken = params.get("table");

            if (sessionToken) {
                const { data, error } = await supabase
                    .from("table_sessions")
                    .select(
                        `
            table_id,
            tables (
              id,
              table_number
            )
          `
                    )
                    .eq("session_token", sessionToken)
                    .gt("expires_at", new Date().toISOString())
                    .single<{
                        table_id: string;
                        tables: { id: string; table_number: number } | null;
                    }>();

                if (!error && data?.tables) {
                    setTable(data.tables.id, data.tables.table_number);

                    const partyId = await getOrCreateParty(
                        data.tables.id,
                        sessionToken
                    );
                    setParty(partyId);

                    navigate("/", { replace: true });
                    return;
                }

                setSession(null as any);
            }

            if (tableToken) {
                const { data: table, error } = await supabase
                    .from("tables")
                    .select("id, table_number")
                    .eq("qr_token", tableToken)
                    .single<{ id: string; table_number: number }>();

                if (error || !table) {
                    setInvalid();
                    navigate("/invalid-table", { replace: true });
                    return;
                }

                setTable(table.id, table.table_number);

                const { data: session, error: sessionError } = await supabase
                    .from("table_sessions")
                    .insert({
                        table_id: table.id,
                        expires_at: new Date(Date.now() + TWO_HOURS).toISOString(),
                    })
                    .select("session_token")
                    .single<{ session_token: string }>();

                if (sessionError || !session) {
                    setInvalid();
                    navigate("/invalid-table", { replace: true });
                    return;
                }

                setSession(session.session_token);

                const partyId = await getOrCreateParty(
                    table.id,
                    session.session_token
                );
                setParty(partyId);

                navigate("/", { replace: true });
                return;
            }

            setInvalid();
            navigate("/invalid-table", { replace: true });
        };

        init();
    }, []);

    return <>{children}</>;
};

export default TableProvider;
