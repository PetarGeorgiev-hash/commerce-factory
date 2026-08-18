import Link from "next/link";
import { ChevronRight } from "lucide-react";

//TODO export categories to a constants file with image url and href when available
const categories = [
  { title: "Mens", eyebrow: "Essentials", href: "/shop", bg: "#e0ddd6" },
  { title: "Womens", eyebrow: "Essentials", href: "/shop", bg: "#d8d5ce" },
];

export default function FeatureGridSection() {
  return (
    <section className="grid grid-cols-1 gap-px bg-black/10 md:grid-cols-2">
      {categories.map((item) => (
        // TODO add category images
        <Link
          key={item.title}
          href={item.href}
          className="group relative aspect-[3/4] overflow-hidden md:aspect-[4/5]"
          style={{ backgroundColor: item.bg }}
        >
          {/* <Image src={item.image} alt={item.title} fill
              className="object-cover transition duration-700 group-hover:scale-[1.03]" /> */}

          <div className="absolute bottom-8 left-6 text-[#1a1a1a] sm:bottom-10 sm:left-10">
            <p className="mb-2 text-[10px] tracking-[0.35em] uppercase opacity-60 sm:mb-3 sm:text-[11px]">
              {item.eyebrow}
            </p>

            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-light tracking-[0.12em] uppercase sm:text-4xl">
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
