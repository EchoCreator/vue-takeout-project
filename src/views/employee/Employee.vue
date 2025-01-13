<script setup>
import { ref } from "vue";
import {
  CircleCheck,
  Warning,
  CirclePlusFilled,
  Search,
} from "@element-plus/icons-vue";
import {
  getEmployeeListService,
  editEmployeeService,
  addEmployeeService,
  deleteEmployeeService,
} from "@/api/employee.js";
import { ElMessage } from "element-plus";

import { useUserInfoStore } from "@/stores/userInfo";
const userInfoStore = useUserInfoStore();

// 获取员工列表
const total = ref(0);
const searchConditionsRef = ref({});
const searchConditions = ref({
  pageNum: 1,
  pageSize: 5,
  name: "",
  status: "",
  position: "",
});
const employeeList = ref([
  {
    id: "",
    username: "",
    name: "",
    phoneNumber: "",
    position: "",
    status: "",
    profilePicture: "",
    createTime: "",
    latestLoginTime: "",
    latestLogoutTime: "",
  },
]);

const statusOptions = ref([
  {
    value: 1,
    label: "启用",
  },
  {
    value: 2,
    label: "禁用",
  },
]);

const positionOptions = ref([
  {
    value: "管理员",
    label: "管理员",
  },
  {
    value: "服务员",
    label: "服务员",
  },
  {
    value: "厨师",
    label: "厨师",
  },
  {
    value: "收银员",
    label: "收银员",
  },
  {
    value: "采购员",
    label: "采购员",
  },
]);

const setPageNum = (value) => {
  searchConditions.value.pageNum = value;
  getEmployeeList();
};

const isEmpty = ref(false);
const getEmployeeList = async () => {
  isEmpty.value = false;
  const result = await getEmployeeListService(searchConditions.value);
  if (result.code === 0) {
    total.value = result.data.total;
    employeeList.value = result.data.list;
    if (result.data.list.length === 0) {
      isEmpty.value = true;
    }
  }
};
getEmployeeList();

const tableRowClassName = ({ row, rowIndex }) => {
  if (row.position === "管理员") {
    return "admin";
  }
};

// 搜索
const name = ref("");
const status = ref("");
const position = ref("");
const search = () => {
  searchConditions.value.pageNum = 1;
  searchConditions.value.name = name.value;
  searchConditions.value.status = status.value;
  searchConditions.value.position = position.value;
  getEmployeeList();
};

// 修改员工信息
const dialogVisible = ref(false);
const dialogTitle = ref("");
const employeeDataRef = ref({});
const employeeData = ref({
  id: "",
  name: "",
  username: "",
  position: "",
  phoneNumber: "",
  status: "",
  gender: "",
  idNumber: "",
  profilePicture: "",
});

const handleDialogClose = () => {
  dialogVisible.value = false;
  setTimeout(() => {
    reset();
  }, 100);
};

const rules = {
  name: [
    { required: true, message: "姓名不能为空", trigger: ["blur", "change"] },
  ],
  username: [
    { required: true, message: "姓名不能为空", trigger: ["blur", "change"] },
  ],
  phoneNumber: [
    {
      required: true,
      message: "手机号不能为空",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "手机号格式不正确",
      trigger: ["blur", "change"],
    },
  ],
  idNumber: [
    {
      required: true,
      message: "身份证号不能为空",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^\d{18}$/,
      message: "身份证号格式不正确",
      trigger: ["blur", "change"],
    },
  ],
  gender: [
    {
      required: true,
      message: "性别不能为空",
      trigger: ["blur", "change"],
    },
  ],
  position: [
    {
      required: true,
      message: "职位不能为空",
      trigger: ["blur", "change"],
    },
  ],
  status: [
    {
      required: true,
      message: "账号状态不能为空",
      trigger: ["blur", "change"],
    },
  ],
};
const reset = () => {
  employeeDataRef.value.resetFields();
  employeeData.value.name = "";
  employeeData.value.username = "";
  employeeData.value.position = "";
  employeeData.value.phoneNumber = "";
  employeeData.value.idNumber = "";
  employeeData.value.gender = "";
  employeeData.value.status = "";
};
const setEmployee = (row) => {
  employeeData.value.id = row.id;
  employeeData.value.name = row.name;
  employeeData.value.username = row.username;
  employeeData.value.position = row.position;
  employeeData.value.phoneNumber = row.phoneNumber;
  employeeData.value.idNumber = row.idNumber;
  employeeData.value.gender = row.gender;
  employeeData.value.status = row.status;
  employeeData.value.profilePicture = row.profilePicture;
};
const editEmployee = async () => {
  await employeeDataRef.value.validate(async (valid, fields) => {
    if (valid) {
      const result = await editEmployeeService(employeeData.value);
      if (result.code === 0) {
        ElMessage.closeAll();
        ElMessage({
          message: "修改成功！",
          customClass: "custom-message",
          type: "success",
        });
        dialogVisible.value = false;
        getEmployeeList();
      } else {
        ElMessage.closeAll();
        ElMessage({
          message: result.message,
          customClass: "custom-message",
          type: "error",
        });
      }
    }
  });
};

// 添加员工
const addEmployee = async () => {
  await employeeDataRef.value.validate(async (valid, fields) => {
    if (valid) {
      const result = await addEmployeeService(employeeData.value);
      if (result.code === 0) {
        ElMessage.closeAll();
        ElMessage({
          message: "添加成功！",
          customClass: "custom-message",
          type: "success",
        });
        dialogVisible.value = false;
        getEmployeeList();
      } else {
        ElMessage.closeAll();
        ElMessage({
          message: result.message,
          customClass: "custom-message",
          type: "error",
        });
      }
    }
  });
};

// 删除员工
const popoverVisible = ref(false);
const deleteEmployee = async (id) => {
  const result = await deleteEmployeeService(id);
  if (result.code === 0) {
    ElMessage.closeAll();
    ElMessage({
      message: "删除成功！",
      customClass: "custom-message",
      type: "success",
    });
    getEmployeeList();
  }
};
</script>

<template>
  <el-card style="max-width: 100%">
    <template #header>
      <p>员工管理</p>
      <el-popover
        :width="80"
        trigger="hover"
        :disabled="userInfoStore.userInfo.position === '管理员'"
      >
        <div class="custom-popover">你不是管理员，无法操作</div>
        <template #reference>
          <el-button
            color="#626aef"
            :icon="CirclePlusFilled"
            @click="
              dialogVisible = true;
              dialogTitle = '添加员工';
              reset();
            "
            :disabled="userInfoStore.userInfo.position !== '管理员'"
            >添加员工</el-button
          >
        </template>
      </el-popover>
    </template>

    <div class="body-top">
      <div class="search-area">
        <el-input
          v-model="name"
          style="width: 160px"
          placeholder="请输入员工姓名"
          clearable
        />
        <el-select
          v-model="status"
          placeholder="请选择员工状态"
          style="width: 160px"
          clearable
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="position"
          placeholder="请选择员工职位"
          style="width: 160px"
          clearable
        >
          <el-option
            v-for="item in positionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button color="#626aef" :icon="Search" @click="search()"
          >搜索</el-button
        >
      </div>
      <div class="example-pagination-block">
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          :page-size="searchConditions.pageSize"
          @current-change="setPageNum"
          :current-page="searchConditions.pageNum"
        />
      </div>
    </div>
    <div>
      <el-table
        class="custom-table"
        :data="employeeList"
        :row-class-name="tableRowClassName"
      >
        <template #empty>
          <el-empty
            v-if="isEmpty"
            image-size="300"
            image="../../../public/images/icon/empty.png"
            description="搜索结果为空"
          ></el-empty>
        </template>
        <el-table-column prop="name" label="姓名" />
        <el-table-column label="用户名" width="220">
          <template #default="{ row }">
            <div class="name">
              <img
                class="profile-picture"
                v-if="row.profilePicture"
                :src="row.profilePicture"
                alt=""
              />
              <el-avatar
                class="profile-picture"
                v-if="!row.profilePicture"
                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
              />
              <p>{{ row.username }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phoneNumber" label="手机号" width="150" />
        <el-table-column prop="position" label="职位" width="150" />
        <el-table-column label="账号状态" width="150">
          <template #default="{ row }">
            <el-icon v-if="row.status === 1" color="#349c5e"
              ><CircleCheck
            /></el-icon>
            <el-icon v-if="row.status === 2" color="#f25a47"
              ><Warning
            /></el-icon>
            <div class="status">{{ row.status === 1 ? "启用" : "禁用" }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="入职时间" width="135" />
        <el-table-column label="最近登录时间" width="135">
          <template #default="{ row }">
            <p v-if="row.latestLoginTime">{{ row.latestLoginTime }}</p>
            <p v-if="!row.latestLoginTime">从未登录</p>
          </template>
        </el-table-column>
        <el-table-column label="最近登出时间" width="135">
          <template #default="{ row }">
            <p
              v-if="
                row.latestLoginTime &&
                row.latestLogoutTime >= row.latestLoginTime &&
                row.latestLogoutTime
              "
            >
              {{ row.latestLogoutTime }}
            </p>
            <p v-if="!row.latestLoginTime">从未登录</p>
            <p
              v-if="
                row.latestLoginTime &&
                (row.latestLogoutTime < row.latestLoginTime ||
                  !row.latestLogoutTime)
              "
            >
              账号运行中
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button
              type="success"
              size="small"
              @click.stop="
                dialogVisible = true;
                dialogTitle = '编辑员工信息';
                setEmployee(row);
              "
              v-if="
                userInfoStore.userInfo.position === '管理员' &&
                row.position !== '管理员'
              "
            >
              编辑
            </el-button>
            <el-popconfirm
              width="220"
              title="你确定要删除该员工吗？"
              @cancel="onCancel"
              @confirm="deleteEmployee(row.id)"
            >
              <template #reference>
                <el-button
                  size="small"
                  type="danger"
                  v-if="
                    userInfoStore.userInfo.position === '管理员' &&
                    row.position !== '管理员'
                  "
                  >删除</el-button
                >
              </template>
              <template #actions="{ confirm, cancel }">
                <el-button size="small" @click="cancel">取消</el-button>
                <el-button
                  color="var(--theme-color)"
                  size="small"
                  @click="confirm"
                >
                  确定
                </el-button>
              </template>
            </el-popconfirm>

            <el-popover :width="80" trigger="hover">
              <div class="custom-popover">
                {{
                  userInfoStore.userInfo.position !== "管理员"
                    ? "你不是管理员，无法操作"
                    : "无法对管理员账号进行操作"
                }}
              </div>
              <template #reference>
                <el-button
                  type="success"
                  size="small"
                  disabled
                  v-if="
                    userInfoStore.userInfo.position !== '管理员' ||
                    row.position === '管理员'
                  "
                >
                  编辑
                </el-button>
              </template>
            </el-popover>
            <el-popover :width="80" trigger="hover">
              <div class="custom-popover">
                {{
                  userInfoStore.userInfo.position !== "管理员"
                    ? "你不是管理员，无法操作"
                    : "无法对管理员账号进行操作"
                }}
              </div>
              <template #reference>
                <el-button
                  size="small"
                  type="danger"
                  disabled
                  v-if="
                    userInfoStore.userInfo.position !== '管理员' ||
                    row.position === '管理员'
                  "
                  >删除</el-button
                >
              </template>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="500"
    :before-close="handleDialogClose"
  >
    <el-form
      ref="employeeDataRef"
      style="max-width: 600px"
      :rules="rules"
      :model="employeeData"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="employeeData.name"
          style="width: 300px"
          placeholder="请输入员工姓名"
          clearable
        />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="employeeData.username"
          style="width: 300px"
          placeholder="请输入员工账号用户名"
          clearable
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phoneNumber">
        <el-input
          v-model="employeeData.phoneNumber"
          style="width: 300px"
          placeholder="请输入员工手机号"
          clearable
          maxlength="11"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="idNumber">
        <el-input
          v-model="employeeData.idNumber"
          style="width: 300px"
          placeholder="请输入员工身份证号"
          clearable
          maxlength="18"
        />
      </el-form-item>
      <el-form-item label="职位" prop="position">
        <el-select
          v-model="employeeData.position"
          placeholder="请选择员工职位"
          style="width: 240px"
        >
          <el-option
            v-for="item in positionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="employeeData.gender">
          <el-radio-button :value="1">男</el-radio-button>
          <el-radio-button :value="2">女</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="账号状态" prop="status">
        <el-radio-group v-model="employeeData.status">
          <el-radio-button class="unlocked" :value="1">启用</el-radio-button>
          <el-radio-button class="locked" :value="2">禁用</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          color="#626aef"
          type="primary"
          @click="dialogTitle === '添加员工' ? addEmployee() : editEmployee()"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.profile-picture {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.demo-ruleForm {
  display: flex !important;
}
.name {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.name p {
  width: 70%;
  text-align: center;
}
.el-form {
  height: 450px;
}
.search-area {
  width: 45%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
