import type { VM } from "@/utils/validators/vm-types";

export const vms: Readonly<VM[]> = [
  {
    name: "CentOS",
    image: "centOs.svg",
    publisher: "OpenLogic",
    offer: "CentOS",
    sku: "8_5-gen2",
  },
  {
    name: "Windows",
    image: "windows.svg",
    publisher: "MicrosoftWindowsServer",
    offer: "WindowsServer",
    sku: "2022-datacenter-core",
  },
  {
    name: "Ubuntu",
    image: "ubuntu.svg",
    publisher: "Canonical",
    offer: "UbuntuServer",
    sku: "14.04.3-LTS",
  },
];
