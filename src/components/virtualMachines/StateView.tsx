"use client";

import UnixStateView from "@/components/virtualMachines/UnixStateView";
import WindowsStateView from "@/components/virtualMachines/WindowsStateView";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function StateView() {
  const { fqdn } = useParams();
  const windows = useSearchParams().get("windows") === "true";

  toast.info("La machine virtuelle sera supprimée dans 10 minutes", {
    duration: 60000,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      toast.success("Votre machine virtuelle a été supprimée", {
        duration: 60000,
      });
    }, 600000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 w-full">
      <div className="flex flex-col bg-white p-8 rounded-xl shadow-md w-1/2 space-y-5">
        {windows ? (
          <WindowsStateView fqdn={fqdn} />
        ) : (
          <UnixStateView fqdn={fqdn} />
        )}
      </div>
    </div>
  );
}
