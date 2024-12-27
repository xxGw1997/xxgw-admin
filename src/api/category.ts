import { instance } from "~/lib/request-handler";
import { requestHandler } from "~/lib/request-handler";

export type Category = {
  id: number;
  title: string;
};

export const getCategories = requestHandler<unknown, Category[]>(() =>
  instance.get("/api/category")
);
