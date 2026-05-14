export type PostItem = {
  id: string;
  imageUrl?: string | null;
  title: string;
  description?: string | null;
  images?: string[] | null;
  price?: number | null;
  createdAt: string | Date;
};
