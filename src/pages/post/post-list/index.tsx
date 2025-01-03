import { useGetPostList } from "~/api/post";
import { DataTable } from "~/components/data-table";

import { columns } from "./columns";
import { useState } from "react";

const PostList = () => {
  const [pageIndex, setPageIndex] = useState(0);

  const { data: posts } = useGetPostList({
    page: {
      size: 5,
      index: pageIndex,
    },
  });
  const postList = posts ? posts.postList : [];

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={postList} />
      <button onClick={() => setPageIndex(pageIndex - 1)}>{"<"}</button>
      {pageIndex + 1}
      <button onClick={() => setPageIndex(pageIndex + 1)}>{">"}</button>
    </div>
  );
};

export default PostList;
