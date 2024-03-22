"use server";

import type { VMInfo } from "@/utils/validators/vm-types";
import {
  ComputeManagementClient,
  VirtualMachine,
  VirtualMachineImageResource,
} from "@azure/arm-compute";
import type { PublicIPAddress, Subnet } from "@azure/arm-network";
import { NetworkManagementClient } from "@azure/arm-network";
import { ResourceManagementClient } from "@azure/arm-resources";
import { StorageManagementClient } from "@azure/arm-storage";
import { DefaultAzureCredential } from "@azure/identity";
import * as util from "util";

import { delayedCleanup, launchCleanup } from "@/utils/cleanup-vm";

// Resource configs
const location = "eastus";
const accType = "Standard_LRS";

const adminUsername = "notadmin";
const adminPassword = "Pa$$w0rd92";

// Azure platform authentication
const clientId = process.env.AZURE_CLIENT_ID;
const domain = process.env.AZURE_TENANT_ID;
const secret = process.env.AZURE_CLIENT_SECRET;
const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;

if (!clientId || !domain || !secret || !subscriptionId) {
  throw new Error("Default credentials couldn't be found");
}

const credentials = new DefaultAzureCredential();

// Azure services
const resourceClient = new ResourceManagementClient(
  credentials,
  subscriptionId
);
const computeClient = new ComputeManagementClient(credentials, subscriptionId);
const storageClient = new StorageManagementClient(credentials, subscriptionId);
const networkClient = new NetworkManagementClient(credentials, subscriptionId);

export async function launch(
  publisher: string | undefined,
  offer: string | undefined,
  sku: string | undefined
) {
  if (!publisher || !offer || !sku) {
    throw new Error(
      "Il manque des informations pour lancer la machine virtuelle. Veuillez réessayer."
    );
  }

  //Random number generator for service names and settings
  const resourceGroupName = _generateRandomId("nextrg");
  const vmName = _generateRandomId("nextvm");
  const storageAccountName = _generateRandomId("nextac");
  const vnetName = _generateRandomId("nextvnet");
  const subnetName = _generateRandomId("nextsubnet");
  const publicIPName = _generateRandomId("nextpip");
  const networkInterfaceName = _generateRandomId("nextnic");
  const ipConfigName = _generateRandomId("nextcrpip");
  const domainNameLabel = _generateRandomId("nextdomainname");
  const osDiskName = _generateRandomId("nextosdisk");

  try {
    const VMState = await createResources(
      publisher,
      offer,
      sku,
      resourceGroupName,
      storageAccountName,
      subnetName,
      vnetName,
      domainNameLabel,
      publicIPName,
      ipConfigName,
      networkInterfaceName,
      vmName,
      osDiskName
    );

    if (VMState === undefined) {
      throw new Error(
        "Erreur dans la création de la machine virtuelle et de son groupe de ressource, veuillez réessayer."
      );
    }

    delayedCleanup(resourceGroupName);

    return VMState;
  } catch (err) {
    launchCleanup(resourceGroupName);
    console.log(err);
  }
}

const createResources = async (
  publisher: string,
  offer: string,
  sku: string,
  resourceGroupName: string,
  storageAccountName: string,
  subnetName: string,
  vnetName: string,
  domainNameLabel: string,
  publicIPName: string,
  ipConfigName: string,
  networkInterfaceName: string,
  vmName: string,
  osDiskName: string
): Promise<VMInfo> => {
  await createResourceGroup(resourceGroupName);
  await createStorageAccount(storageAccountName, resourceGroupName);
  await createVnet(subnetName, vnetName, resourceGroupName);

  const subnetInfo = await getSubnetInfo(
    subnetName,
    resourceGroupName,
    vnetName
  );
  const publicIPInfo = await createPublicIP(
    domainNameLabel,
    publicIPName,
    resourceGroupName
  );

  const nicInfo = await createNIC(
    subnetInfo,
    publicIPInfo,
    ipConfigName,
    networkInterfaceName,
    resourceGroupName
  );

  const vmImageInfo = await findVMImage(publisher, offer, sku);

  if (nicInfo.id === undefined) {
    throw new Error("Erreur dans la création de l'interface réseau.");
  }

  await createVirtualMachine(
    nicInfo.id,
    vmImageInfo[0].name,
    publisher,
    offer,
    sku,
    vmName,
    osDiskName,
    resourceGroupName
  );

  if (!publicIPInfo) {
    throw new Error(
      "Erreur dans la création de la machine virtuelle et de son groupe de ressource, veuillez réessayer."
    );
  }

  return {
    fqdn: publicIPInfo.dnsSettings?.fqdn,
    resourceGroupName: resourceGroupName,
  } as VMInfo;
};

const createResourceGroup = async (
  resourceGroupName: string
): Promise<void> => {
  const groupParameters = {
    location: location,
    tags: { sampletag: "sampleValue" },
  };
  console.log("\n1. Creating resource group : " + resourceGroupName);
  await resourceClient.resourceGroups.createOrUpdate(
    resourceGroupName,
    groupParameters
  );
};

const createStorageAccount = async (
  storageAccountName: string,
  resourceGroupName: string
): Promise<void> => {
  console.log("\n2. Creating storage account : " + storageAccountName);
  const createParameters = {
    location: location,
    sku: {
      name: accType,
    },
    kind: "Storage",
    tags: {
      tag1: "val1",
      tag2: "val2",
    },
  };
  await storageClient.storageAccounts.beginCreateAndWait(
    resourceGroupName,
    storageAccountName,
    createParameters
  );
};

const createVnet = async (
  subnetName: string,
  vnetName: string,
  resourceGroupName: string
): Promise<void> => {
  const vnetParameters = {
    location: location,
    addressSpace: {
      addressPrefixes: ["10.0.0.0/16"],
    },
    dhcpOptions: {
      dnsServers: ["10.1.1.1", "10.1.2.4"],
    },
    subnets: [{ name: subnetName, addressPrefix: "10.0.0.0/24" }],
  };
  console.log("\n3. Creating vnet : " + vnetName);
  await networkClient.virtualNetworks.beginCreateOrUpdateAndWait(
    resourceGroupName,
    vnetName,
    vnetParameters
  );
};

const getSubnetInfo = async (
  subnetName: string,
  resourceGroupName: string,
  vnetName: string
): Promise<Subnet> => {
  console.log("\nGetting subnet info for : " + subnetName);
  return await networkClient.subnets.get(
    resourceGroupName,
    vnetName,
    subnetName
  );
};

const createPublicIP = async (
  domainNameLabel: string,
  publicIPName: string,
  resourceGroupName: string
): Promise<PublicIPAddress> => {
  const publicIPParameters = {
    location: location,
    publicIPAllocationMethod: "Dynamic",
    dnsSettings: {
      domainNameLabel: domainNameLabel,
    },
  };
  console.log("\n4. Creating public IP : " + publicIPName);
  return await networkClient.publicIPAddresses.beginCreateOrUpdateAndWait(
    resourceGroupName,
    publicIPName,
    publicIPParameters
  );
};

const createNIC = async (
  subnetInfo: Subnet,
  publicIPInfo: PublicIPAddress,
  ipConfigName: string,
  networkInterfaceName: string,
  resourceGroupName: string
) => {
  const nicParameters = {
    location: location,
    ipConfigurations: [
      {
        name: ipConfigName,
        privateIPAllocationMethod: "Dynamic",
        subnet: subnetInfo,
        publicIPAddress: publicIPInfo,
      },
    ],
  };
  console.log("\n5. Creating Network Interface : " + networkInterfaceName);
  return await networkClient.networkInterfaces.beginCreateOrUpdateAndWait(
    resourceGroupName,
    networkInterfaceName,
    nicParameters
  );
};

const findVMImage = async (
  publisher: string,
  offer: string,
  sku: string
): Promise<VirtualMachineImageResource[]> => {
  console.log(
    util.format(
      "\nFinding a VM Image for location %s from " +
        "publisher %s with offer %s and sku %s",
      location,
      publisher,
      offer,
      sku
    )
  );
  return await computeClient.virtualMachineImages.list(
    location,
    publisher,
    offer,
    sku,
    { top: 1 }
  );
};

const createVirtualMachine = async (
  nicId: string,
  vmImageVersionNumber: string,
  publisher: string,
  offer: string,
  sku: string,
  vmName: string,
  osDiskName: string,
  resourceGroupName: string
): Promise<void> => {
  const vmParameters: VirtualMachine = {
    location: location,
    osProfile: {
      computerName: vmName,
      adminUsername: adminUsername,
      adminPassword: adminPassword,
    },
    hardwareProfile: {
      vmSize: "Standard_B1ls",
    },
    storageProfile: {
      imageReference: {
        publisher: publisher,
        offer: offer,
        sku: sku,
        version: vmImageVersionNumber,
      },
      osDisk: {
        name: osDiskName,
        createOption: "FromImage",
        managedDisk: {
          storageAccountType: "Standard_LRS",
        },
      },
    },
    networkProfile: {
      networkInterfaces: [
        {
          id: nicId,
          primary: true,
        },
      ],
    },
  };
  console.log("6. Creating Virtual Machine : " + vmName);
  console.log(
    " VM create parameters: " + util.inspect(vmParameters, { depth: null })
  );
  await computeClient.virtualMachines.beginCreateOrUpdateAndWait(
    resourceGroupName,
    vmName,
    vmParameters
  );
};

function _generateRandomId(prefix: string): string {
  const timestamp = new Date().getTime().toString(36);
  const random = Math.random().toString(36).substr(2, 8);
  const id = `${prefix}${timestamp}${random}`;
  return id;
}

// All of the following code is unused for now, but it can be used to manage the VMs

// const manageResources = async () => {
//   await getVirtualMachines();
//   await turnOffVirtualMachines();
//   await startVirtualMachines();
//   await listVirtualMachines();
// };

// const getVirtualMachines = async () => {
//   console.log(`Get VM Info about ${vmName}`);
//   return await computeClient.virtualMachines.get(resourceGroupName, vmName);
// };

// const turnOffVirtualMachines = async () => {
//   console.log(`Poweroff the VM ${vmName}`);
//   return await computeClient.virtualMachines.beginPowerOff(
//     resourceGroupName,
//     vmName
//   );
// };

// const startVirtualMachines = async () => {
//   console.log(`Start the VM ${vmName}`);
//   return await computeClient.virtualMachines.beginStart(
//     resourceGroupName,
//     vmName
//   );
// };

// const listVirtualMachines = async () => {
//   console.log(`Lists VMs`);
//   const result = new Array();
//   for await (const item of computeClient.virtualMachines.listAll()) {
//     result.push(item);
//   }
//   console.log(result);
// };
