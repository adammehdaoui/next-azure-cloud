"use client";

import { usePathname } from "next/navigation";

export default function VM() {
  const fqdn = usePathname().split("/")[2];

  console.log(fqdn);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col bg-white p-8 rounded shadow-md w-full md:w-2/3">
        <h1>Informations de connexion à la machine virtuelle</h1>
        <span>Nom de domaine pour la connexion : {fqdn}</span>
        <span>Login : notadmin</span>
        <span>Password : Pa$$w0rd92</span>
        <pre>Pour se connecter en SSH : ssh notadmin@{fqdn}</pre>
      </div>
    </div>
  );
}
