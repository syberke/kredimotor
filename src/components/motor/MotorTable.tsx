"use client";

import Swal from "sweetalert2";
import { deleteMotor } from "@/services/motor.service";

type Props = {
  data: any[];
};

export default function MotorTable({
  data,
}: Props) {

  const handleDelete = async (
    id: number
  ) => {
    const result = await Swal.fire({
      title: "Hapus motor?",
      text: "Data tidak bisa dikembalikan",
      icon: "warning",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    await deleteMotor(id);

    Swal.fire(
      "Berhasil",
      "Motor berhasil dihapus",
      "success"
    );

    window.location.reload();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">

      {/* HEADER */}
      <div className="p-6 border-b border-slate-100">

        <h2 className="text-xl font-bold">
          Data Motor
        </h2>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50">
            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Motor
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Jenis
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Harga
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Mesin
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Stok
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Aksi
              </th>

            </tr>
          </thead>

          <tbody>

            {data.map((item) => (
              <tr
                key={item.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >

                {/* MOTOR */}
                <td className="px-6 py-4">

                  <div className="flex items-center gap-3">

                    <img
                      src={
                        item.foto1 ||
                        "https://via.placeholder.com/60"
                      }
                      className="w-16 h-16 rounded-2xl object-cover"
                    />

                    <div>

                      <p className="font-semibold">
                        {item.nama_motor}
                      </p>

                      <p className="text-sm text-slate-500">
                        {item.warna}
                      </p>

                    </div>

                  </div>

                </td>

                {/* JENIS */}
                <td className="px-6 py-4">

                  {item.jenis_motor?.jenis}

                </td>

                {/* HARGA */}
                <td className="px-6 py-4 font-bold">

                  Rp{" "}
                  {item.harga_jual?.toLocaleString(
                    "id-ID"
                  )}

                </td>

                {/* MESIN */}
                <td className="px-6 py-4">

                  {item.kapasitas_mesin}

                </td>

                {/* STOK */}
                <td className="px-6 py-4">

                  <span className="
                    bg-blue-100
                    text-blue-700
                    px-3 py-1
                    rounded-full
                    text-xs
                    font-semibold
                  ">
                    {item.stok}
                  </span>

                </td>

                {/* AKSI */}
                <td className="px-6 py-4">

                  <div className="flex gap-2">

                    <button
                      className="
                        bg-amber-500
                        hover:bg-amber-600
                        text-white
                        px-4 py-2
                        rounded-xl
                        text-sm
                      "
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(item.id)
                      }
                      className="
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        px-4 py-2
                        rounded-xl
                        text-sm
                      "
                    >
                      Hapus
                    </button>

                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}