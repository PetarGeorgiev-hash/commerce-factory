"use client";

import { api } from "@/trpc/react";

export default function ActivityPage() {
  const { data, isLoading } = api.activity.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Activity Logs</h1>

      <div className="rounded border">
        <table className="w-full text-left">
          <thead className="bg-muted">
            <tr>
              <th className="p-3">Action</th>
              <th className="p-3">Message</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="p-3 font-medium">{log.action}</td>

                <td className="p-3 text-sm">{log.message}</td>

                <td className="p-3 text-sm text-muted-foreground">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}