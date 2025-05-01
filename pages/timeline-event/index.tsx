import dynamic from "next/dynamic";

const TimelineEvent = dynamic(() => import("@/features/timeline-event"), {
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

export default function TimelineEventPage() {
  return (
    <FeatureWrapper featureName="8-timeline-event">
      <TimelineEvent />
    </FeatureWrapper>
  );
}
