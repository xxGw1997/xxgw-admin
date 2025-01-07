import { useGetCategories } from "~/api/category";
import { DataTable } from "~/components/data-table";
import { columns } from "./columns";

const Category = () => {
  const { data: categories, isFetching: categories_isLoading } =
    useGetCategories();

  return (
    <DataTable
      columns={columns}
      data={categories ?? []}
      total={categories?.length ?? 0}
      isLoading={categories_isLoading}
    />
  );
};

export default Category;
