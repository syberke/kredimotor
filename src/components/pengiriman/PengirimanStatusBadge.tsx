type Props = {
  status: string;
};

export default function PengirimanStatusBadge({
  status,
}: Props) {
  const colorMap: Record<string, string> = {
    "Sedang Dikirim":
      "bg-blue-100 text-blue-700",

    "Tiba Di Tujuan":
      "bg-emerald-100 text-emerald-700",
  };

  return (
    <span
      className={`
        px-3 py-1 rounded-full text-xs font-semibold
        ${colorMap[status] || "bg-slate-100 text-slate-700"}
      `}
    >
      {status}
    </span>
  );
}