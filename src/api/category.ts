import { useQuery } from "@tanstack/react-query";
import { httpRequest } from "~/lib/http";

export type Category = {
  id: number;
  title: string;
};

export const CATEGORY_LIST_KEY = "CATEGORY_LIST_KEY";

export const useGetCategories = () =>
  useQuery<Category[]>({
    queryKey: [CATEGORY_LIST_KEY],
    queryFn: () => httpRequest.get("/api/category"),
  });
