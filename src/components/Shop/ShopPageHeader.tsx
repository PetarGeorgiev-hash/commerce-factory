import React from "react";

function ShopPageHeader() {
  return (
    <div className="border-border bg-card space-y-3 rounded-3xl border p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase">
            Shop
          </p>
          <h1 className="text-3xl font-semibold">All available posts</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl text-sm">
          Browse posts from sellers and use the sidebar filters to narrow the
          results.
        </p>
      </div>
    </div>
  );
}

export default ShopPageHeader;
