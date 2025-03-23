import dynamic from "next/dynamic";

const CheckNpmPackage = dynamic(() => import("@/features/check-npm-package"), {
  ssr: false,
});

const FeatureWrapper = dynamic(() => import("@/@core/pages/feature-wrapper"), {
  ssr: false,
});

export default function CheckNpmPackagePage() {
  return (
    <FeatureWrapper featureName="check-npm-package">
      <CheckNpmPackage />;
    </FeatureWrapper>
  );
}
