import request from "@/utils/request";

export const employeeLoginService = (data) => {
  return request.post("/admin/employee/login", data);
};

export const employeeLogoutService = () => {
  return request.post("/admin/employee/logout");
};

export const getEmployeeListService = (searchConditions) => {
  const params = new URLSearchParams();
  for (let key in searchConditions) {
    if (searchConditions[key] != null && searchConditions[key] != undefined)
      params.append(key, searchConditions[key]);
  }
  return request.get("/admin/employee/getEmployeeList", { params });
};

export const editEmployeeService = (employeeData) => {
  return request.put("/admin/employee/editEmployeeInfo", employeeData);
};

export const addEmployeeService = (employeeData) => {
  return request.post("/admin/employee/addEmployee", employeeData);
};

export const deleteEmployeeService = (id) => {
  return request.delete("/admin/employee/deleteEmployee?id=" + id);
};

export const editPwdService = (pwdData) => {
  return request.put("/admin/employee/editPwd", pwdData);
};

export const getInfoService = () => {
  return request.get("/admin/employee/getInfo");
};
