import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "@/entities/user";
import { DashboardPage } from "@/pages/dashboard";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "dashboard",
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
    meta: { requiresGuest: true },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterPage,
    meta: { requiresGuest: true },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "login" });
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: "dashboard" });
  } else {
    next();
  }
});
