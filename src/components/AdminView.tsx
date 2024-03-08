import DeconnectionButton from "@/components/DeconnectionButton";
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
      name: "Ubuntu",
      image: "ubuntu.svg",
    },
    {
      name: "Windows",
      image: "windows.svg",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full md:w-2/3 lg:w-1/2 xl:w-1/3">
        <div>Salut, t&apos;es admin bravo (role : {role})</div>
        <div className="mt-4 w-full">
          {/* {role === "admin" && <LaunchButton creation={creation} />} */}
          {role === "admin" && (
            <div className="flex justify-evenly">
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
        </div>
        <div className="flex justify-center w-full mt-10">
          <DeconnectionButton />
        </div>
      </div>
    </div>
  );
}
