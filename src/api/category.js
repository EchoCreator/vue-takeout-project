import request from "@/utils/request";

export const getCategoryListService = (searchConditions) => {
  const params = new URLSearchParams();
  for (let key in searchConditions) {
    if (searchConditions[key] != null && searchConditions[key] != undefined) {
      params.append(key, searchConditions[key]);
    }
  }
  return request.get("/admin/category/categoryList", { params });
};

export const getAllCategoryListService = (type) => {
  return request.get("/admin/category/allCategoryList?type=" + type);
};

export const setStatusService = (id, status) => {
  return request.put(
    "/admin/category/setStatus?id=" + id + "&status=" + status
  );
};

export const editCategoryService = (categoryData) => {
  return request.put("/admin/category/editCategory", categoryData);
};

export const editSortService = (sortList) => {
  return request.put("/admin/category/editSort", sortList);
};

export const addCategoryService = (categoryData) => {
  return request.post("/admin/category/addCategory", categoryData);
};

export const deleteCategoryService = (id) => {
  return request.delete("/admin/category/deleteCategory?id=" + id);
};
