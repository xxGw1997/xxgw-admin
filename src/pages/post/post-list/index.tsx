import { useGetPostList } from "~/api/post";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

const PostList = () => {
  const { data: postList } = useGetPostList({
    page: {
      size: 10,
      index: 0,
    },
  });

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={postList ?? []} />
    </div>
  );
};

export default PostList;
