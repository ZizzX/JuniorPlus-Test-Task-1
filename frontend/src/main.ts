import { createApp } from "vue";
import { createPinia } from "pinia";
import { router } from "./app/router";
import "./app/index.css";
import App from "./app/App.vue";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount("#app");
