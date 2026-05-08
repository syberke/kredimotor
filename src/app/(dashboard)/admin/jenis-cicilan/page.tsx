import { supabase } from "@/lib/supabase";

export default async function JenisCicilanPage() {

  const { data } = await supabase
    .from("jenis_cicilan")
    .select("*");

  return (
    <div className="p-8 space-y-6">

      <h1 className="text-3xl font-black">
        Jenis Cicilan
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

            <h2 className="font-bold text-2xl">
              {item.lama_cicilan} Bulan
            </h2>

            <p className="text-blue-600 mt-3">
              Margin:
              {" "}
              {item.margin_kredit}%
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}