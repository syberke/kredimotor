export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Dashboard Pelanggan
      </h1>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          Total Kredit
        </div>

        <div className="bg-white p-4 rounded shadow">
          Sisa Kredit
        </div>

        <div className="bg-white p-4 rounded shadow">
          Status
        </div>
      </div>
    </div>
  );
}