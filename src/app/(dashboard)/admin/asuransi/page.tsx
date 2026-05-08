import { supabase } from "@/lib/supabase";

export default async function AsuransiPage() {

  const { data } = await supabase
    .from("asuransi")
    .select("*");

  return (
    <div className="p-8 space-y-6">

      <h1 className="text-3xl font-black">
        Asuransi
      </h1>

      <div className="grid md:grid-cols-3 gap-5">

        {data?.map((item) => (
          <div
            key={item.id}
            className="
              bg-white
              rounded-3xl
              border
              p-6
            "
          >

            <h2 className="font-bold text-lg">
              {item.nama_asuransi}
            </h2>

            <p className="text-slate-500">
              {item.nama_perusahaan_asuransi}
            </p>

            <p className="mt-4 text-emerald-600 font-bold">
              {item.margin_asuransi}%
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}