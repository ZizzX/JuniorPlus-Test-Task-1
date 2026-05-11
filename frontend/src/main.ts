import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { i18n } from "@/shared/lib/i18n";
import { router } from "./app/router";
import "./app/index.css";
import App from "./app/App.vue";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(VueQueryPlugin);
app.use(i18n);
app.use(router);
app.mount("#app");
