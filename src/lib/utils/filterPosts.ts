import type { PostItem } from "../types/PostItem";

export function filterPosts(
  posts: PostItem[],
  search: string,
  priceFilter: string,
): PostItem[] {
  return posts.filter((post) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      post.title.toLowerCase().includes(query) ??
      post.description?.toLowerCase().includes(query) ??
      post.images?.some((image) => image.toLowerCase().includes(query)) ??
      false;

    const price = typeof post.price === "number" ? post.price : 0;
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "under50" && price < 50) ||
      (priceFilter === "50-100" && price >= 50 && price <= 100) ||
      (priceFilter === "over100" && price > 100);

    return matchesSearch && matchesPrice;
  });
}

export function sortPosts(posts: PostItem[], sortOption: string): PostItem[] {
  return [...posts].sort((a, b) => {
    if (sortOption === "priceAsc") {
      return (a.price ?? 0) - (b.price ?? 0);
    }
    if (sortOption === "priceDesc") {
      return (b.price ?? 0) - (a.price ?? 0);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
