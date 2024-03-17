import LaunchButton from "@/components/LaunchButton";

export default function LimitedUser({
  handleCreation,
  loading,
}: {
  handleCreation: (
    publisher: string | undefined,
    offer: string | undefined,
    sku: string | undefined
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
