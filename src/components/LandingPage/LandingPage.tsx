// import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

const categories = [
  {
    title: "Mens",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    href: "/mens",
  },
  {
    title: "Womens",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop",
    href: "/womens",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-300 text-slate-800 dark:bg-black dark:bg-slate-500 dark:text-white">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-slate-300 text-black backdrop-blur dark:bg-slate-500 dark:text-white">
        <div className="flex h-16 items-center justify-between px-6 lg:px-10">
          {/* Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link
              href="/"
              className="text-xl font-semibold tracking-[0.35em] uppercase"
            >
              Name of Brand
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative h-[92vh] overflow-hidden">
        {/* TODO add hero image */}
        {/* <Image
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1800&auto=format&fit=crop"
          alt="Hero"
          fill
          priority
          className="object-cover grayscale"
        /> */}

        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
          <p className="mb-5 text-[11px] tracking-[0.45em] uppercase opacity-80">
            New Collection
          </p>

          <h1 className="max-w-5xl text-4xl font-light tracking-[0.15em] uppercase md:text-6xl">
            Barkley L. Hendricks NBA Collection
          </h1>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href={ROUTES.DISCOVER}
              className="group flex h-14 min-w-[220px] items-center justify-center border border-white/40 bg-black/50 px-10 text-[12px] tracking-[0.35em] uppercase backdrop-blur-sm transition hover:bg-white hover:text-black"
            >
              Discover
            </Link>

            <Link
              href={ROUTES.SHOP}
              className="group flex h-14 min-w-[220px] items-center justify-center border border-white/40 bg-black/50 px-10 text-[12px] tracking-[0.35em] uppercase backdrop-blur-sm transition hover:bg-white hover:text-black"
            >
              Shop
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="grid grid-cols-1 gap-[1px] bg-black/10 md:grid-cols-2">
        {categories.map((item) => (
          // TODO add category images
          <Link
            key={item.title}
            href={item.href}
            className="group relative h-[780px] overflow-hidden bg-[#efefeb]"
          >
            {/* <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition duration-700 group-hover:scale-[1.03]"
            /> */}

            <div className="absolute inset-0 bg-black/5" />

            <div className="absolute bottom-10 left-10 text-white">
              <p className="mb-3 text-[11px] tracking-[0.35em] uppercase opacity-80">
                Essentials
              </p>

              <div className="flex items-center gap-3">
                <h2 className="text-4xl font-light tracking-[0.12em] uppercase">
                  {item.title}
                </h2>

                <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* COLLECTION STRIP */}
      <section className="border-t border-black/10 px-6 py-24 lg:px-12">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <p className="mb-3 text-[11px] tracking-[0.35em] text-black/50 uppercase">
              Latest Drop
            </p>

            <h2 className="text-4xl font-light tracking-[0.12em] uppercase">
              Minimal Luxury
            </h2>
          </div>

          <Link
            href={ROUTES.SHOP}
            className="text-[12px] tracking-[0.35em] uppercase underline-offset-4 hover:underline"
          >
            View All
          </Link>
        </div>

        {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
          ].map((image, index) => (
            <div
              key={index}
              className="group relative aspect-[4/5] overflow-hidden bg-[#ecece7]"
            >
              <Image
                src={image}
                alt="Collection"
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
              />

              <div className="absolute right-0 bottom-0 left-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                <div>
                  <p className="text-sm tracking-[0.25em] uppercase">
                    Essentials
                  </p>

                  <p className="mt-1 text-xs opacity-70">
                    Spring / Summer 2026
                  </p>
                </div>

                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          ))}
        </div> */}
      </section>

      {/* NEWSLETTER */}
      <section className="border-t border-black/10 px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-[11px] tracking-[0.4em] text-black/50 uppercase">
            Join The Conversation
          </p>

          <h3 className="text-4xl font-light tracking-[0.12em] uppercase">
            Subscribe For Exclusive Releases
          </h3>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <input
              type="email"
              placeholder="Email Address"
              className="h-14 flex-1 border border-black/15 bg-transparent px-5 text-sm outline-none placeholder:text-black/40 focus:border-black"
            />

            <button className="h-14 border border-black bg-black px-10 text-[12px] tracking-[0.35em] text-white uppercase transition hover:bg-transparent hover:text-black">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/10 px-6 py-10 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row">
          <p className="text-[11px] tracking-[0.3em] text-black/50 uppercase">
            © 2026 Fear Of God Inspired Concept
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              "Contact",
              "Client Services",
              "Legal Notices",
              "Privacy",
              "Social",
            ].map((item) => (
              //TODO add item links
              <Link
                key={item}
                href="#"
                className="text-[11px] tracking-[0.3em] text-black/70 uppercase transition hover:text-black"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
