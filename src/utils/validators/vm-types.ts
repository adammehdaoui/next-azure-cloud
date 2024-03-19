import { PublicIPAddress, Subnet } from "@azure/arm-network";

export type VM = {
  name: string;
  image: string;
  publisher: string;
  offer: string;
  sku: string;
};

export type VMInfo = {
  fqdn: string;
  resourceGroupName: string;
};

export type SubnetWrapper = Subnet | null;

export type PublicIPWrapper = PublicIPAddress | null;
