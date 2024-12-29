import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { httpRequest } from "~/lib/http";

export type PostInfo = {
  title: string;
  desc: string;
  category: string[];
  content: string;
  isPublishNow: boolean;
  date?: Date;
};

export const useCreatePost = () =>
  useMutation<PostInfo, AxiosResponse<PostInfo>, PostInfo>({
    mutationFn: (payload: PostInfo) => httpRequest.post("/api/post", payload),
  });
