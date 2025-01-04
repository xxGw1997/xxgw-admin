import { useGetPostList } from "~/api/post";
import { DataTable } from "~/components/data-table";

import { columns } from "./columns";
import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

type SearchFilterParamsType = {
  title: string;
  author: string;
  categories: number[];
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

  const { data: posts } = useGetPostList({
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
          className="h-8 w-[50px] lg:w-[150px]"
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
          className="h-8 w-[50px] lg:w-[150px]"
        />

        <Button onClick={handleSearch}>搜索</Button>
      </div>

      <DataTable
        columns={columns}
        data={postList}
        total={total}
        pagination={pagination}
        onPageChange={setPagination}
      />
    </div>
  );
};

export default PostList;
