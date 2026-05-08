// src/components/kredit/KreditPageClient.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import AddKreditModal from "./AddKreditModal";
import { KreditOptions } from "@/types/kredit.types";

type Props = {
  children: React.ReactNode;
  options: KreditOptions;
};

export default function KreditPageClient({ children, options }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isOpen = searchParams.get("modal") === "tambah";

// src/components/kredit/KreditPageClient.tsx
const handleClose = () => {
  const params = new URLSearchParams(searchParams.toString());
  params.delete("modal");
  // ✅ Ganti /kredit menjadi /admin/kredit
  router.replace(`/admin/kredit?${params.toString()}`, { scroll: false });
};
  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <>
      {children}
      {isOpen && (
        <AddKreditModal
          isOpen={isOpen}
          onClose={handleClose}
          onSuccess={handleSuccess}
          options={options}
        />
      )}
    </>
  );
}