import { Row } from "@tanstack/react-table";
import { Category } from "~/api/category/types";

interface RowActionsProps {
  row: Row<Category>;
}

export function RowActions({ row }: RowActionsProps) {
  return <div>RowActions</div>;
}
