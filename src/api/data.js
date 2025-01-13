import request from "@/utils/request";

export const getTurnoverService = (begin, end) => {
  return request.get("/admin/data/turnover?begin=" + begin + "&end=" + end);
};

export const getUserGenderService = (begin, end) => {
  return request.get("/admin/data/userGender?begin=" + begin + "&end=" + end);
};

export const getUserAgeService = (begin, end) => {
  return request.get("/admin/data/userAge?begin=" + begin + "&end=" + end);
};
