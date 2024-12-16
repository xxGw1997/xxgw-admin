import { ChangeEvent, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Upload } from "lucide-react";
import { ImgInfo } from "./mdx-editor/insert-image";
import { checkImageFile, cn } from "~/lib/utils";
import { toast } from "sonner";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

type FileUploaderProps = {
  uploadCallback?: ({ src, alt, title }: ImgInfo) => void;
};

export const FileUploader = ({ uploadCallback }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [imgUrl, setImgUrl] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size >= 3 * 1024 * 1024) {
        toast("上传图片最大不能超过3M~");
      } else if (!checkImageFile(file)) {
        toast("请选择图片类型文件~");
      } else {
        setFile(e.target.files[0]);
      }
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;

    setStatus("uploading");
    try {
      const res = await fetch("/api/ali-oss/getOssInfo", {
        method: "POST",
      });
      if (res.ok) {
        const ossInfo = await res.json();
        const formData = new FormData();
        const fileKey = `${Date.now()}_${file.name}`;
        formData.append("key", fileKey);
        formData.append("OSSAccessKeyId", ossInfo.OSSAccessKeyId);
        formData.append("policy", ossInfo.policy);
        formData.append("signature", ossInfo.Signature);
        formData.append("success_action_status", "200");
        formData.append("file", file);

        const uploadRes = await fetch(ossInfo.host, {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const imgUrl = `${ossInfo.host}/${fileKey}`;
          uploadCallback &&
            uploadCallback({ src: imgUrl, title: file.name, alt: file.name });
          setImgUrl(imgUrl);
          setStatus("success");
        }
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="space-y-4">
      <Input
        id="file-upload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
      <Label
        htmlFor="file-upload"
        className={cn(
          "cursor-pointer border border-dashed rounded-sm bg-[#fafafa] w-full h-32 flex flex-col justify-center items-center gap-y-5",
          status === "uploading" ? "cursor-wait" : ""
        )}
      >
        <Upload />
        选择图片
      </Label>

      {file && (
        <div className="mb-4 text-sm">
          <p>文件名称: {file.name}</p>
          <p>文件大小: {(file.size / 1024).toFixed(2)} KB</p>
          <p>文件类型: {file.type}</p>
        </div>
      )}

      {file && status !== "uploading" && (
        <Button onClick={handleFileUpload}>上传</Button>
      )}

      {imgUrl && <img src={imgUrl} />}
    </div>
  );
};
