import { useMutation, useQuery } from "@tanstack/react-query";
import { httpRequest } from "~/lib/http";
import { Category, DeleteCategoryReturnType } from "./types";
import { AxiosResponse } from "axios";

export const CATEGORY_LIST_KEY = "CATEGORY_LIST_KEY";

export const useGetCategories = () =>
  useQuery<Category[]>({
    queryKey: [CATEGORY_LIST_KEY],
    queryFn: () => httpRequest.get("/api/category"),
  });

export const useAddCategory = ({ onSuccess }: { onSuccess?: () => void }) =>
  useMutation<Category, AxiosResponse<Category>, Omit<Category, "id">>({
    mutationFn: (payload) => httpRequest.post("/api/category", payload),
    onSuccess: onSuccess ? onSuccess : undefined,
  });

export const useDeleteCategory = ({
  onSuccess,
}: {
  onSuccess?: (res: DeleteCategoryReturnType) => void;
}) =>
  useMutation<
    DeleteCategoryReturnType,
    AxiosResponse<DeleteCategoryReturnType>,
    Pick<Category, "id">
  >({
    mutationFn: (payload) => httpRequest.delete(`/api/category/${payload.id}`),
    onSuccess: onSuccess ? onSuccess : undefined,
  });
