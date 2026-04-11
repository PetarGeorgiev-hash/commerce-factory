import LandingPage from "@/components/LandingPage/LandingPage";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <LandingPage />
    </HydrateClient>
  );
}
