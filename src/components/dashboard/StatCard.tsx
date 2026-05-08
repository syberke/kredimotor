type Props = {
  title: string;
  value: string | number;
};

export default function StatCard({
  title,
  value,
}: Props) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition">
      <p className="text-sm text-slate-500 mb-2">
        {title}
      </p>

      <h2 className="text-3xl font-black text-slate-800">
        {value}
      </h2>
    </div>
  );
}