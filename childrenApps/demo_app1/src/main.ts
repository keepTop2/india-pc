import { createApp, Directive } from "vue";
import store from "/@/stores/index";
import App from "/@/App.vue";
import router from "/@/router";
import "/@/permission";

import { i18n, setElementLang } from "/@/i18n/index";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";

import VueGridLayout from "vue-grid-layout";

import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import VCalendar from "v-calendar";
import "v-calendar/style.css";

import "virtual:svg-icons-plugin-register";
const app = createApp(App);

app.use(VCalendar, {});
app.use(store);

// app.use(CommonPlugin);
app
	.use(ElementPlus, {
		locale: setElementLang(),
	})
	.use(i18n)
	.use(VueGridLayout)
	.use(router)
	.mount("#app");

export default app;
