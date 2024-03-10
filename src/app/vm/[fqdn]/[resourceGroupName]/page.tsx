"use client";

import VMStateView from "@/components/VMStateView";
import { delayedCleanup } from "@/utils/cleanup-vm";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

export default function VM() {
  const fqdn = usePathname().split("/")[2];
  const resourceGroupName = usePathname().split("/")[3];

  toast.info("La machine virtuelle sera supprimée dans 10 minutes");

  delayedCleanup(resourceGroupName);

  return <VMStateView fqdn={fqdn} />;
}
