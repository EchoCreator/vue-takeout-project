<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
// 登录表单
const registerDataRef = ref({});
const registerData = ref({
  username: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
});

const reset = (ref) => {
  ref.resetFields();
};

const checkConfirmPassword = (rule, value, callback) => {
  if (value !== registerData.value.password) {
    callback(new Error("两次输入的密码不一致，请重新输入！"));
  } else {
    callback();
  }
};

const rules = {
  username: [
    { required: true, message: "用户名不能为空", trigger: ["blur", "change"] },
    {
      pattern: /[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
      message: "用户名必须由汉字、数字、字母或下划线组成",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^.{3,12}$/,
      message: "用户名长度必须由3-12个字符组成",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^(?!_)(?!.*?_$)[^_]*_?[^_]*$/,
      message: "下划线不能在开头和结尾",
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
  password: [
    { required: true, message: "密码不能为空", trigger: ["blur", "change"] },
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
</script>

<template>
  <div class="register-container">
    <el-form
      ref="registerDataRef"
      style="max-width: 600px"
      :rules="rules"
      :model="registerData"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
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
        <h1 class="title">注册一个新的账号</h1>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="registerData.username"
          style="width: 300px"
          placeholder="请输入用户名"
          clearable
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phoneNumber">
        <el-input
          v-model="registerData.phoneNumber"
          style="width: 300px"
          placeholder="请输入手机号"
          clearable
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="registerData.password"
          style="width: 300px"
          type="password"
          placeholder="请输入密码"
          show-password
          clearable
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="registerData.confirmPassword"
          style="width: 300px"
          type="password"
          placeholder="请确认密码"
          show-password
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button color="var(--theme-color)" type="primary" @click="login"
          >登录</el-button
        >
        <el-button @click="reset(registerDataRef)">重置</el-button>
      </el-form-item>
      <el-form-item>
        <p class="click-p" @click="router.push('/login')">已有账号？点击登录</p>
        <div class="underline"></div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
@import "../../public/fonts/font.css";
.register-container {
  width: 100%;
  height: 100%;
  background: url("../../public/images/background/register.jpg") no-repeat;
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
.register-container p {
  margin: 0;
  font-size: 20px;
}
.register-container .logo {
  width: 100px;
  margin-right: 10px;
}
.register-container .title,
.register-container .click-p {
  color: #fff;
}
.register-container .click-p {
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.register-container .click-p:hover {
  transform: scale(1.1, 1.1);
}
.underline {
  width: 100%;
  height: 2px;
  border-radius: 2px;
  background-color: var(--theme-color);
  position: relative;
  bottom: 3px;
  transform: scale(0, 0);
  transition: all 0.3s ease;
}
.register-container .click-p:hover + .underline {
  transform: scale(1.1, 1.1);
}
::v-deep(.el-form) {
  width: 530px;
  height: 700px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
::v-deep(.el-form-item__label) {
  color: #fff;
  font-size: 16px;
}
</style>
