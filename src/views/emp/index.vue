<script setup>
import { ref } from "vue";
import { watch } from "vue";
import { queryAllApi } from "@/api/emp";
import { onMounted } from "vue";

//钩子函数
onMounted(() => {
  search();
});

const searchEmp = ref({
  name: "",
  gender: "",
  date: [],
  begin: "",
  end: "",
});

//侦听date,赋值给begin,end
watch(
  () => searchEmp.value.date,
  (newValue) => {
    if (newValue && newValue.length === 2) {
      searchEmp.value.begin = newValue[0];
      searchEmp.value.end = newValue[1];
    } else {
      searchEmp.value.begin = "";
      searchEmp.value.end = "";
    }
  }
);
// 查询员工
const search = async () => {
  const result = await queryAllApi(
    searchEmp.value.name,
    searchEmp.value.gender,
    searchEmp.value.begin,
    searchEmp.value.end,
    currentPage.value,
    pageSize.value
  );

  if (result.code) {
    empList.value = result.data.rows;
    total.value = result.data.total;
  }
};
//清空表单
const clear = () => {
  searchEmp.value = { name: "", gender: "", date: [], begin: "", end: "" };
  search();
};

//员工列表数据
const empList = ref([]);

//分页
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
//当前页码改变
const handleCurrentChange = (val) => {
  currentPage.value = val;
  search();
};
</script>

<template>
  <h1>员工管理</h1>
  <!--查询表单-->
  <div class="container">
    <el-form :inline="true" :model="searchEmp" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input
          v-model="searchEmp.name"
          placeholder="请输入员工姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-select
          v-model="searchEmp.gender"
          placeholder="请选择性别"
          style="width: 200px"
        >
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间">
        <el-date-picker
          v-model="searchEmp.date"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="YYYY-MM-DD"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="info" @click="clear">重置</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!--功能按钮-->
  <div class="container">
    <el-button type="primary" @click="">添加员工</el-button>
    <el-button type="danger" @click="">删除员工</el-button>
  </div>

  <!--表格-->
  <div class="container">
    <el-table :data="empList" border style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="120" align="center">
      </el-table-column>
      <el-table-column label="性别" width="120" align="center">
        <template #default="scope">
          <span v-if="scope.row.gender === 1">男</span>
          <span v-else>女</span>
        </template>
      </el-table-column>
      <el-table-column prop="image" label="头像" width="120" align="center">
        <template #default="scope">
          <img :src="scope.row.image" style="width: 50px; height: 50px" />
        </template>
      </el-table-column>
      <el-table-column label="职位" width="120" align="center">
        <template #default="scope">
          <span v-if="scope.row.job === 1">班主任</span>
          <span v-else-if="scope.row.job === 2">讲师</span>
          <span v-else-if="scope.row.job === 3">学工主管</span>
          <span v-else-if="scope.row.job === 4">教研主管</span>
          <span v-else>咨询师</span>
        </template>
      </el-table-column>
      <el-table-column prop="salary" label="薪资" width="120" align="center">
      </el-table-column>
      <el-table-column prop="deptName" label="部门" width="120" align="center">
      </el-table-column>
      <el-table-column
        prop="entryDate"
        label="入职时间"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="最后操作时间"
        width="200"
        align="center"
      >
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <el-button type="primary" size="small">修改</el-button>
          <el-button type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!--分页-->
  <div class="container">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<style scoped>
.container {
  margin: 10px 0;
}
</style>
