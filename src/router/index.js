import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const guardProtectedRoute = async (to, from, next) => {
  const isAuthenticated = await store.dispatch("userModule/loginWithToken");
  if (isAuthenticated.success) {
    next();
  } else {
    next("/");
  }
};

const guardAdminProtectedRoute = async (to, from, next) => {
  const isAuthenticated = await store.dispatch("userModule/loginWithToken");
  if (isAuthenticated.success && isAuthenticated.data.isAdmin) {
    next();
  } else {
    next("/products");
  }
};

const guardPublicRoute = async (to, from, next) => {
  const isAuthenticated = await store.dispatch("userModule/loginWithToken");
  if (isAuthenticated.success) {
    next("/products");
  } else {
    next();
  }
};

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    beforeEnter: guardPublicRoute
  },
  {
    path: "/products",
    name: "Products",
    component: () => import("../views/Products.vue"),
    beforeEnter: guardProtectedRoute
  },
  {
    path: "/users",
    name: "Users",
    component: () => import("../views/Users.vue"),
    beforeEnter: guardAdminProtectedRoute
  },
  {
    path: "/shops",
    name: "Shops",
    component: () => import("../views/Shops.vue"),
    beforeEnter: guardAdminProtectedRoute
  },
  {
    path: "/shopping-list",
    name: "Shopping List",
    component: () => import("../views/ShoppingList.vue"),
    beforeEnter: guardAdminProtectedRoute
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
