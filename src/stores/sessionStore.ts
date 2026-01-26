// frontend/stores/sessionStore.ts
import { create } from "zustand";

interface SessionState {
    sessionToken: string | null;
    setSession: (token: string) => void;
    clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
    sessionToken: localStorage.getItem("session_token"),
    setSession: (token) => {
        localStorage.setItem("session_token", token);
        set({ sessionToken: token });
    },
    clearSession: () => {
        localStorage.removeItem("session_token");
        set({ sessionToken: null });
    },
}));
