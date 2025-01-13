import request from "@/utils/request";

export const setShopStatusService = (status) => {
  return request.post(`/admin/shop/${status}`);
};

export const getShopStatusService = () => {
  return request.get("/admin/shop/status");
};
