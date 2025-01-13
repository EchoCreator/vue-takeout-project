<script setup>
import { ref, watch } from "vue";
import { useTokenStore } from "@/stores/token";
import { useUserInfoStore } from "@/stores/userInfo";
import { ElMessage, ElNotification } from "element-plus";
import {
  Histogram,
  DataAnalysis,
  AlarmClock,
  Shop,
  Dish,
  Grid,
  Avatar,
  Plus,
} from "@element-plus/icons-vue";

import { setShopStatusService, getShopStatusService } from "@/api/shop.js";

import { useRouter } from "vue-router";
const router = useRouter();

const tokenStore = useTokenStore();

const userInfoStore = useUserInfoStore();

import {
  employeeLogoutService,
  editPwdService,
  editEmployeeService,
  getInfoService,
  getEmployeeListService,
} from "@/api/employee";
const handleCommand = async (command) => {
  if (command === "logout") {
    const result = await employeeLogoutService();
    if (result.code === 0) {
      ElMessage.closeAll();
      tokenStore.removeToken();
      userInfoStore.removeUserInfo();
      router.push("/login");
      ElMessage({
        message: "已退出登录",
        customClass: "custom-message",
        type: "success",
      });
    }
  }
  if (command === "pwd") {
    pwdDialogVisible.value = true;
    resetPwd();
  }
  if (command === "info") {
    infoDialogVisible.value = true;
    setInfo();
  }
};

// 上传头像
const handleUploadSuccess = (result) => {
  infoData.value.profilePicture = result.data;
};
const beforeAvatarUpload = (file) => {
  if (file.size / 1024 / 1024 > 5) {
    ElMessage({
      message: "图片大小不能超过5MB！",
      customClass: "custom-message",
      type: "error",
    });
    return false;
  }
  return true;
};

// 修改信息
const infoDialogVisible = ref(false);
const infoDataRef = ref({});
const infoData = ref({
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
const resetInfo = () => {
  infoDataRef.value.resetFields();
  infoData.value.name = "";
  infoData.value.username = "";
  infoData.value.phoneNumber = "";
  infoData.value.idNumber = "";
  infoData.value.gender = "";
  infoData.value.profilePicture = "";
};

const setInfo = () => {
  infoData.value.id = userInfoStore.userInfo.id;
  infoData.value.name = userInfoStore.userInfo.name;
  infoData.value.username = userInfoStore.userInfo.username;
  infoData.value.position = userInfoStore.userInfo.position;
  infoData.value.phoneNumber = userInfoStore.userInfo.phoneNumber;
  infoData.value.idNumber = userInfoStore.userInfo.idNumber;
  infoData.value.gender = userInfoStore.userInfo.gender;
  infoData.value.status = userInfoStore.userInfo.status;
  infoData.value.profilePicture = userInfoStore.userInfo.profilePicture;
};

import { inject } from "vue";
const reload = inject("reload");

const editInfo = async () => {
  await infoDataRef.value.validate(async (valid, fields) => {
    if (valid) {
      const result = await editEmployeeService(infoData.value);
      if (result.code === 0) {
        infoDialogVisible.value = false;
        ElMessage.closeAll();
        ElMessage({
          message: "信息修改成功！",
          customClass: "custom-message",
          type: "success",
        });
        getInfo();
        if (router.currentRoute.value.path === "/employee") {
          reload();
        }
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

const getInfo = async () => {
  const result = await getInfoService();
  if (result.code === 0) {
    userInfoStore.userInfo = result.data;
  }
};

// 修改密码
const pwdDialogVisible = ref(false);
const pwdDataRef = ref({});
const pwdData = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const checkConfirmPassword = (rule, value, callback) => {
  if (value !== pwdData.value.newPassword) {
    callback(new Error("新密码与确认密码不一致，请重新输入！"));
  } else {
    callback();
  }
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
  oldPassword: [
    { required: true, message: "原密码不能为空", trigger: ["blur", "change"] },
    {
      pattern: /^[a-zA-Z0-9_-]+$/,
      message: "密码必须由字母、数字、下划线或连字符组成",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^.{5,20}$/,
      message: "密码长度必须由5-20个字符组成",
      trigger: ["blur", "change"],
    },
  ],
  newPassword: [
    { required: true, message: "新密码不能为空", trigger: ["blur", "change"] },
    {
      pattern: /^[a-zA-Z0-9_-]+$/,
      message: "密码必须由字母、数字、下划线或连字符组成",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^.{5,20}$/,
      message: "密码长度必须由5-20个字符组成",
      trigger: ["blur", "change"],
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: "确认密码不能为空",
      trigger: ["blur", "change"],
    },
    { validator: checkConfirmPassword, trigger: ["blur"] },
  ],
};
const resetPwd = () => {
  pwdDataRef.value.resetFields();
  pwdData.value.oldPassword = "";
  pwdData.value.newPassword = "";
  pwdData.value.confirmPassword = "";
};

const editPwd = async () => {
  const result = await editPwdService(pwdData.value);
  if (result.code === 0) {
    userInfoStore.removeUserInfo();
    tokenStore.removeToken();
    router.push("/login");
    ElMessage.closeAll();
    ElMessage({
      message: "密码修改成功！请重新登录",
      customClass: "custom-message",
      type: "success",
    });
  } else {
    ElMessage.closeAll();
    ElMessage({
      message: result.message,
      customClass: "custom-message",
      type: "error",
    });
  }
};

// 设置营业状态
const shopStatus = ref(null);
const selectStatus = ref(null);
const statusDialogVisible = ref(false);
const getShopStatus = async () => {
  const result = await getShopStatusService();
  if (result.code === 0) {
    shopStatus.value = result.data;
  }
};
getShopStatus();
const setShopStatus = async () => {
  const result = await setShopStatusService(selectStatus.value);
  if (result.code === 0) {
    ElMessage.closeAll();
    ElMessage({
      message: "店铺状态修改成功！",
      customClass: "custom-message",
      type: "success",
    });
    statusDialogVisible.value = false;
    getShopStatus();
  }
};

import { useWebSocket } from "@vueuse/core";
const { status, data, send, open, close } = useWebSocket(
  "ws://localhost:8080/ws/takeout-project"
);

//获取数据时必须要监视，此处的data就是上面结构出的data
const newOrder = ref();
watch(data, () => {
  //获取到的数据为data.value
  const wsData = JSON.parse(data.value);
  if (wsData.type === 1) {
    // newOrder.value.play();
    ElNotification({
      title: "你有一份新的订单，请注意接单",
      message: wsData.content,
      type: "success",
    });
  }else if(wsData.type === 2){
    ElNotification({
      title: "用户催单啦，请尽快接单！",
      message: wsData.content,
      type: "warning",
    });
  }
});
</script>

<template>
  <audio ref="newOrder">
    <source src="../../public/audio/new-order.mp3" />
  </audio>
  <div class="common-layout">
    <el-container>
      <el-header height="120px">
        <div class="left-container">
          <div class="logo-container">
            <img
              class="logo"
              src="../../public/images/icon/logo-white.png"
              alt=""
            />
            <p>暖心送</p>
          </div>
          <div class="show-status">
            <p :class="shopStatus === 1 ? 'open' : 'close'">
              {{ shopStatus === 1 ? "营业中" : "已打烊" }}
            </p>
            <!-- <img
              v-if="shopStatus === 1"
              src="../../public/images/icon/open.png"
              alt=""
            />
            <img
              v-if="shopStatus === 2"
              src="../../public/images/icon/close.png"
              alt=""
            /> -->
            <!-- <div class="bulb"></div> -->
          </div>
        </div>
        <div class="drop-down-container">
          <div
            class="time"
            @click="
              statusDialogVisible = true;
              selectStatus = shopStatus;
            "
          >
            <img src="../../public/images/icon/time.png" alt="" />
            <p>设置营业状态</p>
          </div>
          <p v-if="!userInfoStore.userInfo.name" class="hello">
            未登录，请先登录
          </p>
          <p v-if="userInfoStore.userInfo.name" class="hello">
            你好，{{ userInfoStore.userInfo.name }}
          </p>
          <el-dropdown @command="handleCommand">
            <img
              class="profile-picture"
              v-if="userInfoStore.userInfo.profilePicture"
              :src="userInfoStore.userInfo.profilePicture"
              alt=""
            />
            <el-avatar
              class="profile-picture"
              v-if="!userInfoStore.userInfo.profilePicture"
              :size="50"
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="info">修改信息</el-dropdown-item>
                <el-dropdown-item command="pwd">修改密码</el-dropdown-item>
                <el-dropdown-item command="logout">退出账号</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            :default-active="router.currentRoute.value.path"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            router
          >
            <el-menu-item index="/workbench">
              <el-icon><Histogram /></el-icon>
              <span>工作台</span>
            </el-menu-item>
            <el-menu-item index="/data">
              <el-icon><DataAnalysis /></el-icon>
              <span>数据统计</span>
            </el-menu-item>
            <el-menu-item index="/order">
              <el-icon><AlarmClock /></el-icon>
              <span>订单管理</span>
            </el-menu-item>
            <el-menu-item index="/bundle">
              <el-icon><Shop /></el-icon>
              <span>套餐管理</span>
            </el-menu-item>
            <el-menu-item index="/dishes">
              <el-icon><Dish /></el-icon>
              <span>菜品管理</span>
            </el-menu-item>
            <el-menu-item index="/category">
              <el-icon><Grid /></el-icon>
              <span>分类管理</span>
            </el-menu-item>
            <el-menu-item index="/employee">
              <el-icon><Avatar /></el-icon>
              <span>员工管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
  <el-dialog
    class="status-dialog"
    v-model="statusDialogVisible"
    title="设置店铺营业状态"
    width="400"
    :before-close="handleClose"
  >
    <el-radio-group v-model="selectStatus">
      <el-radio class="open-radio" :value="1" size="large"> 营业中 </el-radio>
      <el-radio class="close-radio" :value="2" size="large">已打烊</el-radio>
    </el-radio-group>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="statusDialogVisible = false">取消</el-button>
        <el-button color="#626aef" @click="setShopStatus()"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    class="info-dialog"
    v-model="infoDialogVisible"
    title="修改信息"
    width="500"
    :before-close="handleClose"
  >
    <el-form
      ref="infoDataRef"
      style="max-width: 600px"
      :rules="rules"
      :model="infoData"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="infoData.name"
          style="width: 300px"
          placeholder="请输入姓名"
          clearable
        />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="infoData.username"
          style="width: 300px"
          placeholder="请输入用户名"
          clearable
        />
      </el-form-item>
      <el-form-item label="头像" prop="profilePicture">
        <el-upload
          :auto-upload="true"
          :show-file-list="false"
          class="avatar-uploader"
          action="/api/upload"
          name="file"
          :headers="{ Authorization: tokenStore.token }"
          :on-success="handleUploadSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            width="100%"
            v-if="infoData.profilePicture"
            :src="infoData.profilePicture"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="手机号" prop="phoneNumber">
        <el-input
          v-model="infoData.phoneNumber"
          style="width: 300px"
          placeholder="请输入手机号"
          clearable
          maxlength="11"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="idNumber">
        <el-input
          v-model="infoData.idNumber"
          style="width: 300px"
          placeholder="请输入身份证号"
          clearable
          maxlength="18"
        />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="infoData.gender">
          <el-radio-button :value="0">男</el-radio-button>
          <el-radio-button :value="1">女</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="infoDialogVisible = false">取消</el-button>
        <el-button color="#626aef" @click="editInfo()"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="pwdDialogVisible"
    title="修改密码"
    width="500"
    :before-close="handleClose"
    class="pwd-dialog"
  >
    <el-form
      ref="pwdDataRef"
      style="max-width: 600px"
      :rules="rules"
      :model="pwdData"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="原密码" prop="oldPassword">
        <el-input
          v-model="pwdData.oldPassword"
          style="width: 300px"
          type="password"
          placeholder="请输入原密码"
          show-password
          clearable
          maxlength="20"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="pwdData.newPassword"
          style="width: 300px"
          type="password"
          placeholder="请输入新密码"
          show-password
          clearable
          maxlength="20"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="pwdData.confirmPassword"
          style="width: 300px"
          type="password"
          placeholder="请确认新密码"
          show-password
          clearable
          maxlength="20"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="pwdDialogVisible = false">取消</el-button>
        <el-button @click="resetPwd()">重置</el-button>
        <el-button color="#626aef" @click="editPwd()"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
@import "../../public/fonts/font.css";
.logo-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.logo-container img {
  width: 60px;
}
.logo-container p {
  margin: 0;
  color: #fff;
  font-family: "SmileySans";
}
::v-deep(.el-header) {
  background-color: var(--theme-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  margin-bottom: 10px;
}
.drop-down-container {
  display: flex;
  align-items: center;
}
.drop-down-container .hello {
  color: #fff;
  margin-right: 15px;
  font-family: "SmileySans";
  font-size: 20px;
}
.drop-down-container .profile-picture {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
}
.el-dropdown,
.el-dropdown * {
  outline: none;
}
::v-deep(.is-active) {
  color: var(--theme-color) !important;
}
.pwd-dialog .el-form {
  height: 200px !important;
}
.info-dialog .el-form {
  height: 600px;
}
.time {
  display: flex;
  align-items: center;
  color: #fff;
  font-family: "SmileySans";
  font-size: 20px;
  margin-right: 50px;
  cursor: pointer;
}
.time img {
  width: 25px;
  height: 25px;
  margin-right: 5px;
}
.left-container {
  display: flex;
  align-items: center;
  color: #fff;
  font-family: "SmileySans";
  font-size: 20px;
}
.left-container .show-status {
  margin-left: 50px;
  display: flex;
  align-items: center;
}
.left-container .show-status img {
  width: 70px;
  height: 70px;
}
.left-container .show-status p {
  padding: 10px;
  border-radius: 10px;
  font-size: 18px;
}
.left-container .show-status .open {
  background-color: #fcd077;
  color: #91734e;
}
.left-container .show-status .close {
  background-color: #e15745;
}
.el-radio-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.el-radio {
  margin: 10px 0;
  width: 85%;
  height: 100px;
  position: relative;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  border: 2px solid #b7b6b6;
  transition: all 0.5s ease-in-out;
}
::v-deep .el-radio__label {
  font-weight: 800 !important;
  position: relative;
  bottom: 4px;
  font-size: 15px !important;
}
.open-radio::after {
  content: "餐厅进入营业状态，用户可以点餐，\a店铺外卖平台会自动接收订单";
  position: relative;
  top: 35px;
  right: 64px;
  word-wrap: break-word;
  white-space: pre;
  font-size: 18px;
  font-family: "SmileySans";
}
.close-radio::after {
  content: "餐厅进入打烊状态，用户无法点餐，\a店铺会暂停营业并且无法接收任何订单";
  position: relative;
  top: 35px;
  right: 64px;
  word-wrap: break-word;
  white-space: pre;
  font-size: 18px;
  font-family: "SmileySans";
}
::v-deep .el-radio__input.is-checked + .el-radio__label {
  color: var(--theme-color) !important;
}
::v-deep .el-radio__input .el-radio__inner {
  border-color: #b7b6b6 !important;
}
::v-deep .el-radio__input.is-checked .el-radio__inner {
  background: var(--theme-color) !important;
  border-color: var(--theme-color) !important;
}
.el-radio.is-checked {
  border: 2px solid var(--theme-color);
  box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px,
    rgba(0, 0, 0, 0.1) 0px 2px 4px 0px,
    rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
}
.bulb {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #9b9696;
  position: relative;
}
.bulb::before {
  content: "";
  width: 12px;
  height: 30px;
  background-color: #9b9696;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  top: -18px;
  display: block;
  border-top: 10px solid #000;
  border-radius: 10px;
  box-sizing: border-box;
}
</style>
