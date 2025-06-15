import { createWebHashHistory, createRouter } from "vue-router";
import Home from "@/components/Home.vue"
import SelectedAssets from "@/components/SelectedAssets.vue";

const routes = [
  {
    path: "/",
    component: Home,
    name: 'home'
  },
  {
    path: '/selected',
    component: SelectedAssets,
    name: 'selected'
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});


export default router;