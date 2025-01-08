import { useState } from "react";
import { toast } from "sonner";
import {
  CATEGORY_LIST_KEY,
  useAddCategory,
  useDeleteCategory,
  useGetCategories,
} from "~/api/category";
import { DataTable } from "~/components/data-table";
import { columns } from "./columns";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Category } from "~/api/category/types";
import { useQueryClient } from "@tanstack/react-query";

const CategoryPage = () => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [categoryInfo, setCategoryInfo] = useState<Omit<Category, "id">>({
    img: "",
    title: "",
  });

  const { data: categories, isFetching: categories_isLoading } =
    useGetCategories();

  const { mutate: addCategory } = useAddCategory({
    onSuccess: () => {
      setOpen(false);
      setCategoryInfo({
        img: "",
        title: "",
      });
      toast.success("创建分类成功~");
      queryClient.invalidateQueries({ queryKey: [CATEGORY_LIST_KEY] });
    },
  });

  
  const handleAddCategory = async () => {
    if (!categoryInfo.title) {
      toast.warning("请输入分类名称", { position: "top-center" });
      return;
    }
    addCategory({
      img: "",
      title: categoryInfo.title,
    });
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mb-10">新增分类</Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px]"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>新增分类</DialogTitle>
            <DialogDescription>分类名称不允许重复</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                名称
              </Label>
              <Input
                id="name"
                value={categoryInfo.title}
                onChange={(e) =>
                  setCategoryInfo({ ...categoryInfo, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                图标
              </Label>
              <Input
                id="username"
                value="目前暂不支持添加图标"
                className="col-span-3"
                disabled
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddCategory}>新增</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DataTable
        columns={columns}
        data={categories ?? []}
        total={categories?.length ?? 0}
        manualPagination={false}
        isLoading={categories_isLoading}
        showToolBar={false}
      />
    </div>
  );
};

export default CategoryPage;
