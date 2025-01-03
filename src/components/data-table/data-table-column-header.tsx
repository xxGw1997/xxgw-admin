import { Column } from "@tanstack/react-table";
import { HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  // TODO ADD SORT FEATURE ...
  return <div className={cn(className)}>{title}</div>;
}
