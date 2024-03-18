import LaunchButton from "@/components/LaunchButton";
import { vms } from "@/config/vms";

export default function PowerUser({
  handleCreation,
  loading,
}: {
  handleCreation: (
    publisher: string,
    offer: string,
    sku: string,
    windows: boolean
  ) => void;
  loading: boolean;
}) {
  return (
    <div className="flex space-x-5">
      {vms.map((os, index) => (
        <LaunchButton
          creation={handleCreation}
          name={os.name}
          image={os.image}
          key={`${os.name}-${index}`}
          loading={loading}
        />
      ))}
    </div>
  );
}
