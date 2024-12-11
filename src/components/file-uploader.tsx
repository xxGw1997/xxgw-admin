import { ChangeEvent, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [imgUrl, setImgUrl] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
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
        formData.append("key", file.name);
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
          const imgUrl = `${ossInfo.host}/${file.name}`;
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
      <Input type="file" onChange={handleFileChange} />
      {file && (
        <div className="mb-4 text-sm">
          <p>File name: {file.name}</p>
          <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
          <p>Type: {file.type}</p>
        </div>
      )}

      {file && status !== "uploading" && (
        <Button onClick={handleFileUpload}>Upload</Button>
      )}

      {imgUrl && <img src={imgUrl} />}
    </div>
  );
};
