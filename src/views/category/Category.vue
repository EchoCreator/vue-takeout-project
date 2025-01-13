<script setup>
import { ref } from "vue";
import {
  getCategoryListService,
  setStatusService,
  editCategoryService,
  getAllCategoryListService,
  editSortService,
  addCategoryService,
  deleteCategoryService,
} from "@/api/category";
import { useUserInfoStore } from "@/stores/userInfo";
const userInfoStore = useUserInfoStore();
import { ElMessage } from "element-plus";

import {
  CircleCheck,
  Warning,
  CirclePlusFilled,
  Search,
  Edit,
  ArrowUpBold,
  ArrowDownBold,
} from "@element-plus/icons-vue";

const categoryList = ref([
  {
    name: "",
    type: "",
    status: "",
    createTime: "",
    updateTime: "",
    createUser: {},
    updateUser: {},
  },
]);
const searchConditions = ref({
  pageNum: 1,
  pageSize: 5,
  type: 1,
  name: "",
  status: "",
});
const total = ref(0);
const isEmpty = ref(false);
const getCategoryList = async () => {
  isEmpty.value = false;
  const result = await getCategoryListService(searchConditions.value);
  if (result.code === 0) {
    categoryList.value = result.data.list;
    total.value = result.data.total;
    if (result.data.list.length === 0) {
      isEmpty.value = true;
    }
  }
};
getCategoryList();

const setPageNum = (value) => {
  searchConditions.value.pageNum = value;
  getCategoryList();
};

const activeName = ref("first");
const handleChange = () => {
  if (activeName.value === "first") {
    searchConditions.value.type = 1;
  } else {
    searchConditions.value.type = 2;
  }
  getCategoryList();
};

// 搜索
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
const status = ref("");
const name = ref("");
const search = () => {
  searchConditions.value.pageNum = 1;
  searchConditions.value.name = name;
  searchConditions.value.status = status;
  getCategoryList();
};

// 修改状态
const setStatus = async (id, status) => {
  const newStatus = status === 1 ? 2 : 1;
  const result = await setStatusService(id, newStatus);
  if (result.code === 0) {
    ElMessage.closeAll();
    ElMessage({
      message: "修改状态成功！",
      customClass: "custom-message",
      type: "success",
    });
    getCategoryList();
  }
};

// 编辑
const dialogVisible = ref(false);
const dialogTitle = ref("");
const typeOptions = ref([
  {
    value: 1,
    label: "菜品分类",
  },
  {
    value: 2,
    label: "套餐分类",
  },
]);
const categoryDataRef = ref({});
const categoryData = ref({
  id: "",
  name: "",
  type: "",
  status: "",
});
const setCategory = (row) => {
  categoryData.value.id = row.id;
  categoryData.value.name = row.name;
  categoryData.value.type = row.type;
  categoryData.value.status = row.status;
};
const rules = {
  name: [
    { required: true, message: "类名不能为空", trigger: ["blur", "change"] },
  ],
  type: [
    {
      required: true,
      message: "类别不能为空",
      trigger: ["blur", "change"],
    },
  ],
  status: [
    {
      required: true,
      message: "状态不能为空",
      trigger: ["blur", "change"],
    },
  ],
};

const editCategory = async () => {
  await categoryDataRef.value.validate(async (valid, fileds) => {
    if (valid) {
      const result = await editCategoryService(categoryData.value);
      if (result.code === 0) {
        ElMessage.closeAll();
        ElMessage({
          message: "编辑分类成功！",
          customClass: "custom-message",
          type: "success",
        });
        dialogVisible.value = false;
        getCategoryList();
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

// 添加
const reset = () => {
  categoryDataRef.value.resetFields();
  categoryData.value.id = "";
  categoryData.value.name = "";
  categoryData.value.type = "";
  categoryData.value.status = "";
};

const addCategory = async () => {
  await categoryDataRef.value.validate(async (valid) => {
    if (valid) {
      const result = await addCategoryService(categoryData.value);
      if (result.code === 0) {
        ElMessage.closeAll();
        ElMessage({
          message: "添加分类成功！",
          customClass: "custom-message",
          type: "success",
        });
        dialogVisible.value = false;
        getCategoryList();
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

// 删除
const deleteCategory = async (id) => {
  const result = await deleteCategoryService(id);
  console.log(result);

  if (result.code === 0) {
    ElMessage.closeAll();
    ElMessage({
      message: "删除分类成功！",
      customClass: "custom-message",
      type: "success",
    });
    dialogVisible.value = false;
    getCategoryList();
  }
};

// 编辑分类顺序
const sortDialogVisible = ref(false);
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
  const type = "";
  const result = await getAllCategoryListService(type);
  if (result.code === 0) {
    allCategoryList.value = result.data;
  }
};
const sortList = ref([]);
const moveUP = (index, row) => {
  const preId = allCategoryList.value[index - 1].id;
  const preSort = allCategoryList.value[index - 1].sort;

  // 在sortList中交换sort，保存sort修改的记录
  const curIndex = sortList.value.findIndex((item) => item.id === row.id);
  if (curIndex === -1) {
    sortList.value.push({ id: row.id, sort: preSort });
  } else {
    sortList.value[curIndex].sort = preSort;
  }

  const preIndex = sortList.value.findIndex((item) => item.id === preId);
  if (preIndex === -1) {
    sortList.value.push({
      id: preId,
      sort: row.sort,
    });
  } else {
    sortList.value[preIndex].sort = row.sort;
  }

  // 在原数组中交换sort
  allCategoryList.value[index - 1].sort = row.sort;
  allCategoryList.value[index].sort = preSort;

  // 通过这种方式，才能实施在页面上更新数组元素的移动
  allCategoryList.value.splice(index - 1, 0, row);
  allCategoryList.value.splice(index + 1, 1);
};

const moveDown = (index, row) => {
  const afterId = allCategoryList.value[index + 1].id;
  const afterSort = allCategoryList.value[index + 1].sort;

  const curIndex = sortList.value.findIndex((item) => item.id === row.id);
  if (curIndex === -1) {
    sortList.value.push({ id: row.id, sort: afterSort });
  } else {
    sortList.value[curIndex].sort = afterSort;
  }

  const afterIndex = sortList.value.findIndex((item) => item.id === afterId);
  if (afterIndex === -1) {
    sortList.value.push({
      id: afterId,
      sort: row.sort,
    });
  } else {
    sortList.value[afterIndex].sort = row.sort;
  }

  allCategoryList.value[index + 1].sort = row.sort;
  allCategoryList.value[index].sort = afterSort;

  allCategoryList.value.splice(index, 1);
  allCategoryList.value.splice(index + 1, 0, row);
};

const editSort = async () => {
  const result = await editSortService(sortList.value);
  if (result.code === 0) {
    ElMessage.closeAll();
    ElMessage({
      message: "分类顺序修改成功！",
      customClass: "custom-message",
      type: "success",
    });
    sortDialogVisible.value = false;
    getCategoryList();
  }
};
</script>

<template>
  <el-card style="max-width: 100%">
    <template #header>
      <p>分类管理</p>
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
              :icon="Edit"
              @click="
                sortDialogVisible = true;
                getAllCategoryList();
                sortList = [];
              "
              :disabled="userInfoStore.userInfo.position !== '管理员'"
              >编辑分类顺序</el-button
            >
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
              color="#626aef"
              :icon="CirclePlusFilled"
              @click="
                dialogVisible = true;
                dialogTitle = '添加分类';
                reset();
              "
              :disabled="userInfoStore.userInfo.position !== '管理员'"
              >添加分类</el-button
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
          placeholder="请输入分类名称"
          clearable
        />
        <el-select
          v-model="status"
          placeholder="请选择分类状态"
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
          :current-page="searchConditions.pageNum"
        />
      </div>
    </div>
    <div>
      <el-tabs
        v-model="activeName"
        class="demo-tabs"
        @tab-click="handleClick"
        @tab-change="handleChange"
      >
        <el-tab-pane label="菜品分类" name="first">
          <el-table
            class="custom-table category-table"
            :data="categoryList"
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
            <el-table-column prop="name" label="类名" width="150" />
            <el-table-column prop="type" label="类别" width="150">
              <template #default="{ row }">
                {{ row.type === 1 ? "菜品分类" : "套餐分类" }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="150">
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
            <el-table-column prop="createTime" label="上架时间" width="200" />
            <el-table-column prop="updateTime" label="更新时间" width="200" />
            <el-table-column label="创建用户" width="180">
              <template #default="{ row }">
                <p>
                  {{ row.createUser.name }}（{{ row.createUser.username }}）
                </p>
              </template>
            </el-table-column>
            <el-table-column label="更新用户" width="180">
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
                        dialogTitle = '编辑分类';
                        setCategory(row);
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
                  @confirm="deleteCategory(row.id)"
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
        <el-tab-pane label="套餐分类" name="second">
          <el-table
            class="custom-table category-table"
            :data="categoryList"
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
            <el-table-column prop="name" label="类名" width="150" />
            <el-table-column prop="type" label="类别" width="150">
              <template #default="{ row }">
                {{ row.type === 1 ? "菜品分类" : "套餐分类" }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="150">
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
            <el-table-column prop="createTime" label="上架时间" width="200" />
            <el-table-column prop="updateTime" label="更新时间" width="200" />
            <el-table-column label="创建用户" width="180">
              <template #default="{ row }">
                <p>
                  {{ row.createUser.name }}（{{ row.createUser.username }}）
                </p>
              </template>
            </el-table-column>
            <el-table-column label="更新用户" width="180">
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
                        dialogTitle = '编辑分类';
                        setCategory(row);
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
                  @confirm="deleteCategory(row.id)"
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
    width="500"
    :before-close="handleClose"
  >
    <el-form
      ref="categoryDataRef"
      style="max-width: 600px"
      :rules="rules"
      :model="categoryData"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="类名" prop="name">
        <el-input
          v-model="categoryData.name"
          style="width: 300px"
          placeholder="请输入类名"
          clearable
        />
      </el-form-item>
      <el-form-item label="类别" prop="type">
        <el-select
          v-model="categoryData.type"
          placeholder="请选择类别"
          style="width: 240px"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="账号状态" prop="status">
        <el-radio-group v-model="categoryData.status">
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
          @click="dialogTitle === '添加分类' ? addCategory() : editCategory()"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
    v-model="sortDialogVisible"
    title="编辑分类顺序"
    width="720"
    :before-close="handleClose"
  >
    <el-table
      class="custom-table category-table sort-table"
      :data="allCategoryList"
      empty-text="结果空空如也"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="index" width="100" label="序号" />
      <el-table-column prop="name" label="类名" width="120" />
      <el-table-column prop="type" label="类别" width="150">
        <template #default="{ row }">
          {{ row.type === 1 ? "菜品分类" : "套餐分类" }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150">
        <template #default="{ row }">
          <el-icon v-if="row.status === 1" color="#349c5e"
            ><CircleCheck
          /></el-icon>
          <el-icon v-if="row.status === 2" color="#f25a47"><Warning /></el-icon>
          <div class="status">
            {{ row.status === 1 ? "在售" : "停售" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            :disabled="scope.$index === 0"
            type="warning"
            size="small"
            :icon="ArrowUpBold"
            @click="moveUP(scope.$index, scope.row)"
          />
          <el-button
            :disabled="scope.$index === allCategoryList.length - 1"
            type="warning"
            size="small"
            :icon="ArrowDownBold"
            @click="moveDown(scope.$index, scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="sortDialogVisible = false">取消</el-button>
        <el-button color="#626aef" type="primary" @click="editSort()">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.search-area {
  width: 35%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.el-form {
  height: 230px;
}
</style>
