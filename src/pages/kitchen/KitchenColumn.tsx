import KitchenOrderCard from "./KitchenOrderCard";
import KitchenReadyCard from "./KitchenReadyCard";
import {
    KitchenOrderGroup,
    KitchenReadyGroup,
} from "../../stores/kitchenStore";
import {
    BellRing,
    CookingPot,
    ConciergeBell,
    CheckCircle,
    Utensils,
} from "lucide-react";

// 1. AÑADIMOS accentColor A LOS TIPOS
type Props =
    | {
        title: string;
        status: "por_preparar" | "en_cocina";
        orders: KitchenOrderGroup[];
        onOpen: (order: KitchenOrderGroup) => void;
        accentColor?: string; // <--- Nuevo (Opcional)
    }
    | {
        title: string;
        status: "listo";
        readyGroups: KitchenReadyGroup[];
        accentColor?: string; // <--- Nuevo (Opcional)
    };

export default function KitchenColumn(props: Props) {
    const count =
        props.status === "listo"
            ? props.readyGroups.length
            : props.orders.length;

    const headerConfig = {
        por_preparar: {
            icon: BellRing,
            bg: "bg-red-500",
            badge: "bg-red-500",
            animate: "animate-critical",
        },
        en_cocina: {
            icon: CookingPot,
            bg: "bg-amber-500",
            badge: "bg-amber-500",
            animate: "",
        },
        listo: {
            icon: ConciergeBell,
            bg: "bg-green-500",
            badge: "bg-green-500",
            animate: "",
        },
    } as const;

    const emptyConfig = {
        por_preparar: {
            icon: CheckCircle,
            title: "No hay pedidos pendientes",
        },
        en_cocina: {
            icon: CookingPot,
            title: "La cocina está libre",
        },
        listo: {
            icon: Utensils,
            title: "Nada por servir",
        },
    } as const;

    const cfg = headerConfig[props.status];
    const empty = emptyConfig[props.status];
    const Icon = cfg.icon;
    const EmptyIcon = empty.icon;

    const hasContent =
        props.status === "listo"
            ? props.readyGroups.length > 0
            : props.orders.length > 0;

    return (
        // 2. APLICAMOS EL accentColor EN EL DIV PRINCIPAL
        // Añadimos 'border-t-4' y la clase que viene en props.accentColor
        <div className={`
            bg-white rounded-2xl p-3 shadow-sm flex flex-col h-[calc(100vh-230px)]
            border-t-4 ${props.accentColor || 'border-transparent'}
        `}>
            {/* HEADER */}
            <div className="flex items-center gap-3 mb-3">
                <div
                    className={`
                        h-9 w-9 rounded-full
                        flex items-center justify-center
                        text-white
                        ${cfg.bg}
                        ${cfg.animate}
                    `}
                >
                    <Icon size={18} />
                </div>

                <h2 className="font-bold text-sm flex-1">
                    {props.title}
                </h2>

                <div
                    className={`
                        h-7 min-w-[28px] px-2
                        rounded-full
                        flex items-center justify-center
                        text-xs font-bold text-white
                        ${cfg.badge}
                    `}
                >
                    {count}
                </div>
            </div>

            {/* CONTENIDO */}
            <div className="flex-1 overflow-y-auto pr-1">
                {hasContent ? (
                    <div className="space-y-4">
                        {props.status === "listo"
                            ? props.readyGroups.map((group) => (
                                <KitchenReadyCard
                                    key={group.table_number}
                                    group={group}
                                />
                            ))
                            : props.orders.map((order) => (
                                <KitchenOrderCard
                                    key={order.order_id}
                                    order={order}
                                    status={props.status}
                                    onOpen={props.onOpen}
                                />
                            ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-black gap-3 opacity-40">
                        <EmptyIcon size={42} />
                        <span className="text-sm font-semibold text-center">
                            {empty.title}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}