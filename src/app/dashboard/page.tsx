import AdminView from "@/components/AdminView";
import { getAccessToken, validateToken } from "@/utils/connection";
import { launch } from "@/utils/create-vm";
import { redirect } from "next/navigation";

export default async function Admin() {
  async function handleCreation(publisher: string | undefined, offer: string | undefined, sku: string | undefined) {
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

  const token = await getAccessToken();

  if (token === undefined) {
    redirect("/?error=true");
  }

  const tokenValue = JSON.parse(token).value;

  try {
    const decodedToken = await validateToken(tokenValue);

    const role = decodedToken.role;

    return <AdminView role={role} creation={handleCreation} />;
  } catch (error) {
    console.error(error);
    redirect("/?error=true");
  }
}
