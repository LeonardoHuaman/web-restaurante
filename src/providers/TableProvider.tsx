import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useTableStore } from "../stores/tableStore";
import { useSessionStore } from "../stores/sessionStore";
import { usePartyStore } from "../stores/partyStore";
import { getOrCreateParty } from "../utils/party";
import { init } from "i18next";

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

        init();
    }, []);

    useEffect(() => {
        const tableToken = params.get("table");

        if (!tableToken) {
            setInvalid();
            navigate("/invalid-table", { replace: true });
            return;
        }

        const init = async () => {
            const { data: table, error } = await supabase
                .from("tables")
                .select("id, table_number")
                .eq("qr_token", tableToken)
                .single();

            if (error || !table) {
                setInvalid();
                navigate("/invalid-table", { replace: true });
                return;
            }

            setTable(table.id, table.table_number);

            let currentSessionToken: string;

            if (!sessionToken) {
                const { data: session, error: sessionError } = await supabase
                    .from("table_sessions")
                    .insert({
                        table_id: table.id,
                        expires_at: new Date(Date.now() + TWO_HOURS).toISOString(),
                    })
                    .select("session_token")
                    .single();

                if (sessionError || !session) {
                    navigate("/invalid-table", { replace: true });
                    return;
                }

                currentSessionToken = session.session_token;
                setSession(currentSessionToken);
            } else {
                currentSessionToken = sessionToken;
            }

            const partyId = await getOrCreateParty(
                table.id,
            );

            setParty(partyId);
        };

        init();
    }, []);

    return <>{children}</>;
};

export default TableProvider;
