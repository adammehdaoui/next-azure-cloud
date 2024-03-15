import AdminView from "@/components/AdminView";
import { getRole } from "@/utils/connection";
import { launch } from "@/utils/create-vm";
import { redirect } from "next/navigation";

export default async function Admin() {
  const role = await getRole();

  async function handleCreation(
    publisher: string | undefined,
    offer: string | undefined,
    sku: string | undefined
  ) {
    "use server";

    const VMState = await launch(publisher, offer, sku);

    if (VMState) {
      const { fqdn } = VMState;
      redirect(`/vm/${fqdn}`);
    } else {
      console.error(
        "Erreur dans la création de la machine virtuelle et de son groupe de ressource, veuillez réessayer."
      );
      redirect("/dashboard?error=true");
    }
  }

  return <AdminView role={role} creation={handleCreation} />;
}
