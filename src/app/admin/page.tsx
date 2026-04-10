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

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");

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
    if (!session || session.user.role !== "ADMIN") {
      router.push(ROUTES.HOME);
    }
  }, [session, status, router]);

  if (status === "loading") return <div>Loading...</div>;
  if (!session || session.user.role !== "ADMIN") return null; // Prevent render

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPost.mutate({
      title,
      description: description || undefined,
      price: price ? parseFloat(price) : undefined,
    });
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
