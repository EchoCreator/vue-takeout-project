import request from "@/utils/request";

export const upload = (file) => {
  return request.post("/upload", file);
};
