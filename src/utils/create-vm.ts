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

// Store function output to be used elsewhere
let randomIds: Record<string, string> = {};
let subnetInfo: Subnet | null = null;
let publicIPInfo: PublicIPAddress | null = null;
let vmImageInfo: any = null;
let nicInfo: any = null;

//Random number generator for service names and settings
let resourceGroupName = _generateRandomId("next-azure-groupname", randomIds);
let vmName = _generateRandomId("next-azure-vm", randomIds);
let storageAccountName = _generateRandomId("next-azure-storageacc", randomIds);
let vnetName = _generateRandomId("next-azure-vnet", randomIds);
let subnetName = _generateRandomId("next-azure-subnet", randomIds);
let publicIPName = _generateRandomId("next-azure-publicip", randomIds);
let networkInterfaceName = _generateRandomId("next-azure-nic", randomIds);
let ipConfigName = _generateRandomId("next-azure-ipconfig", randomIds);
let domainNameLabel = _generateRandomId("next-azure-domain", randomIds);
let osDiskName = _generateRandomId("next-azure-osdisk", randomIds);

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
  publisher: string,
  offer: string,
  sku: string
): Promise<VMInfo> {
  const VMState = await createResources(publisher, offer, sku);

  if (VMState === undefined) {
    launchCleanup(resourceGroupName);
    throw new Error(
      "Erreur dans la création de la machine virtuelle et de son groupe de ressource, veuillez réessayer."
    );
  } else {
    delayedCleanup(resourceGroupName);
  }

  //Regenerate randomIds
  resourceGroupName = _generateRandomId("diberry-testrg", randomIds);
  vmName = _generateRandomId("testvm", randomIds);
  storageAccountName = _generateRandomId("testac", randomIds);
  vnetName = _generateRandomId("testvnet", randomIds);
  subnetName = _generateRandomId("testsubnet", randomIds);
  publicIPName = _generateRandomId("testpip", randomIds);
  networkInterfaceName = _generateRandomId("testnic", randomIds);
  ipConfigName = _generateRandomId("testcrpip", randomIds);
  domainNameLabel = _generateRandomId("testdomainname", randomIds);
  osDiskName = _generateRandomId("testosdisk", randomIds);

  return VMState;
}

const createResources = async (
  publisher: string,
  offer: string,
  sku: string
): Promise<VMInfo> => {
  await createResourceGroup();
  await createStorageAccount();
  await createVnet();

  subnetInfo = await getSubnetInfo();
  publicIPInfo = await createPublicIP();

  nicInfo = await createNIC(subnetInfo, publicIPInfo);

  vmImageInfo = await findVMImage(publisher, offer, sku);

  await createVirtualMachine(
    nicInfo.id,
    vmImageInfo[0].name,
    publisher,
    offer,
    sku
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

const createResourceGroup = async (): Promise<void> => {
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

const createStorageAccount = async (): Promise<void> => {
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

const createVnet = async (): Promise<void> => {
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

const getSubnetInfo = async (): Promise<Subnet> => {
  console.log("\nGetting subnet info for : " + subnetName);
  return await networkClient.subnets.get(
    resourceGroupName,
    vnetName,
    subnetName
  );
};

const createPublicIP = async (): Promise<PublicIPAddress> => {
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

const createNIC = async (subnetInfo: Subnet, publicIPInfo: PublicIPAddress) => {
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
  sku: string
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

function _generateRandomId(
  prefix: string,
  existIds: { [key: string]: string }
): string {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const idLength = 8;

  const generateRandomString = (): string => {
    let result = "";
    for (let i = 0; i < idLength; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  let newId;
  while (true) {
    newId = prefix + generateRandomString();
    if (
      !existIds ||
      (!(newId in existIds) && newId.length >= 3 && newId.length <= 24)
    ) {
      break;
    }
  }

  return newId;
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
