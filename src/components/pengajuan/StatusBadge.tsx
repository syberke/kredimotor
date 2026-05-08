type Props = {
  status: string;
};

export default function StatusBadge({
  status,
}: Props) {
  const colorMap: Record<string, string> = {
    "Menunggu Konfirmasi":
      "bg-yellow-100 text-yellow-700",

    Diproses:
      "bg-blue-100 text-blue-700",

    Diterima:
      "bg-emerald-100 text-emerald-700",

    Bermasalah:
      "bg-red-100 text-red-700",

    "Dibatalkan Pembeli":
      "bg-slate-100 text-slate-700",

    "Dibatalkan Penjual":
      "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`
        px-3 py-1 rounded-full text-xs font-semibold
        ${colorMap[status]}
      `}
    >
      {status}
    </span>
  );
}