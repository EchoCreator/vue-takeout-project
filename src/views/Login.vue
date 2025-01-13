<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeftBold, ArrowRightBold } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const router = useRouter();

const loginByUsername = ref(true);

// 登录表单
const loginUsernameDataRef = ref({});
const loginUsernameData = ref({
  username: "",
  password: "",
});

const loginPwdDataRef = ref({});
const loginPwdData = ref({
  phoneNumber: "",
  verificationCode: "",
});

const reset = (ref) => {
  ref.resetFields();
};

const rules = {
  username: [
    { required: true, message: "用户名不能为空", trigger: ["blur", "change"] },
    // {
    //   pattern: /[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
    //   message: "用户名必须由汉字、数字、字母或下划线组成",
    //   trigger: ["blur", "change"],
    // },
    // {
    //   pattern: /^.{3,12}$/,
    //   message: "用户名长度必须由3-12个字符组成",
    //   trigger: ["blur", "change"],
    // },
    // {
    //   pattern: /^(?!_)(?!.*?_$)[^_]*_?[^_]*$/,
    //   message: "下划线不能在开头和结尾",
    //   trigger: ["blur", "change"],
    // },
  ],
  password: [
    { required: true, message: "密码不能为空", trigger: ["blur", "change"] },
    // {
    //   pattern: /^[a-zA-Z0-9_-]+$/,
    //   message: "密码必须由字母、数字、下划线或连字符组成",
    //   trigger: ["blur", "change"],
    // },
    {
      pattern: /^.{5,20}$/,
      message: "密码长度必须由5-20个字符组成",
      trigger: ["blur", "change"],
    },
  ],
  phoneNumber: [
    { required: true, message: "手机号不能为空", trigger: ["blur", "change"] },
    {
      pattern:
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
      message: "手机号格式不正确",
      trigger: ["blur", "change"],
    },
  ],
  verificationCode: [
    { required: true, message: "验证码不能为空", trigger: ["blur", "change"] },
  ],
};

import { employeeLoginService } from "@/api/employee";
import { useTokenStore } from "@/stores/token";
import { useUserInfoStore } from "@/stores/userInfo";
const tokenStore = useTokenStore();
const userInfoStore = useUserInfoStore();
const login = async (ref, data) => {
  ElMessage.closeAll();
  await ref.validate(async (valid, fields) => {
    if (valid) {
      const result = await employeeLoginService(data);
      if (result.code === 0) {
        router.push("/");
        ElMessage({
          message: "登录成功！",
          customClass: "custom-message",
          type: "success",
        });
        tokenStore.setToken(result.data.token);
        userInfoStore.setUserInfo(result.data);
      } else {
        ElMessage({
          message: result.message,
          customClass: "custom-message",
          type: "error",
        });
      }
    }
  });
};
</script>

<template>
  <div class="login-container">
    <el-form
      ref="loginUsernameDataRef"
      style="max-width: 600px"
      :rules="rules"
      :model="loginUsernameData"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
      :class="loginByUsername ? '' : 'hidden-username'"
    >
      <el-form-item>
        <div class="logo-container">
          <img
            class="logo"
            src="../../public/images/icon/logo-white.png"
            alt=""
          />
          <p>暖心送</p>
        </div>
      </el-form-item>
      <el-form-item>
        <h1 class="title">登录你的账号</h1>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="loginUsernameData.username"
          style="width: 300px"
          placeholder="请输入用户名"
          clearable
        />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          v-model="loginUsernameData.password"
          style="width: 300px"
          type="password"
          placeholder="请输入密码"
          show-password
          clearable
        />
      </el-form-item>
      <el-form-item>
        <div
          class="go-to-phone"
          @click="
            loginByUsername = false;
            reset(loginUsernameDataRef);
          "
        >
          <p>手机号登录</p>
          <img src="../../public/images/icon/right.png" alt="" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          color="var(--theme-color)"
          type="primary"
          @click="login(loginUsernameDataRef, loginUsernameData)"
          >登录</el-button
        >
        <el-button @click="reset(loginUsernameDataRef)">重置</el-button>
      </el-form-item>
      <el-form-item>
        <p class="click-p" @click="router.push('/register')">
          还没有账号？点击注册
        </p>
        <div class="underline"></div>
      </el-form-item>
    </el-form>

    <el-form
      ref="loginPwdDataRef"
      style="max-width: 600px"
      :rules="rules"
      :model="loginPwdData"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
      :class="loginByUsername ? 'hidden-phone' : ''"
    >
      <el-form-item>
        <div class="logo-container">
          <img
            class="logo"
            src="../../public/images/icon/logo-white.png"
            alt=""
          />
          <p>暖心送</p>
        </div>
      </el-form-item>
      <el-form-item>
        <h1 class="title">登录你的账号</h1>
      </el-form-item>
      <el-form-item label="手机号" prop="phoneNumber">
        <el-input
          v-model="loginPwdData.phoneNumber"
          style="width: 300px"
          placeholder="请输入手机号"
          clearable
        />
      </el-form-item>

      <el-form-item label="验证码" prop="verificationCode">
        <el-input
          v-model="loginPwdData.verificationCode"
          style="width: 300px"
          type="password"
          placeholder="请输入验证码"
          show-password
          clearable
        />
      </el-form-item>
      <el-form-item>
        <div
          class="go-to-username"
          @click="
            loginByUsername = true;
            reset(loginPwdDataRef);
          "
        >
          <img src="../../public/images/icon/left.png" alt="" />
          <p>用户名登录</p>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button color="var(--theme-color)" type="primary" @click="login"
          >登录</el-button
        >
        <el-button @click="reset(loginPwdDataRef)">重置</el-button>
      </el-form-item>
      <el-form-item>
        <p class="click-p" @click="router.push('/register')">
          还没有账号？点击注册
        </p>
        <div class="underline"></div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
@import "../../public/fonts/font.css";
.login-container {
  width: 100%;
  height: 100%;
  background: url("../../public/images/background/login.jpg") no-repeat;
  background-size: 100% 100%;
}
.logo-container {
  display: flex;
  flex-direction: column;
  color: #fff;
  align-items: center;
  justify-content: center;
  margin-bottom: -20px;
  font-family: "SmileySans";
}
.logo-container p {
  margin: 0;
  font-size: 20px;
}
.login-container .logo {
  width: 100px;
  margin-right: 10px;
}
.login-container .title,
.login-container .click-p {
  color: #fff;
}
.login-container .click-p {
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.login-container .click-p:hover {
  transform: scale(1.1, 1.1);
}
.underline {
  width: 100%;
  height: 2px;
  border-radius: 2px;
  background-color: var(--theme-color);
  position: relative;
  bottom: 18px;
  transform: scale(0, 0);
  transition: all 0.3s ease;
}
.login-container .click-p:hover + .underline {
  transform: scale(1.1, 1.1);
}
::v-deep(.el-form) {
  width: 510px;
  height: 660px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.5s ease-in-out;
}
::v-deep(.el-form-item__label) {
  color: #fff;
  font-size: 16px;
}
::v-deep(.hidden-username) {
  left: 30% !important;
  opacity: 0;
  visibility: hidden;
  z-index: -99;
}
::v-deep(.hidden-phone) {
  left: 70% !important;
  opacity: 0;
  visibility: hidden;
  z-index: -99;
}
.go-to-username,
.go-to-phone {
  cursor: pointer;
  color: #fff;
  display: flex;
  align-items: center;
  font-size: 16px;
}
.go-to-username img {
  width: 30px;
  position: relative;
  margin-right: 5px;
}
.go-to-phone img {
  width: 30px;
  position: relative;
  margin-left: 5px;
}
.go-to-username:hover img {
  animation: go-to-username 1s ease-in-out infinite alternate;
}
.go-to-phone:hover img {
  animation: go-to-phone 1s ease-in-out infinite alternate;
}
@keyframes go-to-username {
  0% {
    right: 0;
  }
  100% {
    right: 15px;
  }
}
@keyframes go-to-phone {
  0% {
    right: 0;
  }
  100% {
    right: -15px;
  }
}
</style>
