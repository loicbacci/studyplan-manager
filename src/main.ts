import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "flowbite";

// Bulma
//import "bulma/css/bulma.css";

// Tailwind
import "./assets/index.css";

// ElementPlus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import VueFeather from "vue-feather";

const app = createApp(App);

app.use(router);
app.use(ElementPlus);
app.component(VueFeather.name, VueFeather);

app.mount("#app");
