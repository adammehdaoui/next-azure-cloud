export default function RulesComponent() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 w-full mt-16">
      <div className="flex flex-col bg-white p-8 rounded-xl shadow-md w-full md:w-1/2 space-y-5">
        <p className="text-xl font-semibold">Règles de l&rsquo;Application</p>
        <div className="py-4 border-b border-gray-300">
          <p className="text-red-700 font-extrabold">IMPORTANT !</p>
          <p className="mt-3">
            Ne pas couper le serveur avant que la suppression de la machine
            virtuelle et de son groupe de ressource au bout de 10 minutes ne
            soit terminée (Le nombre d&rsquo;adresses IP dans une région étant
            limité à 3). Il faut donc ne pas couper le serveur les 10 minutes
            suivant votre dernière action dans l&rsquo;application.
          </p>
        </div>
        <div className="py-4 border-b border-gray-300">
          <p className="text-gray-700">Client</p>
          <p className="mt-3">
            Les machines Windows ont été testées avec le client FreeRDP et
            Microsoft Remote Desktop.
          </p>
        </div>
        <div className="py-4 border-b border-gray-300">
          <p className="text-gray-700">Environnement de test</p>
          <p className="mt-3">
            Le projet a été testé dans un environnement MacOS Sonoma et Node 21.
          </p>
        </div>
        <div className="py-4">
          <p className="text-gray-700">Lancement</p>
          <p className="mt-3">
            Le lancement d&rsquo;une machine virtuelle peut prendre un certain
            temps en fonction de la configuration choisie.
          </p>
        </div>
      </div>
    </div>
  );
}
