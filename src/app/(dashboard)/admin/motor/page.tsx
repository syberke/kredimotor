import MotorTable from "@/components/motor/MotorTable";
import { getMotorData } from "@/services/motor.service";

export default async function MotorPage() {
  const data = await getMotorData();

  return (
    <div className="p-8 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-black text-slate-800">
            Data Motor
          </h1>

          <p className="text-slate-500 mt-1">
            Kelola seluruh motor
          </p>

        </div>

        <button
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-5 py-3
            rounded-2xl
            font-medium
          "
        >
          Tambah Motor
        </button>

      </div>

      {/* TABLE */}
      <MotorTable data={data} />

    </div>
  );
}