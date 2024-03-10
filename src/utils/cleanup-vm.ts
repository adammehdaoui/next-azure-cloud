import { ResourceManagementClient } from "@azure/arm-resources";
import { DefaultAzureCredential } from "@azure/identity";

// Azure platform authentication
const clientId = process.env.AZURE_CLIENT_ID;
const domain = process.env.AZURE_TENANT_ID;
const secret = process.env.AZURE_CLIENT_SECRET;
const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;

if (!clientId || !domain || !secret || !subscriptionId) {
  throw new Error("Default credentials couldn't be found");
}

export async function launchCleanup(resourceGroupName: string): Promise<void> {
  try {
    console.log(
      "Deleting the resource group can take a few minutes, so please be patient :)."
    );

    await deleteResourceGroup(resourceGroupName);
    console.log(
      "Successfully deleted the resource group and assigned VMs : " +
        resourceGroupName
    );
  } catch (err) {
    console.log(err);
  }
}

const deleteResourceGroup = async (
  resourceGroupName: string
): Promise<void> => {
  console.log("\nDeleting resource group: " + resourceGroupName);
  return await resourceClient.resourceGroups.beginDeleteAndWait(
    resourceGroupName
  );
};

const credentials = new DefaultAzureCredential();
const resourceClient = new ResourceManagementClient(
  credentials,
  subscriptionId
);
