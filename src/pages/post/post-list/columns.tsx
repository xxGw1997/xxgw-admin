import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { AuthorType, PostListReturnDataType } from "~/api/post";
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header";
import { Badge } from "~/components/ui/badge";
import { generateRGBFromString } from "~/lib/utils";

export const columns: ColumnDef<PostListReturnDataType>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="标题" />
    ),
  },
  {
    accessorKey: "desc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="描述" />
    ),
  },
  {
    accessorKey: "author",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="作者" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[80px]">
          {row.getValue<AuthorType>("author").name}
        </div>
      );
    },
  },
  {
    accessorKey: "categories",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="分类" />
    ),
    cell: ({ row }) => {
      const categories = row.getValue<string[]>("categories");
      return (
        <div className="flex gap-x-1">
          {categories.map((category) => {
            const color = generateRGBFromString(category);
            return (
              <Badge
                style={{
                  backgroundColor: color.bg,
                  color: color.color,
                }}
              >
                {category}
              </Badge>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "publishDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="发布时间" />
    ),
    cell: ({ row }) => (
      <div>
        {format(parseISO(row.getValue("publishDate")), "yyyy-MM-dd HH:mm:ss")}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="创建时间" />
    ),
    cell: ({ row }) => (
      <div>
        {format(parseISO(row.getValue("createdAt")), "yyyy-MM-dd HH:mm:ss")}
      </div>
    ),
  },
];
