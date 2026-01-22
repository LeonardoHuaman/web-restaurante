import { create } from "zustand";

interface SessionState {
    sessionToken: string | null;
    isReady: boolean;
    setSession: (token: string) => void;
    clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
    sessionToken: localStorage.getItem("session_token"),
    isReady: !!localStorage.getItem("session_token"),

    setSession: (token) => {
        localStorage.setItem("session_token", token);
        set({ sessionToken: token, isReady: true });
    },

    clearSession: () => {
        localStorage.removeItem("session_token");
        set({ sessionToken: null, isReady: false });
    },
}));
