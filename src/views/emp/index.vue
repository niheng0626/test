<script setup>
import { ref } from "vue";
import { watch } from "vue";
import { queryAllApi } from "@/api/emp";
import { onMounted } from "vue";
import { queryAllApi as queryAlldepts } from "@/api/dept";

//元数据
//职位列表数据
const jobs = ref([
  { name: "班主任", value: 1 },
  { name: "讲师", value: 2 },
  { name: "学工主管", value: 3 },
  { name: "教研主管", value: 4 },
  { name: "咨询师", value: 5 },
  { name: "其他", value: 6 },
]);
//部门列表数据
const depts = ref([]);
//钩子函数
onMounted(() => {
  search();
  queryDepts();
});

//查询所有部门数据
const queryDepts = async () => {
  const result = await queryAlldepts();
  if (result.code) {
    depts.value = result.data;
  }
};

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

//新增员工
const addEmp = () => {
  dialogVisible.value = true;
  dialogTitle.value = "新增员工";
  employee.value = {
    username: "",
    name: "",
    gender: "",
    phone: "",
    job: "",
    salary: "",
    deptId: "",
    entryDate: "",
    image: "",
    exprList: [],
  };
};

const employee = ref({
  username: "",
  name: "",
  gender: "",
  phone: "",
  job: "",
  salary: "",
  deptId: "",
  entryDate: "",
  image: "",
  exprList: [],
});

// 控制弹窗
const dialogVisible = ref(false);
const dialogTitle = ref("新增员工");

//文件上传
// 图片上传成功后触发
const handleAvatarSuccess = (response) => {
  console.log(response);
};
// 文件上传之前触发
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png") {
    ElMessage.error("只支持上传图片");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error("只能上传10M以内图片");
    return false;
  }
  return true;
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
    <el-button type="primary" @click="addEmp">添加员工</el-button>
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
  <!-- 新增/修改员工的对话框 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form :model="employee" label-width="80px">
      <!-- 基本信息 -->
      <!-- 第一行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名">
            <el-input
              v-model="employee.username"
              placeholder="请输入员工用户名，2-20个字"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="姓名">
            <el-input
              v-model="employee.name"
              placeholder="请输入员工姓名，2-10个字"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="性别">
            <el-select
              v-model="employee.gender"
              placeholder="请选择性别"
              style="width: 100%"
            >
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="手机号">
            <el-input
              v-model="employee.phone"
              placeholder="请输入员工手机号"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="职位">
            <el-select
              v-model="employee.job"
              placeholder="请选择职位"
              style="width: 100%"
            >
              <el-option
                v-for="item in jobs"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="薪资">
            <el-input
              v-model="employee.salary"
              placeholder="请输入员工薪资"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属部门">
            <el-select
              v-model="employee.deptId"
              placeholder="请选择部门"
              style="width: 100%"
            >
              <el-option
                v-for="d in depts"
                :key="d.id"
                :label="d.name"
                :value="d.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入职日期">
            <el-date-picker
              v-model="employee.entryDate"
              type="date"
              style="width: 100%"
              placeholder="选择日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第五行 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              action="/api/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="employee.image" :src="employee.image" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 工作经历 -->
      <!-- 第六行 -->
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="工作经历">
            <el-button type="success" size="small" @click=""
              >+ 添加工作经历</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第七行 ...  工作经历 -->
      <el-row :gutter="3">
        <el-col :span="10">
          <el-form-item size="small" label="时间" label-width="80px">
            <el-date-picker
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item size="small" label="公司" label-width="60px">
            <el-input placeholder="请输入公司名称"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item size="small" label="职位" label-width="60px">
            <el-input placeholder="请输入职位"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="2">
          <el-form-item size="small" label-width="0px">
            <el-button type="danger">- 删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  margin: 10px 0;
}

.avatar {
  height: 40px;
}
.avatar-uploader .avatar {
  width: 78px;
  height: 78px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  text-align: center;
  border-radius: 10px;
  /* 添加灰色的虚线边框 */
  border: 1px dashed var(--el-border-color);
}
</style>
