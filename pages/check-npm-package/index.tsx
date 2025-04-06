import dynamic from "next/dynamic";

const CheckNpmPackage = dynamic(() => import("@/features/check-npm-package"), {
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

export default function CheckNpmPackagePage() {
  return (
    <FeatureWrapper featureName="check-npm-package">
      <CheckNpmPackage />;
    </FeatureWrapper>
  );
}
