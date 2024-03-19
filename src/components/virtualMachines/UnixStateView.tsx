import LoginInfo from "@/components/virtualMachines/LoginInfo";

export default function UnixStateView({fqdn}: {fqdn: string | string[]}) {
  return (
    <>
      <h1 className="text-xl font-semibold">
        Informations de connexion à la machine virtuelle
      </h1>
      <LoginInfo
        text={`Se connecter à la machine en SSH avec la commande : ssh notadmin@${fqdn}`}
        textToCopy={`ssh notadmin@${fqdn}`}
      />
      <LoginInfo
        text={`Mot de passe pour se connecter : Pa$$w0rd92`}
        textToCopy="Pa$$w0rd92"
      />
    </>
  );
}
