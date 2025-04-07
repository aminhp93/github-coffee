import dynamic from "next/dynamic";

const TableTask = dynamic(() => import("@/features/table-task"), {
  ssr: false,
});

const FeatureWrapper = dynamic(
  async () => {
    const mod = await import("@/@core/pages/feature-wrapper");
    return {
      default: mod.FeatureWrapper,
    };
  },
  {
    ssr: false,
  }
);

export default function TableTaskPage() {
  return (
    <FeatureWrapper featureName="2-table-task">
      <TableTask />;
    </FeatureWrapper>
  );
}
