import { PageContainer } from "@/components/layout/page-container";
import { Hero } from "@/components/marketing/hero";
import { StoryStrip } from "@/components/marketing/story-strip";
import { VisitPanel } from "@/components/marketing/visit-panel";
import { SignatureRail, TodaysBoard } from "@/features/menu";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PageContainer className="space-y-24 py-20">
        <SignatureRail />
        <TodaysBoard />
        <StoryStrip />
        <VisitPanel />
      </PageContainer>
    </>
  );
}
