import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { AuthorType, PostListReturnDataType } from "~/api/post";
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { generateRGBFromString } from "~/lib/utils";

export const columns: ColumnDef<PostListReturnDataType>[] = [
  {
    accessorKey: "title",
    meta: {
      lable: "标题",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="标题" />
    ),
  },
  {
    accessorKey: "desc",
    meta: {
      lable: "描述",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="描述" />
    ),
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="max-w-[250px] truncate cursor-help">
              {row.getValue("desc")}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.getValue("desc")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "author",
    meta: {
      lable: "作者",
    },
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
    meta: {
      lable: "分类",
    },
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
                key={category}
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
    meta: {
      lable: "发布时间",
    },
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
    meta: {
      lable: "创建时间",
    },
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
