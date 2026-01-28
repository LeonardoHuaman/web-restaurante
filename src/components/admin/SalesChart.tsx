// src/components/admin/SalesChart.tsx
import React from "react";

export interface SalesByHour {
    hour_24: string; // "00" .. "23"
    total: number;
}

/* ============================
   NORMALIZA HORAS 00–23
============================ */
const normalizeHours = (data: SalesByHour[]): SalesByHour[] => {
    const map = new Map<string, number>(
        data.map(d => [d.hour_24, Number(d.total)])
    );

    return Array.from({ length: 24 }, (_, h) => {
        const hour = h.toString().padStart(2, "0");
        return {
            hour_24: hour,
            total: map.get(hour) ?? 0,
        };
    });
};

/* ============================
   COMPONENTE
============================ */
export const SalesChart: React.FC<{ data: SalesByHour[] }> = ({ data }) => {
    const normalizedData = normalizeHours(data);
    const max = Math.max(...normalizedData.map(d => d.total), 1);

    return (
        <div className="bg-primary border border-secondary/20 p-5 rounded-xl">
            <h3 className="font-bold mb-4 text-secondary">
                Ventas del día por hora
            </h3>

            <div className="relative h-48 flex items-end gap-2">
                {/* Línea base */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-secondary/30" />

                {normalizedData.map(d => {
                    const heightPercent = (d.total / max) * 100;

                    return (
                        <div
                            key={d.hour_24}
                            className="group relative flex-1 flex flex-col items-center"
                        >
                            {/* TOOLTIP */}
                            {d.total > 0 && (
                                <div
                                    className="
                    absolute -top-12
                    opacity-0 group-hover:opacity-100
                    transition
                    pointer-events-none
                  "
                                >
                                    <div
                                        className="
                      bg-secondary text-primary
                      text-xs px-3 py-1
                      rounded-lg shadow-lg
                      whitespace-nowrap
                    "
                                    >
                                        {d.hour_24}:00 — S/ {d.total.toFixed(2)}
                                    </div>
                                </div>
                            )}

                            {/* BARRA */}
                            <div
                                className="
                  w-full
                  bg-accent
                  rounded-t-lg
                  shadow-md
                  transition-all
                  active:scale-95
                "
                                style={{
                                    height: `${heightPercent}%`,
                                    minHeight: d.total > 0 ? "10px" : "2px",
                                    opacity: d.total > 0 ? 1 : 0.15,
                                }}
                            />

                            {/* LABEL HORA 24H */}
                            <span className="mt-2 text-[10px] text-secondary/60">
                                {d.hour_24}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* ESTADO VACÍO */}
            {data.length === 0 && (
                <p className="text-sm text-secondary/60 mt-4">
                    No hay ventas registradas hoy
                </p>
            )}
        </div>
    );
};

export default SalesChart;
