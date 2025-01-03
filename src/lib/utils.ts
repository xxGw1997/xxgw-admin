import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkImageFile(file: File) {
  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  return validImageTypes.includes(file.type);
}

export function generateRGBFromString(str: string, random = 666) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + random + ((hash << 5) - hash); // 基于字符串的字符码计算哈希值
  }

  // 将哈希值转换为 RGB 颜色
  const r = (hash >> 16) & 0xff; // 获取红色部分
  const g = (hash >> 8) & 0xff; // 获取绿色部分
  const b = hash & 0xff; // 获取蓝色部分

  return {
    bg: `rgb(${255 - r}, ${255 - g}, ${255 - b})`,
    color: `rgb(${r}, ${g}, ${b})`,
  };
}
