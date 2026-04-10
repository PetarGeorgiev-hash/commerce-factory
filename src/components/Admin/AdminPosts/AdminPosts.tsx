"use client";

import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import NoPosts from "./NoPosts";

const PostTimeline = () => {
  const { data: posts, isLoading } = api.post.getAll.useQuery();

  if (isLoading)
    return <div className="py-8 text-center">Loading posts...</div>;
  if (!posts || posts?.length === 0)
    return (
      <NoPosts />
    );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Items for Sale</h2>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <div key={post.id} className="flex gap-4">
            {/* Timeline dot and line */}
            <div className="flex flex-col items-center">
              <div className="bg-primary h-4 w-4 rounded-full"></div>
              {index !== posts.length - 1 && (
                <div className="bg-border h-12 w-1"></div>
              )}
            </div>

            {/* Post card */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle>{post.title}</CardTitle>
                  {post.price && (
                    <Badge variant="secondary">${post.price.toFixed(2)}</Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {post.imageUrl && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
                {post.description && (
                  <p className="text-foreground text-sm">{post.description}</p>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostTimeline;
