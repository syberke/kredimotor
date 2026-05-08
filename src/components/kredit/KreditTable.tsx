import KreditStatusBadge from "./KreditStatusBadge";

type Props = {
  data: any[];
};

export default function KreditTable({
  data,
}: Props) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">

      {/* HEADER */}
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold">
          Data Kredit
        </h2>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50">
            <tr>

              <th className="text-left px-6 py-4 text-sm font-semibold">
                Pelanggan
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold">
                Motor
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold">
                Kredit
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold">
                Cicilan
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold">
                Sisa Kredit
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold">
                Status
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold">
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
                      {
                        item.pengajuan_kredit?.pelanggan
                          ?.nama_pelanggan
                      }
                    </p>

                    <p className="text-sm text-slate-500">
                      {
                        item.pengajuan_kredit?.pelanggan
                          ?.email
                      }
                    </p>
                  </div>

                </td>

                {/* MOTOR */}
                <td className="px-6 py-4">

                  <div className="flex items-center gap-3">

                    <img
                      src={
                        item.pengajuan_kredit?.motor
                          ?.foto1 ||
                        "https://via.placeholder.com/60"
                      }
                      className="w-14 h-14 rounded-xl object-cover"
                    />

                    <p className="font-semibold">
                      {
                        item.pengajuan_kredit?.motor
                          ?.nama_motor
                      }
                    </p>

                  </div>

                </td>

                {/* KREDIT */}
                <td className="px-6 py-4 font-semibold">

                  Rp{" "}
                  {item.pengajuan_kredit?.harga_kredit?.toLocaleString(
                    "id-ID"
                  )}

                </td>

                {/* CICILAN */}
                <td className="px-6 py-4">

                  Rp{" "}
                  {item.pengajuan_kredit?.cicilan_perbulan?.toLocaleString(
                    "id-ID"
                  )}

                </td>

                {/* SISA */}
                <td className="px-6 py-4 font-bold text-red-500">

                  Rp{" "}
                  {item.sisa_kredit?.toLocaleString(
                    "id-ID"
                  )}

                </td>

                {/* STATUS */}
                <td className="px-6 py-4">
                  <KreditStatusBadge
                    status={item.status_kredit}
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