import request from "@/utils/request";
//查询员工列表
export const queryAllApi = (name, gender, begin, end, page, pageSize) => {
  return request.get(
    "/emps?name=" +
      name +
      "&gender=" +
      gender +
      "&begin=" +
      begin +
      "&end=" +
      end +
      "&page=" +
      page +
      "&pageSize=" +
      pageSize
  );
};
