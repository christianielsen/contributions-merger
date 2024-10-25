import { createRouter, createWebHistory } from "vue-router";
import Graph from "./src/pages/Graph.vue";
import URLImage from "./src/pages/URLImage.vue";
import Test from "./src/pages/Test.vue";

const routes = [
  {
    path: "/",
    component: Graph,
  },
  {
    path: "/urlimage",
    component: URLImage,
  },
  {
    path: "/test",
    component: Test,
  },
];

const router = createRouter({
  history: createWebHistory("/contributions-merger/"),
  routes,
});

export default router;
