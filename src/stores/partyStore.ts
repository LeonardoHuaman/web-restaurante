import { create } from "zustand";

interface PartyState {
    partyId: string | null;
    setParty: (id: string) => void;
    clearParty: () => void;
}

export const usePartyStore = create<PartyState>((set) => ({
    partyId: null,
    setParty: (id) => set({ partyId: id }),
    clearParty: () => set({ partyId: null }),
}));
