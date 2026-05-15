import Link from "next/link";
import { ChevronRight } from "lucide-react";

//TODO export categories to a constants file with image url and href when available=
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

export default function FeatureGridSection() {
  return (
    <section className="grid grid-cols-1 gap-px bg-black/10 md:grid-cols-2">
      {categories.map((item) => (
        // TODO add category images
        <Link
          key={item.title}
          href={item.href}
          className="group relative h-195 overflow-hidden bg-[#efefeb]"
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
  );
}
