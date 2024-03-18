import LaunchButton from "@/components/LaunchButton";

export default function LimitedUser({
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
    <LaunchButton
      creation={handleCreation}
      name="Ubuntu"
      image="ubuntu.svg"
      loading={loading}
    />
  );
}
