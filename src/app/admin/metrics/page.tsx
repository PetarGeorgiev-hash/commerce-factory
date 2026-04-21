"use client";

import { api } from "@/trpc/react";

export default function MetricsPage() {
  const { data } = api.post.getAll.useQuery();

  return (
    <div>
      <h1 className="text-xl font-bold">Metrics</h1>
      <p>Total products: {data?.length ?? 0}</p>
    </div>
  );
}