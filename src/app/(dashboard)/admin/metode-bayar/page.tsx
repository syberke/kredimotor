import { supabase } from "@/lib/supabase";

export default async function MetodeBayarPage() {

  const { data } = await supabase
    .from("metode_bayar")
    .select("*");

  return (
    <div className="p-8 space-y-6">

      <h1 className="text-3xl font-black">
        Metode Bayar
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
              {item.metode_pembayaran}
            </h2>

            <p className="text-slate-500 mt-2">
              {item.tempat_bayar}
            </p>

            <p className="text-sm mt-4">
              {item.no_rekening}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}