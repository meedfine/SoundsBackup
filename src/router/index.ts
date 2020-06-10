import Vue from "vue";
import VueRouter from "vue-router";
import CommonLayout from "../components/Layout/Common.vue";

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return (originalPush.call(this, location) as any).catch(err => err);
};

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/findMusic"
  },
  {
    path: "/findMusic",
    component: CommonLayout,
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/FindMusic/Index.vue")
      }
    ]
  },
  {
    path: "/localMusic",
    component: CommonLayout,
    children: [
      {
        path: "",
        name: "LocalMusic",
        component: () => import("@/views/LocalMusic/Index.vue")
      }
    ]
  },
  {
    path: "/trayMenu",
    name: "trayMenu",
    component: () => import("@/views/Tray/Tray.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
