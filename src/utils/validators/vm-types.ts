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
