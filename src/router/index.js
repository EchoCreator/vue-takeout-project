import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/Home.vue"),
      redirect: "/workbench",
      children: [
        {
          path: "/workbench",
          name: "workbench",
          component: () => import("@/views/workbench/Workbench.vue"),
        },
        {
          path: "/data",
          name: "data",
          component: () => import("@/views/data/Data.vue"),
        },
        {
          path: "/order",
          name: "order",
          component: () => import("@/views/order/Order.vue"),
        },
        {
          path: "/bundle",
          name: "bundle",
          component: () => import("@/views/bundle/Bundle.vue"),
        },
        {
          path: "/dishes",
          name: "dishes",
          component: () => import("@/views/dishes/Dishes.vue"),
        },
        {
          path: "/category",
          name: "category",
          component: () => import("@/views/category/Category.vue"),
        },
        {
          path: "/employee",
          name: "employee",
          component: () => import("@/views/employee/Employee.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("@/views/Login.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/Register.vue"),
    },
  ],
});
