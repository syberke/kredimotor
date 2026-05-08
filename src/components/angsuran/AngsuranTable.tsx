type Props = {
  data: any[];
};

export default function AngsuranTable({
  data,
}: Props) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">

      {/* HEADER */}
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold">
          Data Angsuran
        </h2>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50">
            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Pelanggan
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Motor
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Angsuran
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Total Bayar
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Sisa Kredit
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Tanggal
              </th>

            </tr>
          </thead>

          <tbody>

            {data.map((item) => (
              <tr
                key={item.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >

                {/* PELANGGAN */}
                <td className="px-6 py-4 font-semibold">

                  {
                    item.kredit?.pengajuan_kredit
                      ?.pelanggan?.nama_pelanggan
                  }

                </td>

                {/* MOTOR */}
                <td className="px-6 py-4">

                  {
                    item.kredit?.pengajuan_kredit
                      ?.motor?.nama_motor
                  }

                </td>

                {/* KE */}
                <td className="px-6 py-4">

                  Angsuran ke-
                  {item.angsuran_ke}

                </td>

                {/* TOTAL */}
                <td className="px-6 py-4 font-bold text-emerald-600">

                  Rp{" "}
                  {item.total_bayar?.toLocaleString(
                    "id-ID"
                  )}

                </td>

                {/* SISA */}
                <td className="px-6 py-4 font-semibold text-red-500">

                  Rp{" "}
                  {item.kredit?.sisa_kredit?.toLocaleString(
                    "id-ID"
                  )}

                </td>

                {/* TGL */}
                <td className="px-6 py-4 text-sm text-slate-500">

                  {item.tgl_bayar}

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}