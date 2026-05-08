import StatusBadge from "./StatusBadge";

type Props = {
  data: any[];
};

export default function PengajuanTable({
  data,
}: Props) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">

      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold">
          Data Pengajuan Kredit
        </h2>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50">
            <tr className="text-left">

              <th className="px-6 py-4 text-sm font-semibold">
                Pelanggan
              </th>

              <th className="px-6 py-4 text-sm font-semibold">
                Motor
              </th>

              <th className="px-6 py-4 text-sm font-semibold">
                Harga
              </th>

              <th className="px-6 py-4 text-sm font-semibold">
                Cicilan
              </th>

              <th className="px-6 py-4 text-sm font-semibold">
                Status
              </th>

              <th className="px-6 py-4 text-sm font-semibold">
                Aksi
              </th>

            </tr>
          </thead>

          <tbody>

            {data.map((item) => (
              <tr
                key={item.id}
                className="border-t border-slate-100 hover:bg-slate-50 transition"
              >

                {/* PELANGGAN */}
                <td className="px-6 py-4">

                  <div>
                    <p className="font-semibold text-slate-800">
                      {item.pelanggan?.nama_pelanggan}
                    </p>

                    <p className="text-sm text-slate-500">
                      {item.pelanggan?.email}
                    </p>
                  </div>

                </td>

                {/* MOTOR */}
                <td className="px-6 py-4">

                  <div className="flex items-center gap-3">

                    <img
                      src={
                        item.motor?.foto1 ||
                        "https://via.placeholder.com/60"
                      }
                      className="w-14 h-14 rounded-xl object-cover"
                    />

                    <div>
                      <p className="font-semibold">
                        {item.motor?.nama_motor}
                      </p>
                    </div>

                  </div>

                </td>

                {/* HARGA */}
                <td className="px-6 py-4 font-semibold">
                  Rp{" "}
                  {item.harga_kredit?.toLocaleString("id-ID")}
                </td>

                {/* CICILAN */}
                <td className="px-6 py-4">
                  {item.jenis_cicilan?.lama_cicilan} Bulan
                </td>

                {/* STATUS */}
                <td className="px-6 py-4">
                  <StatusBadge
                    status={item.status_pengajuan}
                  />
                </td>

                {/* AKSI */}
                <td className="px-6 py-4">

                  <button
                    className="
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      px-4 py-2
                      rounded-xl
                      text-sm
                      font-medium
                    "
                  >
                    Detail
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}