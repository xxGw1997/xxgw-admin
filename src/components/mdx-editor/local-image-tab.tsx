import { FileUploader } from "../file-uploader";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ImgInfo } from "./insert-image";

export type LocalTabProps = {
  handleSubmit: ({ src, title, alt }: ImgInfo) => void;
};

export const LocalTab = ({ handleSubmit }: LocalTabProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>从电脑本地文件中选择一个图片文件进行上传</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <FileUploader uploadCallback={handleSubmit} />
        </CardContent>
      </Card>
    </>
  );
};
