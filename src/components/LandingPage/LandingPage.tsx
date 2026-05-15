import LogoHeader from "./LogoHeader";
import HeroSection from "./HeroSection";
import FeatureGridSection from "./FeatureGridSection";
import CollectionSection from "./CollectionSection";
import SubscriptionSection from "./SubscriptionSection";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-300 text-slate-800 dark:bg-slate-800 dark:text-white">
      <LogoHeader />
      <HeroSection />
      <FeatureGridSection />
      <CollectionSection />
      <SubscriptionSection />
    </main>
  );
}
