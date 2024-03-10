import AdminView from "@/components/AdminView";
import { getAccessToken, validateToken } from "@/utils/connection";
import { launch } from "@/utils/create-vm";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default async function Admin() {
  async function handleCreation() {
    "use server";

    const VMState = await launch();

    if (VMState) {
      const { fqdn, resourceGroupName } = VMState;
      redirect(`/vm/${fqdn}/${resourceGroupName}`);
    } else {
      toast.error(
        "Erreur dans la création de la machine virtuelle et de son groupe de ressource, veuillez réessayer."
      );
    }
  }

  const token = await getAccessToken();

  if (token === undefined) {
    redirect("/");
  }

  const tokenValue = JSON.parse(token).value;

  try {
    const decodedToken = await validateToken(tokenValue);

    const role = decodedToken.role;

    return <AdminView role={role} creation={handleCreation} />;
  } catch (error) {
    console.error(error);
    redirect("/");
  }
}