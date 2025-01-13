import request from "@/utils/request";

export const getDishesService = (searchConditions) => {
  const params = new URLSearchParams();
  for (let key in searchConditions) {
    if (searchConditions[key] != null && searchConditions[key] != undefined) {
      params.append(key, searchConditions[key]);
    }
  }
  return request.get("/admin/dishes/getDishes", { params });
};

export const editDishesService = (dishesData) => {
  return request.put("/admin/dishes/editDishes", dishesData);
};

export const addDishesService = (dishesData) => {
  return request.post("/admin/dishes/addDishes", dishesData);
};

export const editStatusService = (id, status) => {
  return request.put("/admin/dishes/editStatus?id=" + id + "&status=" + status);
};

export const deleteDishesService = (id) => {
  return request.delete("/admin/dishes/deleteDishes?id=" + id);
};
