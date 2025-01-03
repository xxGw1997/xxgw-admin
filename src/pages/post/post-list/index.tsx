import { useGetPostList } from "~/api/post";
import { DataTable } from "~/components/data-table";

import { columns } from "./columns";
import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";

const PostList = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const { data: posts } = useGetPostList({
    page: {
      size: pagination.pageSize,
      index: pagination.pageIndex,
    },
  });
  const postList = posts ? posts.postList : [];
  const total = posts ? posts.page.total : 0;

  return (
    <div className="container mx-auto py-10">
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
