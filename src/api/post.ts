import { instance } from "~/lib/request-handler";
import { requestHandler } from "~/lib/request-handler";

export const createPost = requestHandler(() => instance.post("/api/post"));
