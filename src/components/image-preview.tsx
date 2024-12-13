import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

export const ImagePreview = ({
  imageUrl,
  onClose,
}: {
  imageUrl: string;
  onClose?: () => void;
}) => {
  const [imgStatus, setImgStatus] = useState<"idle" | "ok" | "no">("idle");

  useEffect(() => {
    if (!imageUrl) {
      setTimeout(() => {
        setImgStatus("no");
        onClose && onClose();
      }, 1000);
      return;
    }
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => setImgStatus("ok");
    img.onerror = () => setImgStatus("no");
  }, [imageUrl, setImgStatus]);

  return (
    <div>
      {imgStatus === "idle" && (
        <div>
          <Loader className="animate-spin" />
          图片加载中...
        </div>
      )}
      {imgStatus === "ok" && <img src={imageUrl} alt="preview" className="pt-5" />}
      {imgStatus === "no" && <p>图片加载失败</p>}
    </div>
  );
};
