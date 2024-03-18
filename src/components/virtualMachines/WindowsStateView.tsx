import LoginInfo from "@/components/virtualMachines/LoginInfo";

export default function WindowsStateView({ fqdn }: { fqdn: string | string[] }) {
  return (
    <>
      <h1 className="text-xl">
        Informations de connexion à la machine virtuelle
      </h1>
      <LoginInfo
        text={`Se connecter à la machine en RDP avec Microsoft Remote Desktop (à mettre dans PC Name) : ${fqdn}`}
        textToCopy={`${fqdn}`}
      />
      <LoginInfo
        text={`Nom d'utilisateur demandé à la connexion : notadmin`}
        textToCopy="notadmin"
      />
      <LoginInfo
        text={`Mot de passe demandé à la connexion : Pa$$w0rd92`}
        textToCopy="Pa$$w0rd92"
      />
    </>
  );
}
