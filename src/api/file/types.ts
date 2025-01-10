export type GetOssInfoReturnType = {
  OSSAccessKeyId: string;
  Signature: string;
  expireDate: string;
  host: string;
  policy: string;
};

export type UploadFileType = {
  onSuccess: () => {};
  file: File;
};
