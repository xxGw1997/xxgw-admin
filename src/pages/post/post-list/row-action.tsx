import { useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  GET_POST_KEY,
  GET_POST_LIST_KEY,
  PostListReturnDataType,
  useDeletePost,
} from "~/api/post";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useConfirm } from "~/hooks/use-confirm";

interface RowActionsProps {
  row: Row<PostListReturnDataType>;
}

export function RowActions({ row }: RowActionsProps) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const { mutate: deletePost } = useDeletePost({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_POST_LIST_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [[GET_POST_KEY, postId]],
      });
      toast.success("删除成功~");
    },
  });

  const [ConfirmDialog, confirm] = useConfirm(
    "确定吗?",
    "删除后将无法恢复，是否确认要删除该文章？"
  );

  const navigate = useNavigate();

  const postId = Number(row.original.id);
  const handleEdit = () => {
    setOpen(false);
    navigate(`/write/${postId}`);
  };

  const handleDelete = async () => {
    setOpen(false);
    const ok = await confirm();
    if (!ok) return;
    deletePost({ id: postId });
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <ConfirmDialog />
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            onClick={() => setOpen(true)}
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onSelect={handleEdit}>修改</DropdownMenuItem>
          <DropdownMenuItem onSelect={handleDelete}>删除</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
