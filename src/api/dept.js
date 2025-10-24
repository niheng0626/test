import request from "@/utils/request";

export const queryAllApi = () => {
  return request.get("/depts");
};

export const addApi = (dept) => {
  return request.post("/depts", dept);
};
