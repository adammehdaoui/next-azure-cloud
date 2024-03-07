import { ComputeManagementClient } from "@azure/arm-compute";
import { NetworkManagementClient } from "@azure/arm-network";
import { ResourceManagementClient } from "@azure/arm-resources";
import { StorageManagementClient } from "@azure/arm-storage";
import {
  ClientSecretCredential,
  DefaultAzureCredential,
} from "@azure/identity";
import * as util from "util";

// Store function output to be used elsewhere
let randomIds: Record<string, string> = {};
let subnetInfo: any = null;
let publicIPInfo: any = null;
let vmImageInfo: any = null;
let nicInfo: any = null;

// CHANGE THIS - used as prefix for naming resources
const yourAlias: string = "diberry";

// CHANGE THIS - used to add tags to resources
const projectName: string = "azure-samples-create-vm";

// Resource configs
const location: string = "eastus";
const accType: string = "Standard_LRS";

// Ubuntu config for VM
const publisher: string = "Canonical";
const offer: string = "UbuntuServer";
const sku: string = "14.04.3-LTS";
const adminUsername: string = "notadmin";
const adminPassword: string = "Pa$$w0rd92";

// Azure authentication in environment variables for DefaultAzureCredential
const tenantId: string =
  process.env.AZURE_TENANT_ID || "REPLACE-WITH-YOUR-TENANT-ID";
const clientId: string =
  process.env.AZURE_CLIENT_ID || "REPLACE-WITH-YOUR-CLIENT-ID";
const secret: string =
  process.env.AZURE_CLIENT_SECRET || "REPLACE-WITH-YOUR-CLIENT-SECRET";
const subscriptionId: string =
  process.env.AZURE_SUBSCRIPTION_ID || "REPLACE-WITH-YOUR-SUBSCRIPTION_ID";

let credentials: any = null;

if (process.env.production) {
  // production
  credentials = new DefaultAzureCredential();
} else {
  // development
  credentials = new ClientSecretCredential(tenantId, clientId, secret);
  console.log("development");
}
// Azure services
const resourceClient = new ResourceManagementClient(
  credentials,
  subscriptionId
);
const computeClient = new ComputeManagementClient(credentials, subscriptionId);
const storageClient = new StorageManagementClient(credentials, subscriptionId);
const networkClient = new NetworkManagementClient(credentials, subscriptionId);

// Create resources then manage them (on/off)
async function createResources() {
  try {
    const result = await createResourceGroup();
    const accountInfo = await createStorageAccount();
    const vnetInfo = await createVnet();
    subnetInfo = await getSubnetInfo();
    publicIPInfo = await createPublicIP();
    nicInfo = await createNIC(subnetInfo, publicIPInfo);
    vmImageInfo = await findVMImage();
    const nicResult = await getNICInfo();
    const vmInfo = await createVirtualMachine(nicInfo.id, vmImageInfo[0].name);
    return;
  } catch (err) {
    console.log(err);
  }
}

async function createResourceGroup() {
  console.log("\n1.Creating resource group: " + resourceGroupName);
  const groupParameters = {
    location: location,
    tags: { project: projectName },
  };
  const resCreate = await resourceClient.resourceGroups.createOrUpdate(
    resourceGroupName,
    groupParameters
  );
  return resCreate;
}

async function createStorageAccount() {
  console.log("\n2.Creating storage account: " + storageAccountName);
  const createParameters = {
    location: location,
    sku: {
      name: accType,
    },
    kind: "Storage",
    tags: {
      project: projectName,
    },
  };
  return await storageClient.storageAccounts.beginCreateAndWait(
    resourceGroupName,
    storageAccountName,
    createParameters
  );
}

async function createVnet() {
  console.log("\n3.Creating vnet: " + vnetName);
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
  return await networkClient.virtualNetworks.beginCreateOrUpdateAndWait(
    resourceGroupName,
    vnetName,
    vnetParameters
  );
}

async function getSubnetInfo() {
  console.log("\nGetting subnet info for: " + subnetName);
  const getResult = await networkClient.subnets.get(
    resourceGroupName,
    vnetName,
    subnetName
  );
  return getResult;
}

async function createPublicIP() {
  console.log("\n4.Creating public IP: " + publicIPName);
  const publicIPParameters = {
    location: location,
    publicIPAllocationMethod: "Dynamic",
    dnsSettings: {
      domainNameLabel: domainNameLabel,
    },
  };
  return await networkClient.publicIPAddresses.beginCreateOrUpdateAndWait(
    resourceGroupName,
    publicIPName,
    publicIPParameters
  );
}

async function createNIC(subnetInfo: any, publicIPInfo: any) {
  console.log("\n5.Creating Network Interface: " + networkInterfaceName);
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
  return await networkClient.networkInterfaces.beginCreateOrUpdateAndWait(
    resourceGroupName,
    networkInterfaceName,
    nicParameters
  );
}

async function findVMImage() {
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
  const listResult: any[] = [];
  for await (const item of computeClient.virtualMachineImages.list(
    location,
    publisher,
    offer,
    sku
  )) {
    listResult.push(item);
  }
  return listResult;
}

async function getNICInfo() {
  return await networkClient.networkInterfaces.get(
    resourceGroupName,
    networkInterfaceName
  );
}

async function createVirtualMachine(nicId: string, imageName: string) {
  const vmParameters = {
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
        caching: "None",
        createOption: "fromImage",
        vhd: {
          uri:
            "https://" +
            storageAccountName +
            ".blob.core.windows.net/nodejscontainer/osnodejslinux.vhd",
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
  console.log("6.Creating Virtual Machine: " + vmName);
  console.log(
    " VM create parameters: " + util.inspect(vmParameters, { depth: null })
  );
  const resCreate =
    await computeClient.virtualMachines.beginCreateOrUpdateAndWait(
      resourceGroupName,
      vmName,
      vmParameters
    );
  return await computeClient.virtualMachines.get(resourceGroupName, vmName);
}

const _generateRandomId = (
  prefix: string,
  existIds: Record<string, string> | null
): string => {
  let newNumber: string;
  while (true) {
    newNumber = prefix + Math.floor(Math.random() * 10000).toString();
    if (!existIds || !(newNumber in existIds)) {
      break;
    }
  }
  return newNumber;
};

//Random number generator for service names and settings
const resourceGroupName = _generateRandomId(`${yourAlias}-testrg`, randomIds);
const vmName = _generateRandomId(`${yourAlias}vm`, randomIds);
const storageAccountName = _generateRandomId(`${yourAlias}ac`, randomIds);
const vnetName = _generateRandomId(`${yourAlias}vnet`, randomIds);
const subnetName = _generateRandomId(`${yourAlias}subnet`, randomIds);
const publicIPName = _generateRandomId(`${yourAlias}pip`, randomIds);
const networkInterfaceName = _generateRandomId(`${yourAlias}nic`, randomIds);
const ipConfigName = _generateRandomId(`${yourAlias}crpip`, randomIds);
const domainNameLabel = _generateRandomId(`${yourAlias}domainname`, randomIds);
const osDiskName = _generateRandomId(`${yourAlias}osdisk`, randomIds);

async function main() {
  await createResources();
}

main()
  .then(() => {
    console.log(
      `success - resource group name: ${resourceGroupName}, vm resource name: ${vmName}`
    );
  })
  .catch((err) => {
    console.log(err);
  });
