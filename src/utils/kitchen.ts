export type KitchenUrgency = "nuevo" | "en_tiempo" | "critico";

export const minutesBetween = (utcDate: string) => {
    const now = Date.now();
    const created = new Date(utcDate).getTime();
    return Math.floor((now - created) / 60000);
};

export const getUrgency = (minutes: number): KitchenUrgency => {
    if (minutes > 30) return "critico";
    if (minutes >= 15) return "en_tiempo";
    return "nuevo";
};

export const formatElapsed = (minutes: number) => {
    if (minutes < 1) return "Hace instantes";
    if (minutes === 1) return "Hace 1 min";
    return `Hace ${minutes} min`;
};
