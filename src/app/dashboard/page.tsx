import AdminView from "@/components/AdminView";
import { getAccessToken, getRole } from "@/utils/connection";
import { launch } from "@/utils/create-vm";
import { redirect } from "next/navigation";

async function getFQDN(
  publisher: string | undefined,
  offer: string | undefined,
  sku: string | undefined
) {
  const VMState = await launch(publisher, offer, sku);

  if (!VMState) {
    return redirect("/dashboard?error=true");
  }

  const { fqdn } = VMState;
  return fqdn;
}

async function handleCreation(
  publisher: string | undefined,
  offer: string | undefined,
  sku: string | undefined
) {
  "use server";

  const fqdn = await getFQDN(publisher, offer, sku);

  if (fqdn === undefined) {
    return redirect("/dashboard?error=true");
  }

  return redirect(`/vm/${fqdn}`);
}

export default async function Admin() {
  const token = await getAccessToken();

  if (token === undefined) {
    return redirect("/?error=true");
  }

  const tokenValue = JSON.parse(token).value;

  const role = await getRole(tokenValue);

  if (role === "undefined") {
    return redirect("/?error=true");
  }

  return <AdminView role={role} creation={handleCreation} />;
}
