import React from "react";

export interface PeopleByHour {
    hour_24: string;
    total: number;
}

export const PeopleChart: React.FC<{ data: PeopleByHour[] }> = ({
    data = [],
}) => {
    if (data.length === 0) return null;

    const max = Math.max(...data.map(d => d.total), 1);

    return (
        <div className="bg-primary border border-secondary/20 p-5 rounded-xl">
            <h3 className="font-bold mb-4 text-secondary">
                Personas ingresadas por hora
            </h3>

            <div className="relative h-48 flex items-end gap-2">
                <div className="absolute bottom-0 left-0 right-0 h-px bg-secondary/30" />

                {data.map(d => {
                    const height = (d.total / max) * 100;

                    return (
                        <div
                            key={d.hour_24}
                            className="group relative flex-1 flex flex-col items-center"
                        >
                            {/* TOOLTIP */}
                            <div
                                className="
                  absolute -top-10
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
                                    {d.hour_24}:00 — {d.total} personas
                                </div>
                            </div>

                            {/* BARRA */}
                            <div
                                className="w-full bg-accent rounded-t-lg shadow-md"
                                style={{
                                    height: `${height}%`,
                                    minHeight: d.total > 0 ? "10px" : "2px",
                                    opacity: d.total > 0 ? 1 : 0.15,
                                }}
                            />

                            <span className="mt-2 text-[10px] text-secondary/60">
                                {d.hour_24}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PeopleChart;
