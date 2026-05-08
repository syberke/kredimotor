import { getJenisMotor } from "@/services/jenismotor.service";

export default async function JenisMotorPage() {
  const data = await getJenisMotor();

  return (
    <div className="p-8 space-y-6">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-black">
            Jenis Motor
          </h1>

          <p className="text-slate-500 mt-1">
            Kelola kategori motor
          </p>
        </div>

        <button className="
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-5 py-3
          rounded-2xl
        ">
          Tambah Jenis
        </button>

      </div>

      <div className="bg-white rounded-3xl border overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="text-left px-6 py-4">
                Jenis
              </th>

              <th className="text-left px-6 py-4">
                Merk
              </th>

            </tr>

          </thead>

          <tbody>

            {data.map((item) => (
              <tr
                key={item.id}
                className="border-t"
              >

                <td className="px-6 py-4">
                  {item.jenis}
                </td>

                <td className="px-6 py-4">
                  {item.merk}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}