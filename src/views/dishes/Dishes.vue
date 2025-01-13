<script setup>
import { nextTick, ref } from "vue";
import { useUserInfoStore } from "@/stores/userInfo";
const userInfoStore = useUserInfoStore();
import { ElMessage } from "element-plus";

import { useTokenStore } from "@/stores/token";
const tokenStore = useTokenStore();

import { getAllCategoryListService } from "@/api/category";
import {
  getDishesService,
  editDishesService,
  addDishesService,
  editStatusService,
  deleteDishesService,
} from "@/api/dishes";

import {
  CircleCheck,
  Warning,
  CirclePlusFilled,
  Search,
  Edit,
  ArrowUpBold,
  ArrowDownBold,
  Plus,
} from "@element-plus/icons-vue";

const activeName = ref(null);

const searchConditions = ref({
  name: "",
  status: "",
  category: "",
});

const allCategoryList = ref([
  {
    id: "",
    name: "",
    type: "",
    status: "",
    sort: "",
  },
]);
const getAllCategoryList = async () => {
  const type = 1;
  const result = await getAllCategoryListService(type);
  if (result.code === 0) {
    allCategoryList.value = result.data;
    activeName.value = allCategoryList.value[0].id;
  }
};
getAllCategoryList();

// {
//   id: "",
//   name: "",
//   category: "",
//   price: "",
//   image: "",
//   description: "",
//   status: "",
//   createTime: "",
//   updateTime: "",
//   createUser: {},
//   updateUser: {},
// },
const dishesList = ref([]);

const handleChange = () => {
  getDishes();
};
const emptyMsg = ref("");
const isEmpty = ref(false);
const getDishes = async () => {
  isEmpty.value = false;
  searchConditions.value.category = activeName.value;
  const result = await getDishesService(searchConditions.value);
  if (result.code === 0) {
    dishesList.value = result.data;
    if (result.data.length === 0) {
      isEmpty.value = true;
      if (name.value !== "" || status.value !== "") {
        emptyMsg.value = "还没有该菜品";
      } else {
        emptyMsg.value = "还没有上架菜品";
      }
    }
  }
};
getDishes();

// 搜索
const name = ref("");
const status = ref("");
const statusOptions = ref([
  {
    value: 1,
    label: "在售",
  },
  {
    value: 2,
    label: "停售",
  },
]);
const search = () => {
  searchConditions.value.name = name.value;
  searchConditions.value.status = status.value;
  getDishes();
};

// 编辑
const dialogVisible = ref(false);
const dialogTitle = ref("");
const dishesDataRef = ref({});
const dishesData = ref({
  id: "",
  name: "",
  category: "",
  price: "",
  description: "",
  status: "",
  image: "",
  flavorList: [],
});

const handleDialogClose = () => {
  dialogVisible.value = false;
  setTimeout(() => {
    reset();
  }, 100);
};

const checkPrice = (rule, value, callback) => {
  if (value < 0 || value > 9999) {
    callback(new Error("价格不能低于0或高于9999"));
  } else {
    callback();
  }
};

const rules = {
  name: [
    { required: true, message: "菜品名不能为空", trigger: ["blur", "change"] },
  ],
  category: [
    {
      required: true,
      message: "菜品类别不能为空",
      trigger: ["blur", "change"],
    },
  ],
  price: [
    {
      required: true,
      message: "菜品价格不能为空",
      trigger: ["blur", "change"],
    },
    {
      validator: checkPrice,
      trigger: ["blur", "change"],
    },
  ],

  status: [
    {
      required: true,
      message: "菜品销售状态不能为空",
      trigger: ["blur", "change"],
    },
  ],
};

const setDishes = (row) => {
  dishesData.value.id = row.id;
  dishesData.value.name = row.name;
  dishesData.value.category = row.category;
  dishesData.value.price = row.price;
  dishesData.value.description = row.description;
  dishesData.value.status = row.status;
  dishesData.value.image = row.image;
  dishesData.value.flavorList = JSON.parse(JSON.stringify(row.flavorList));
  flavor.value = JSON.parse(JSON.stringify(row.flavorList));
  inputValue.value = "";
  for (let index in flavor.value) {
    inputVisible.value.push(false);
  }
};

const editDishes = async () => {
  for (let index in flavor.value) {
    if (flavor.value[index].name === "" || flavor.value[index].value === "") {
      ElMessage.closeAll();
      ElMessage({
        message: "请补充完已有的口味名或标签",
        customClass: "custom-message",
        type: "error",
      });
      return;
    }
  }
  if (flavor.value.length !== 0) {
    dishesData.value.flavorList = flavor.value;
  }
  await dishesDataRef.value.validate(async (valid) => {
    if (valid) {
      const result = await editDishesService(dishesData.value);
      if (result.code === 0) {
        ElMessage.closeAll();
        ElMessage({
          message: "修改成功！",
          customClass: "custom-message",
          type: "success",
        });
        dialogVisible.value = false;
        getDishes();
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

// 修改口味
const inputRef = ref();
const inputValue = ref("");
const inputVisible = ref([]);

const flavor = ref([]);
const handleTagClose = (tag, index) => {
  const list = flavor.value[index].value
    .split(",")
    .filter((item) => item.trim() != "");
  list.splice(list.indexOf(tag), 1);
  flavor.value[index].value = list.join(",");
};

const showInput = (index) => {
  if (flavor.value[index].name === "") {
    ElMessage({
      message: "口味名称不能为空！",
      customClass: "custom-message",
      type: "error",
    });
    return;
  }
  inputVisible.value[index] = true;
  nextTick(() => {
    if (inputRef.value && inputRef.value.input) {
      inputRef.value.input.focus();
    }
  });
};

const handleInputConfirm = (index) => {
  if (inputValue.value) {
    flavor.value[index].value += "," + inputValue.value;
  }
  inputVisible.value[index] = false;
  inputValue.value = "";
};

const addFlavor = () => {
  const length = flavor.value.length;
  if (length === 3) {
    ElMessage({
      message: "最多只能有三种口味配置！",
      customClass: "custom-message",
      type: "error",
    });
    return;
  }
  for (let index in flavor.value) {
    if (flavor.value[index].name === "" || flavor.value[index].value === "") {
      ElMessage({
        message: "请补充完已有的口味名或标签再添加新配置！",
        customClass: "custom-message",
        type: "error",
      });
      return;
    }
  }
  flavor.value.push({
    name: "",
    value: "",
    dishId: dishesData.value.id,
  });
  inputVisible.value.push(false);
};

const deleteFlavor = (index) => {
  flavor.value.splice(index, 1);
};

// 添加
const reset = () => {
  dishesDataRef.value.resetFields();
  dishesData.value.id = "";
  dishesData.value.name = "";
  dishesData.value.category = "";
  dishesData.value.price = "";
  dishesData.value.description = "";
  dishesData.value.status = "";
  dishesData.value.image = "";
  dishesData.value.flavorList = [];
  flavor.value = [];
  inputValue.value = "";
  inputVisible.value = [];
};

const addDishes = async () => {
  for (let index in flavor.value) {
    if (flavor.value[index].name === "" || flavor.value[index].value === "") {
      ElMessage.closeAll();
      ElMessage({
        message: "请补充完已有的口味名或标签",
        customClass: "custom-message",
        type: "error",
      });
      return;
    }
  }
  if (flavor.value.length !== 0) {
    dishesData.value.flavorList = flavor.value;
  }
  await dishesDataRef.value.validate(async (valid) => {
    if (valid) {
      const result = await addDishesService(dishesData.value);
      if (result.code === 0) {
        ElMessage.closeAll();
        ElMessage({
          message: "添加菜品成功！",
          customClass: "custom-message",
          type: "success",
        });
        dialogVisible.value = false;
        getDishes();
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

// 修改状态
const setStatus = async (id, status) => {
  if (status === 1) {
    status = 2;
  } else {
    status = 1;
  }
  const result = await editStatusService(id, status);
  if (result.code === 0) {
    ElMessage.closeAll();
    ElMessage({
      message: "修改菜品状态成功！",
      customClass: "custom-message",
      type: "success",
    });
    getDishes();
  }
};

// 删除菜品
const deleteDishes = async (id) => {
  const result = await deleteDishesService(id);
  if (result.code === 0) {
    ElMessage.closeAll();
    ElMessage({
      message: "删除菜品成功！",
      customClass: "custom-message",
      type: "success",
    });
    getDishes();
  }
};

// 上传图片
const handleUploadSuccess = (result) => {
  dishesData.value.image = result.data;
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
</script>

<template>
  <el-card style="max-width: 100%">
    <template #header>
      <p>菜品管理</p>
      <div>
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
                dialogTitle = '添加菜品';
                reset();
              "
              :disabled="userInfoStore.userInfo.position !== '管理员'"
              >添加菜品</el-button
            >
          </template>
        </el-popover>
      </div>
    </template>

    <div class="body-top">
      <div class="search-area">
        <el-input
          v-model="name"
          style="width: 160px"
          placeholder="请输入菜品名称"
          clearable
        />
        <el-select
          v-model="status"
          placeholder="请选择菜品状态"
          style="width: 200px"
          clearable
        >
          <el-option
            v-for="item in statusOptions"
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
        />
      </div>
    </div>
    <div>
      <el-tabs
        type="border-card"
        v-model="activeName"
        tab-position="left"
        @tab-change="handleChange"
      >
        <el-tab-pane
          v-for="(item, index) in allCategoryList"
          :key="index"
          :label="item.name"
          :name="item.id"
        >
          <el-table
            class="custom-table"
            :data="dishesList"
            empty-text=""
            :row-class-name="tableRowClassName"
          >
            <template #empty>
              <el-empty
                v-if="isEmpty"
                image-size="300"
                image="../../../public/images/icon/empty.png"
                :description="item.name + emptyMsg"
              ></el-empty>
            </template>
            <el-table-column prop="name" label="菜品名" width="150" />
            <el-table-column label="描述" width="150">
              <template #default="{ row }">
                {{ row.description === "" ? "无" : row.description }}
              </template>
            </el-table-column>
            <el-table-column prop="price" label="价格" width="100">
              <template #default="{ row }"> ￥{{ row.price }} </template>
            </el-table-column>
            <el-table-column label="状态" width="130">
              <template #default="{ row }">
                <el-icon v-if="row.status === 1" color="#349c5e"
                  ><CircleCheck
                /></el-icon>
                <el-icon v-if="row.status === 2" color="#f25a47"
                  ><Warning
                /></el-icon>
                <div class="status">
                  {{ row.status === 1 ? "在售" : "停售" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="上架时间" width="130" />
            <el-table-column prop="updateTime" label="更新时间" width="130" />
            <el-table-column label="创建用户" width="120">
              <template #default="{ row }">
                <p>
                  {{ row.createUser.name }}（{{ row.createUser.username }}）
                </p>
              </template>
            </el-table-column>
            <el-table-column label="更新用户" width="120">
              <template #default="{ row }">
                <p>
                  {{ row.updateUser.name }}（{{ row.updateUser.username }}）
                </p>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-popover
                  :width="80"
                  trigger="hover"
                  :disabled="userInfoStore.userInfo.position === '管理员'"
                >
                  <div class="custom-popover">你不是管理员，无法操作</div>
                  <template #reference>
                    <el-button
                      type="success"
                      size="small"
                      :disabled="userInfoStore.userInfo.position !== '管理员'"
                      @click.stop="
                        dialogVisible = true;
                        dialogTitle = '编辑菜品';
                        setDishes(row);
                      "
                    >
                      编辑
                    </el-button>
                  </template>
                </el-popover>
                <el-popover
                  :width="80"
                  trigger="hover"
                  :disabled="userInfoStore.userInfo.position === '管理员'"
                >
                  <div class="custom-popover">你不是管理员，无法操作</div>
                  <template #reference>
                    <el-button
                      :type="row.status === 1 ? 'danger' : 'success'"
                      size="small"
                      :disabled="userInfoStore.userInfo.position !== '管理员'"
                      @click.stop="setStatus(row.id, row.status)"
                    >
                      {{ row.status === 1 ? "禁售" : "启售" }}
                    </el-button>
                  </template>
                </el-popover>
                <el-popconfirm
                  width="220"
                  title="你确定要删除该分类吗？"
                  @cancel="onCancel"
                  @confirm="deleteDishes(row.id)"
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
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>

  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="1000"
    :before-close="handleDialogClose"
  >
    <el-form
      ref="dishesDataRef"
      style="max-width: 1000px"
      :rules="rules"
      :model="dishesData"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="菜品名" prop="name">
        <el-input
          v-model="dishesData.name"
          style="width: 300px"
          placeholder="请输入菜品名"
          clearable
        />
      </el-form-item>
      <el-form-item label="价格（元）" prop="price">
        <el-input
          type="number"
          v-model="dishesData.price"
          style="width: 300px"
          placeholder="请输入菜品价格"
          clearable
        />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="dishesData.description"
          style="width: 300px"
          placeholder="请输入对该菜品的描述"
          clearable
          type="textarea"
          maxlength="30"
        />
      </el-form-item>
      <el-form-item label="口味配置">
        <el-table
          :data="flavor"
          style="width: 800px"
          class="flavor-table"
          empty-text="还没有口味设置"
        >
          <el-table-column label="口味名（如忌口、辣度等）" width="250">
            <template #default="{ row }">
              <el-input
                v-model="row.name"
                style="width: 100px"
                clearable
                maxlength="3"
              />
            </template>
          </el-table-column>
          <el-table-column label="口味标签（如微辣、重辣等）">
            <template #default="scope">
              <el-tag
                v-for="tag in scope.row.value
                  .split(',')
                  .filter((item) => item.trim() != '')"
                :key="tag"
                size="large"
                closable
                :disable-transitions="false"
                @close="handleTagClose(tag, scope.$index)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                ref="inputRef"
                v-if="inputVisible[scope.$index]"
                v-model="inputValue"
                size="small"
                style="width: 100px"
                maxlength="5"
                @keyup.enter="handleInputConfirm(scope.$index)"
                @blur="handleInputConfirm(scope.$index)"
              />
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(scope.$index)"
              >
                + 添加标签
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button type="danger" @click="deleteFlavor(scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-button type="success" class="add-flavor" @click="addFlavor"
          >添加口味配置</el-button
        >
      </el-form-item>
      <el-form-item label="菜品图片" prop="image">
        <el-upload
          :auto-upload="true"
          :show-file-list="false"
          action="/api/upload"
          name="file"
          :headers="{ Authorization: tokenStore.token }"
          :on-success="handleUploadSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img width="100%" v-if="dishesData.image" :src="dishesData.image" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="类别" prop="category">
        <el-select
          v-model="dishesData.category"
          placeholder="请选择类别"
          style="width: 240px"
        >
          <el-option
            v-for="item in allCategoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="销售状态" prop="status">
        <el-radio-group v-model="dishesData.status">
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
          @click="dialogTitle === '添加菜品' ? addDishes() : editDishes()"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
::v-deep .el-tabs .el-tabs__item {
  color: #000;
  height: 50px;
  justify-content: center;
}
::v-deep .el-tabs .is-active {
  font-weight: 600 !important;
}
.search-area {
  width: 35%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.el-form {
  min-height: 600px;
  height: 700px;
  overflow-y: scroll;
}
.el-form .el-form-item {
  margin-bottom: 25px !important;
}
.el-tag {
  margin: 5px 0;
  margin-right: 10px;
}
.add-flavor {
  position: relative;
  left: 82%;
  margin: 10px 0;
}
</style>
