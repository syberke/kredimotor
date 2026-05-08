import { supabase } from "@/lib/supabase";

export default async function UsersPage() {

  const { data } = await supabase
    .from("users")
    .select("*");

  return (
    <div className="p-8 space-y-6">

      <div>
        <h1 className="text-3xl font-black">
          Users
        </h1>

        <p className="text-slate-500 mt-1">
          Administrator sistem
        </p>
      </div>

      <div className="bg-white rounded-3xl border overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="text-left px-6 py-4">
                Nama
              </th>

              <th className="text-left px-6 py-4">
                Email
              </th>

              <th className="text-left px-6 py-4">
                Role
              </th>

            </tr>

          </thead>

          <tbody>

            {data?.map((item) => (
              <tr
                key={item.id}
                className="border-t"
              >

                <td className="px-6 py-4 font-semibold">
                  {item.name}
                </td>

                <td className="px-6 py-4">
                  {item.email}
                </td>

                <td className="px-6 py-4">

                  <span className="
                    bg-blue-100
                    text-blue-700
                    px-3 py-1
                    rounded-full
                    text-xs
                    font-semibold
                  ">
                    {item.role}
                  </span>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}