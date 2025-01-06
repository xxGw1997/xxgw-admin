import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { httpRequest } from "~/lib/http";

export type PostInfo = {
  title: string;
  desc: string;
  categories: number[];
  content: string;
  isPublishNow: boolean;
  publishDate?: string;
};

export type PostInfoData = {
  id: string;
  title: string;
  desc: string;
  author: string;
  categories: number[];
  publishDate?: string;
  createdAt: Date;
};

export const GET_POST_KEY = "GET_POST_KEY";

export const useGetPost = (postId: string | undefined) =>
  useQuery<PostInfoData & { content: string }>({
    queryKey: [GET_POST_KEY, postId],
    queryFn: () => httpRequest.get(`/api/post/${postId}`),
    enabled: Boolean(postId),
  });

export const useCreatePost = () =>
  useMutation<PostInfoData, AxiosResponse<PostInfoData>, PostInfo>({
    mutationFn: (payload) => httpRequest.post("/api/post", payload),
  });

export const useUpdatePost = ({ onSuccess }: { onSuccess?: () => void }) =>
  useMutation<
    PostInfoData,
    AxiosResponse<PostInfoData>,
    { data: PostInfo; id: number }
  >({
    mutationFn: (payload) =>
      httpRequest.patch(`/api/post/${payload.id}`, payload.data),
    onSuccess: onSuccess ? onSuccess : () => {},
  });

export type PageType = {
  index: number;
  size: number;
};

export type SearchPostListParamsType = {
  title?: string;
  author?: string;
  categories?: string[];
  page: PageType;
};

export type AuthorType = {
  name: string;
  email: string;
};

export type PostListReturnDataType = Omit<PostInfoData, "author"> & {
  author: AuthorType;
};

export const useGetPostList = ({
  title,
  author,
  categories,
  page,
}: SearchPostListParamsType) => {
  const categoryKey =
    categories && categories.length > 0
      ? categories.sort((a, b) => Number(a) - Number(b)).join("-")
      : "";
  return useQuery<{
    page: { index: number; size: number; total: number };
    postList: PostListReturnDataType[];
  }>({
    queryKey: [
      "post-list",
      title ?? "",
      author ?? "",
      categoryKey,
      page.index,
      page.size,
    ],
    queryFn: () =>
      httpRequest.post(`/api/post/list`, {
        title,
        author,
        categories,
        page,
      }),
    placeholderData: keepPreviousData,
  });
};
