import { useMutation, useQuery } from "@tanstack/react-query";
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
  author?: number;
  categories?: number[];
  page: PageType;
};

export const useGetPostList = ({
  title,
  author,
  categories,
  page,
}: SearchPostListParamsType) => {
  const pageKey =
    categories && categories.length > 0
      ? categories.sort((a, b) => a - b).join("-")
      : "";
  return useQuery<PostInfoData[]>({
    queryKey: ["post-list", title ?? "", author ?? "", pageKey],
    queryFn: () =>
      httpRequest.post(`/api/post/list`, {
        title,
        author,
        categories,
        page,
      }),
  });
};
