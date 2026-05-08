type Props = {
  status: string;
};

export default function KreditStatusBadge({
  status,
}: Props) {
  const colorMap: Record<string, string> = {
    Dicicil:
      "bg-blue-100 text-blue-700",

    Lunas:
      "bg-emerald-100 text-emerald-700",

    Macet:
      "bg-red-100 text-red-700",
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