import LaunchButton from "@/components/LaunchButton";

export default function AdminView({
  role,
  creation,
}: {
  role: string;
  creation: () => void;
}) {
  const os = [
    {
      name: "RedHat",
      image: "redHat.svg",
    },
    {
      name: "Windows",
      image: "windows.svg",
    },
    {
      name: "Ubuntu",
      image: "ubuntu.svg",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full md:w-2/3 lg:w-1/2 xl:w-1/3">
        <div className="flex justify-center text-xl w-full">
          Bienvenue, vous êtes connecté en tant que : {role}
        </div>
        <div className="flex justify-evenly mt-10 w-full">
          <>
            {role === "contributor" && (
              <LaunchButton
                creation={creation}
                name="Ubuntu"
                image="ubuntu.svg"
              />
            )}
          </>
          <>
            {role === "admin" && (
              <div className="flex space-x-5">
                {os.map((os, index) => (
                  <LaunchButton
                    creation={creation}
                    name={os.name}
                    image={os.image}
                    key={`${os.name}-${index}`}
                  />
                ))}
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
