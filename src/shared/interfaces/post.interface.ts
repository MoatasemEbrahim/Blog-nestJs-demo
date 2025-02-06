import { Post as _Post, Prisma } from "@prisma/client";

export type Post = _Post;

export interface PostCreateInput
  extends Omit<Prisma.PostCreateInput, "author"> {
  authorId: number;
}

export type PostUpdateInput = Partial<PostCreateInput>;
