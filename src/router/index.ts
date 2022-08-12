import { isLoggedIn } from "@/firebase/auth";
import LoginView from "@/views/LoginView.vue";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

declare module "vue-router" {
  interface RouteMeta {
    noAuth?: boolean;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/programmes",
      name: "programmes",
      component: () => import("../views/ProgrammesListView.vue"),
    },
    {
      path: "/programmes/:id",
      component: () => import("../views/programmes/ProgrammeView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { noAuth: true },
    },
  ],
});

router.beforeEach((to, from) => {
  if (!to.meta.noAuth && !isLoggedIn()) {
    return {
      name: "login",
      query: { redirect: to.fullPath },
    };
  }
});

export default router;
