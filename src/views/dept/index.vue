<script setup>
import { onMounted, ref, nextTick } from "vue";
import {
  queryAllApi,
  addApi,
  queryByIdApi,
  updateApi,
  deleteApi,
} from "@/api/dept";
import { ElMessage, ElMessageBox } from "element-plus";

// 钩子函数
onMounted(() => {
  search();
});

const tableData = ref([]);
const loading = ref(false);

const search = async () => {
  loading.value = true;
  try {
    const result = await queryAllApi();
    if (result.code) {
      tableData.value = result.data;
    } else {
      ElMessage.error(result.msg || "获取部门列表失败");
    }
  } catch (error) {
    ElMessage.error("网络请求失败");
    console.error("搜索失败:", error);
  } finally {
    loading.value = false;
  }
};

const dialogFormVisible = ref(false);
const formTitel = ref("");
const deptForm = ref({
  id: undefined,
  name: "",
});
const deptFormRef = ref(null);

// 表单验证规则
const formRules = ref({
  name: [
    { required: true, message: "请输入部门名称", trigger: "blur" },
    { min: 2, max: 20, message: "部门名称长度在2到20个字符", trigger: "blur" },
  ],
});

const addDept = () => {
  formTitel.value = "添加部门";
  // 完全重置表单数据
  deptForm.value = {
    id: undefined,
    name: "",
  };
  dialogFormVisible.value = true;

  // 使用 nextTick 确保 DOM 更新后重置表单验证
  nextTick(() => {
    if (deptFormRef.value) {
      deptFormRef.value.clearValidate();
    }
  });
};

const save = async () => {
  if (!deptFormRef.value) return;

  try {
    // 表单验证
    await deptFormRef.value.validate();

    let result;
    if (deptForm.value.id) {
      // 修改部门 - 确保传递正确的参数格式
      const updateData = {
        id: deptForm.value.id,
        name: deptForm.value.name,
      };
      result = await updateApi(updateData);
    } else {
      // 添加部门
      result = await addApi({ name: deptForm.value.name });
    }

    if (result && result.code) {
      ElMessage.success(deptForm.value.id ? "修改成功" : "添加成功");
      dialogFormVisible.value = false;
      await search(); // 重新加载数据
    } else {
      ElMessage.error(result?.msg || "操作失败");
    }
  } catch (error) {
    if (error?.fields) {
      // 表单验证失败
      ElMessage.warning("请检查表单数据");
    } else {
      // 其他错误
      ElMessage.error("操作失败，请重试");
      console.error("保存失败:", error);
    }
  }
};

const edit = async (id) => {
  try {
    const result = await queryByIdApi(id);

    if (result && result.code && result.data) {
      // 关键修复：确保正确设置表单数据
      formTitel.value = "修改部门";

      // 先显示对话框，确保表单已渲染
      dialogFormVisible.value = true;

      // 使用nextTick确保DOM更新后再设置数据
      nextTick(() => {
        // 直接赋值，保持响应式
        deptForm.value.id = result.data.id;
        deptForm.value.name = result.data.name;

        // 清除验证状态
        if (deptFormRef.value) {
          deptFormRef.value.clearValidate();
        }
      });
    } else {
      ElMessage.error(result?.msg || "获取部门信息失败");
    }
  } catch (error) {
    ElMessage.error("获取部门信息失败");
    console.error("编辑失败:", error);
  }
};

// 删除部门
const deleteDept = async (id) => {
  try {
    await ElMessageBox.confirm("确定要删除该部门吗？此操作不可恢复。", "警告", {
      confirmButtonText: "确定删除",
      cancelButtonText: "取消",
      type: "warning",
      confirmButtonClass: "el-button--danger",
    });

    const result = await deleteApi(id);
    if (result && result.code) {
      ElMessage.success("删除成功");
      await search();
    } else {
      ElMessage.error(result?.msg || "删除失败");
    }
  } catch (error) {
    // 用户取消删除，不进行任何操作
  }
};
</script>

<template>
  <div class="department-management">
    <h1>部门管理</h1>
    <div class="action-bar">
      <el-button type="primary" @click="addDept">+ 添加部门</el-button>
    </div>

    <div class="table-container">
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        style="width: 100%"
        empty-text="暂无部门数据"
      >
        <el-table-column prop="id" label="序号" width="80" align="center" />
        <el-table-column
          prop="name"
          label="部门名称"
          width="200"
          align="center"
        />
        <el-table-column
          prop="updateTime"
          label="最后操作时间"
          width="400"
          align="center"
        />
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <el-button type="primary" size="small" @click="edit(scope.row.id)"
              >修改</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="deleteDept(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加/修改部门对话框 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="formTitel"
      width="500"
      :close-on-click-modal="false"
    >
      <el-form
        :model="deptForm"
        ref="deptFormRef"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="deptForm.name"
            placeholder="请输入部门名称"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.department-management {
  padding: 20px;
}

.action-bar {
  margin: 20px 0;
}

.table-container {
  margin-top: 20px;
}

h1 {
  color: #303133;
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
