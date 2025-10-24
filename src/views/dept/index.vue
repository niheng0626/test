<script setup>
import { onMounted, ref } from "vue";
import { queryAllApi } from "@/api/dept";
import { addApi } from "@/api/dept";
import { ElMessage } from "element-plus";

//钩子函数
onMounted(() => {
  search();
});

const tableData = ref([]);
const search = async () => {
  const result = await queryAllApi();
  if (result.code) {
    tableData.value = result.data;
  }
};

const dialogFormVisible = ref(false);
const formTitel = ref("");
const dept = ref({ name: "" });

const addDept = () => {
  dialogFormVisible.value = true;
  formTitel.value = "添加部门";
  dept.value = {};
};
const save = async () => {
  const result = await addApi(dept.value);
  if (result.code) {
    ElMessage.success("添加成功");
    dialogFormVisible.value = false;
    search();
  } else {
    ElMessage.error(result.msg);
  }
};
</script>

<template>
  <h1>部门管理</h1>
  <div class="contianer">
    <el-button type="primary" @click="addDept">+添加部门</el-button>
  </div>
  <div class="container">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="70" align="center" />
      <el-table-column
        prop="name"
        label="部门名称"
        width="200"
        align="center"
      />
      <el-table-column
        prop="updateTime"
        label="最后操作时间"
        width="200"
        align="center"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small">修改</el-button>
          <el-button type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="dialogFormVisible" :title="formTitel" width="500">
    <el-form :model="dept">
      <el-form-item label="部门名称" :label-width="formLabelWidth">
        <el-input v-model="dept.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.contianer {
  margin: 20px 0px;
}
</style>
