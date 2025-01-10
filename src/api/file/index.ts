import axios from "axios";
import { httpRequest } from "~/lib/http";
import { GetOssInfoReturnType } from "./types";

export const uploadFile = async (file: File) => {
  const ossInfo: GetOssInfoReturnType = await httpRequest.post(
    "/api/ali-oss/getOssInfo"
  );

  const formData = new FormData();
  const fileKey = `${Date.now()}_${file.name}`;
  formData.append("key", fileKey);
  formData.append("OSSAccessKeyId", ossInfo.OSSAccessKeyId);
  formData.append("policy", ossInfo.policy);
  formData.append("signature", ossInfo.Signature);
  formData.append("success_action_status", "200");
  formData.append("file", file);
  const res = await axios.post(ossInfo.host, formData);
  if (res.status === 200) {
    const imgUrl = `${ossInfo.host}/${fileKey}`;
    return { src: imgUrl, title: file.name, alt: file.name };
  } else {
    throw new Error("Upload Failed");
  }
};
