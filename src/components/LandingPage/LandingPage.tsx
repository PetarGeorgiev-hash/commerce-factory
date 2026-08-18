import HeroSection from "./HeroSection";
import FeatureGridSection from "./FeatureGridSection";
import CollectionSection from "./CollectionSection";
import SubscriptionSection from "./SubscriptionSection";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-[#1a1a1a]">
      <HeroSection />
      <FeatureGridSection />
      <CollectionSection />
      <SubscriptionSection />
    </main>
  );
}
