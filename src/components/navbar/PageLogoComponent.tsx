import React from "react";
import Link from "next/link";

const PageLogoComponent = () => {
  return (
    <Link
      href="/"
      className="absolute left-1/2 -translate-x-1/2 text-center text-sm font-semibold tracking-[0.3em] uppercase sm:text-base sm:tracking-[0.4em]"
    >
      {/* TODO change name to be dynamic based on the project name */}
      SeventySaints
    </Link>
  );
};

export default PageLogoComponent;
