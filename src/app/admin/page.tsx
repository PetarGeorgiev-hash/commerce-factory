"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ROUTES } from "@/lib/constants/routes";
import Image from "next/image";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      alert("Post created successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
    },
  });

  useEffect(() => {
    if (status === "loading") return;
    //TODO add this when we have roles implemented
    // if (!session || session.user.role !== "ADMIN") {
    //   router.push(ROUTES.HOME);
    // }
  }, [session, status, router]);

  if (status === "loading") return <div>Loading...</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // createPost.mutate({
    //   title,
    //   description: description || undefined,
    //   price: price ? parseFloat(price) : undefined,
    //   image: image ? URL.createObjectURL(image) : undefined,
    // });
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Items for Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              />
              {image && (
                <div className="mt-4">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="max-w-xs rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="price">Price (optional)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={createPost.isPending}>
              {createPost.isPending ? "Creating..." : "Add Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
