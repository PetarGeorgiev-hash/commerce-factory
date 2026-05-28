import { auth } from "@/server/auth";
import { put } from "@vercel/blob";
import { useSession } from "next-auth/react";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");
  if (!filename) return new Response("Missing filename", { status: 400 });

  const contentType = req.headers.get("content-type") ?? "";
  if (!ALLOWED_TYPES.includes(contentType))
    return new Response("Invalid file type", { status: 415 });

  const file = await req.blob();
  if (file.size > MAX_SIZE_BYTES)
    return new Response("File too large", { status: 413 });

  const blob = await put(filename, file, { access: "public", contentType });
  return Response.json(blob);
}
