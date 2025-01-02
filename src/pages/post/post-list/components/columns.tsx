import { ColumnDef } from "@tanstack/react-table";
import { PostInfoData } from "~/api/post";

export const columns: ColumnDef<PostInfoData>[] = [
  {
    accessorKey: "title",
    header: "标题",
  },
  {
    accessorKey: "desc",
    header: "描述",
  },
  {
    accessorKey: "author",
    header: "作者",
  },
  {
    accessorKey: "categories",
    header: "分类",
  },
  {
    accessorKey: "publishDate",
    header: "发布时间",
  },
  {
    accessorKey: "createdAt",
    header: "创建时间",
  },
];
