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

export const useCreatePost = () =>
  useMutation<PostInfo, AxiosResponse<PostInfo>, PostInfo>({
    mutationFn: (payload: PostInfo) => httpRequest.post("/api/post", payload),
  });

export const GET_POST_KEY = "GET_POST_KEY";

export const useGetPost = (postId: string | undefined) =>
  useQuery<PostInfo>({
    queryKey: [GET_POST_KEY, postId],
    queryFn: () => httpRequest.get(`/api/post/${postId}`),
    enabled: Boolean(postId),
  });
