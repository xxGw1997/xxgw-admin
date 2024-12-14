import { FileUploader } from "../file-uploader";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export const LocalTab = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>从电脑本地文件中选择一个图片文件进行上传</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <FileUploader />
        </CardContent>
      </Card>
    </>
  );
};
