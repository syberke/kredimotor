// src/components/kredit/KreditStatusBadge.tsx
import { StatusKredit } from "@/types/kredit.types";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

type Props = {
  status: StatusKredit;
  size?: "sm" | "md";
};

const config: Record<
  StatusKredit,
  { label: string; bg: string; text: string; icon: React.ReactNode; pulse?: boolean }
> = {
  Dicicil: {
    label: "Dicicil",
    bg: "bg-blue-50 border border-blue-200",
    text: "text-blue-700",
    icon: <Clock className="w-3 h-3" />,
    pulse: true,
  },
  Lunas: {
    label: "Lunas",
    bg: "bg-emerald-50 border border-emerald-200",
    text: "text-emerald-700",
    icon: <CheckCircle className="w-3 h-3" />,
  },
  Macet: {
    label: "Macet",
    bg: "bg-red-50 border border-red-200",
    text: "text-red-700",
    icon: <AlertCircle className="w-3 h-3" />,
  },
};

export default function KreditStatusBadge({ status, size = "md" }: Props) {
  const c = config[status];
  const sizeCls = size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${c.bg} ${c.text} ${sizeCls} ${c.pulse ? "relative" : ""}`}
    >
      {c.pulse && (
        <span className="absolute inline-flex h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
      )}
      {c.icon}
      {c.label}
    </span>
  );
}