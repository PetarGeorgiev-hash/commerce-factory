import LandingPage from "@/components/LandingPage/LandingPage";
import SocialMediaFooter from "@/components/LandingPage/SocialMediaFooter";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <LandingPage />
      <SocialMediaFooter />
    </HydrateClient>
  );
}
