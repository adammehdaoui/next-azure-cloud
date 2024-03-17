"use server";

import { launch } from "@/utils/create-vm";
import { RedirectType, redirect } from "next/navigation";

export async function handleCreation(
  publisher: string | undefined,
  offer: string | undefined,
  sku: string | undefined
) {
  const fqdn = await getFQDN(publisher, offer, sku);

  if (fqdn === undefined) {
    return redirect("/dashboard?error=true", RedirectType.replace);
  }

  return redirect(`/vm/${fqdn}`);
}

async function getFQDN(
  publisher: string | undefined,
  offer: string | undefined,
  sku: string | undefined
) {
  const VMState = await launch(publisher, offer, sku);

  if (!VMState) {
    return redirect("/dashboard?error=true", RedirectType.replace);
  }

  const { fqdn } = VMState;
  return fqdn;
}
