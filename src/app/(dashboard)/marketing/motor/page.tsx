import MotorTable from "@/components/motor/MotorTable";

import {
  getMotorData,
} from "@/services/motor.service";

export default async function MarketingMotorPage() {
  const data = await getMotorData();

  return (
    <div className="p-8 space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="
          text-3xl
          font-black
        ">
          Katalog Motor
        </h1>

        <p className="text-slate-500 mt-1">
          Monitoring stok dan katalog motor
        </p>

      </div>

      {/* TABLE */}
      <MotorTable data={data} />

    </div>
  );
}