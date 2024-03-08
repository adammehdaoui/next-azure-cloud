import DeconnectionButton from "@/components/DeconnectionButton";
import LaunchButton from "@/components/LaunchButton";

export default function AdminView({
  role,
  creation,
}: {
  role: string;
  creation: () => void;
}) {
  
return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full md:w-2/3 lg:w-1/2 xl:w-1/3">
        <div>Salut, t&apos;es admin bravo (role : {role})</div>
        <div>
          {role === "admin" && <LaunchButton creation={creation} />}
          <DeconnectionButton />
        </div>
      </div>
    </div>
  );
}
