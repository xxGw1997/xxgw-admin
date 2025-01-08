import { useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { toast } from "sonner";
import { CATEGORY_LIST_KEY, useDeleteCategory } from "~/api/category";
import { Category } from "~/api/category/types";
import { Button } from "~/components/ui/button";
import { useConfirm } from "~/hooks/use-confirm";

interface RowActionsProps {
  row: Row<Category>;
}

export function RowActions({ row }: RowActionsProps) {
  const queryClient = useQueryClient();

  const [ConfirmDialog, configm] = useConfirm(
    "确认是否要删除?",
    "如果该标签正在被其他文章所使用，删除操作将无法成功，请先检查该标签没有被其他文章所使用~"
  );

  const handleDelete = async () => {
    const ok = await configm();
    if (!ok) return;
    deleteCategory({ id: row.original.id });
  };

  const { mutate: deleteCategory } = useDeleteCategory({
    onSuccess: (res) => {
      if (res.countInUse <= 0) {
        toast.success("删除成功");
        queryClient.invalidateQueries({
          queryKey: [CATEGORY_LIST_KEY],
        });
      } else {
        toast.warning(
          `删除失败，当前标签正在被${res.countInUse}篇文章使用，请检查正在使用该标签的文章~`,
          { position: "top-center" }
        );
      }
    },
  });

  return (
    <>
      <ConfirmDialog />
      <Button variant="destructive" size="sm" onClick={handleDelete}>
        删除
      </Button>
    </>
  );
}
