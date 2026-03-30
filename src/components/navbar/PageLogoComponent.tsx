import React from "react";
import Link from 'next/link'

const PageLogoComponent = () => {
  return (
    <div className="flex items-center space-x-2">
      <Link href="/" className="text-xl font-bold">
      {/* TODO change name to be dynamic based on the project name */}
        Commerce Factory
      </Link>
    </div>
  );
};

export default PageLogoComponent;
