import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function uploadToBlob(file: File, folder = "products") {
  const ext = file.name.split(".").pop()?.toLowerCase();
  const uniqueName = `${folder}/${crypto.randomUUID()}.${ext}`;

  const res = await fetch(
    `/api/blob-upload?filename=${encodeURIComponent(uniqueName)}`,
    {
      method: "POST",
      body: file,
    },
  );

  if (!res.ok) throw new Error("Upload failed");
  return res.json() as Promise<{ url: string }>;
}
