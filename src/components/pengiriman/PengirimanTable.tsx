import PengirimanStatusBadge from "./PengirimanStatusBadge";

type Props = {
  data: any[];
};

export default function PengirimanTable({
  data,
}: Props) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">

      {/* HEADER */}
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold">
          Data Pengiriman
        </h2>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50">
            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Invoice
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Pelanggan
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Motor
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Kurir
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Tanggal Kirim
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Status
              </th>

            </tr>
          </thead>

          <tbody>

            {data.map((item) => (
              <tr
                key={item.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >

                {/* INVOICE */}
                <td className="px-6 py-4 font-semibold">

                  {item.no_invoice}

                </td>

                {/* PELANGGAN */}
                <td className="px-6 py-4">

                  <div>
                    <p className="font-semibold">
                      {
                        item.kredit?.pengajuan_kredit
                          ?.pelanggan
                          ?.nama_pelanggan
                      }
                    </p>

                    <p className="text-sm text-slate-500">
                      {
                        item.kredit?.pengajuan_kredit
                          ?.pelanggan
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
                        item.kredit?.pengajuan_kredit
                          ?.motor?.foto1 ||
                        "https://via.placeholder.com/60"
                      }
                      className="w-14 h-14 rounded-xl object-cover"
                    />

                    <p className="font-semibold">
                      {
                        item.kredit?.pengajuan_kredit
                          ?.motor?.nama_motor
                      }
                    </p>

                  </div>

                </td>

                {/* KURIR */}
                <td className="px-6 py-4">

                  <div>
                    <p className="font-semibold">
                      {item.nama_kurir}
                    </p>

                    <p className="text-sm text-slate-500">
                      {item.telpon_kurir}
                    </p>
                  </div>

                </td>

                {/* TGL */}
                <td className="px-6 py-4 text-sm text-slate-500">

                  {item.tgl_kirim}

                </td>

                {/* STATUS */}
                <td className="px-6 py-4">

                  <PengirimanStatusBadge
                    status={item.status_kirim}
                  />

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}