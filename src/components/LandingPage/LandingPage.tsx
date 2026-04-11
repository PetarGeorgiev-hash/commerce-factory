// src/components/LandingPage/LandingPage.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_45%)]" />
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <p className="mb-6 text-sm tracking-[0.4em] text-slate-400 uppercase">
              New season drop
            </p>
            <h1 className="text-[clamp(3rem,8vw,6.5rem)] leading-[0.9] font-black">
              Essentials for modern living
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              A restrained, premium collection of apparel and accessories for
              everyday use.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild className="bg-white text-black">
                <Link href={ROUTES.SHOP}>Shop the drop</Link>
              </Button>
              <Button variant="outline" className="border-white/40 text-white">
                <Link href={ROUTES.ABOUT}>Learn more</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-20">
        <div className="container mx-auto grid gap-8 md:grid-cols-3">
          {["Men", "Women", "Accessories"].map((title) => (
            <article
              key={title}
              className="rounded-xl border border-white/10 bg-white/5 p-8"
            >
              <h2 className="text-2xl font-semibold">{title}</h2>
              <p className="mt-4 text-sm text-slate-300">
                Elevated essentials, reimagined for everyday wear.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <p className="text-sm tracking-[0.3em] text-slate-400 uppercase">
              New arrival
            </p>
            <h2 className="text-4xl font-bold">The latest drop</h2>
            <p className="max-w-xl text-slate-300">
              Clean silhouettes, premium fabrics, and a muted palette for
              effortless layering.
            </p>
          </div>
          <div className="rounded-3xl bg-white/5 p-8">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-slate-900" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
