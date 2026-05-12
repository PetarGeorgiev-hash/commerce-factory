export type PostItem = {
  title: string;
  description?: string | null;
  images?: string[] | null;
  price?: number | null;
  createdAt: string | Date;
};
