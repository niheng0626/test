import request from "@/utils/request";

export const queryAllApi = () => {
  return request.get("/depts");
};

export const addApi = (dept) => {
  return request.post("/depts", dept);
};

//根据id查询部门
export const queryByIdApi = (id) => {
  return request.get(`/depts/${id}`);
};

// 根据id修改部门
export const updateApi = (dept) => {
  return request.put(`/depts`, dept);
};

// 根据id删除部门
export const deleteApi = (id) => {
  return request.delete(`/depts/${id}`);
};
