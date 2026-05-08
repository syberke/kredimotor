import { getPelanggan } from "@/services/pelanggan.service";

export default async function PelangganPage() {
  const data = await getPelanggan();

  return (
    <div className="p-8 space-y-6">

      <div>
        <h1 className="text-3xl font-black">
          Pelanggan
        </h1>

        <p className="text-slate-500 mt-1">
          Data pelanggan sistem
        </p>
      </div>

      <div className="bg-white rounded-3xl border overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="text-left px-6 py-4">
                Nama
              </th>

              <th className="text-left px-6 py-4">
                Email
              </th>

              <th className="text-left px-6 py-4">
                No Telp
              </th>

              <th className="text-left px-6 py-4">
                Kota
              </th>

            </tr>

          </thead>

          <tbody>

            {data.map((item) => (
              <tr
                key={item.id}
                className="border-t"
              >

                <td className="px-6 py-4 font-semibold">
                  {item.nama_pelanggan}
                </td>

                <td className="px-6 py-4">
                  {item.email}
                </td>

                <td className="px-6 py-4">
                  {item.no_telp}
                </td>

                <td className="px-6 py-4">
                  {item.kota1}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}