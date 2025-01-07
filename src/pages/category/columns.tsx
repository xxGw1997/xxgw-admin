import { ColumnDef } from "@tanstack/react-table";

import { Category } from "~/api/category/types";
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header";
import { RowActions } from "./row-actions";

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "title",
    meta: {
      label: "标签名",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="标签名" />
    ),
  },
  {
    accessorKey: "img",
    meta: {
      label: "标签图标",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="标签图标" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions row={row} />,
  },
];
