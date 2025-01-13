import axios from "axios";
import { useTokenStore } from "@/stores/token";
import { ElMessage } from "element-plus";
import { router } from "@/router";

const baseURL = "/api";
const instance = axios.create({
  baseURL: baseURL,
});
instance.interceptors.request.use(
  (config) => {
    const tokenStore = useTokenStore();
    const token = tokenStore.token;
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
instance.interceptors.response.use(
  (result) => {
    return result.data;
  },
  (err) => {
    if (err.response.status === 401) {
      ElMessage.closeAll();
      ElMessage({
        message: "未登录，请先登录",
        customClass: "custom-message",
        type: "error",
      });
      router.push("/login");
    }
    console.log(err);
    return Promise.reject(err);
  }
);

export default instance;
