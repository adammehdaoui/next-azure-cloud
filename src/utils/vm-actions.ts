"use server";

import { launch } from "@/utils/create-vm";
import { RedirectType, redirect } from "next/navigation";

export async function handleCreation(
  publisher: string,
  offer: string,
  sku: string,
  windows: boolean
) {
  const fqdn = await getFQDN(publisher, offer, sku);

  if (fqdn === undefined) {
    return redirect("/dashboard?error=true", RedirectType.replace);
  }

  return redirect(`/vm/${fqdn}?windows=${windows}`, RedirectType.replace);
}

async function getFQDN(
  publisher: string,
  offer: string,
  sku: string
) {
  const VMState = await launch(publisher, offer, sku);

  if (!VMState) {
    return redirect("/dashboard?error=true", RedirectType.replace);
  }

  const { fqdn } = VMState;
  return fqdn;
}
