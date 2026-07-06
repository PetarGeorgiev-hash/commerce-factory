import { del } from "@vercel/blob";
import { auth } from "@/server/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const { urls } = (await req.json()) as { urls: string[] };
  if (!urls?.length) return new Response("No URLs", { status: 400 });

  await del(urls);
  return new Response(null, { status: 204 });
}
