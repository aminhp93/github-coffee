import dynamic from "next/dynamic";

const Evaluation = dynamic(() => import("@/features/evaluation"), {
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

export default function EvaluationPage() {
  return (
    <FeatureWrapper featureName="evaluation">
      <Evaluation />;
    </FeatureWrapper>
  );
}
