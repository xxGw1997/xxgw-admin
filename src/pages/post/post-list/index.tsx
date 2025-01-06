import { useGetPostList } from "~/api/post";
import { DataTable } from "~/components/data-table";

import { columns } from "./columns";
import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { MultiSelect } from "~/components/ui/muti-select";
import { useGetCategories } from "~/api/category";

type SearchFilterParamsType = {
  title: string;
  author: string;
  categories: string[];
};

const PostList = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [queryFilterParams, setQueryFilterParams] =
    useState<SearchFilterParamsType>({
      title: "",
      author: "",
      categories: [],
    });

  const [searchFilterParams, setSearchFilterParams] =
    useState<SearchFilterParamsType>({
      title: "",
      author: "",
      categories: [],
    });

  const handleSearch = () => {
    setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
    setQueryFilterParams({ ...searchFilterParams });
  };

  const { data: categories } = useGetCategories();

  const formatCategories = categories
    ? categories.map((category) => ({
        label: category.title,
        value: category.id + "",
      }))
    : [];

  const handleCategoryChange = (selectedValues: string[]) => {
    setSearchFilterParams({
      ...searchFilterParams,
      categories: selectedValues,
    });
  };

  const { data: posts, isFetching: postList_isLoading } = useGetPostList({
    page: {
      size: pagination.pageSize,
      index: pagination.pageIndex,
    },
    ...queryFilterParams,
  });
  const postList = posts ? posts.postList : [];
  const total = posts ? posts.page.total : 0;

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="标题..."
          value={searchFilterParams.title}
          onChange={(event) => {
            setSearchFilterParams({
              ...searchFilterParams,
              title: event.target.value,
            });
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <Input
          placeholder="作者..."
          value={searchFilterParams.author}
          onChange={(event) => {
            setSearchFilterParams({
              ...searchFilterParams,
              author: event.target.value,
            });
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <MultiSelect
          className="h-8 w-[250px] lg:w-[350px]"
          options={formatCategories}
          onValueChange={handleCategoryChange}
          selectedValues={searchFilterParams.categories}
          placeholder="分类"
          variant="inverted"
          animation={0}
          maxCount={2}
        />

        <Button onClick={handleSearch}>搜索</Button>
      </div>

      <DataTable
        columns={columns}
        data={postList}
        total={total}
        pagination={pagination}
        onPageChange={setPagination}
        isLoading={postList_isLoading}
      />
    </div>
  );
};

export default PostList;
