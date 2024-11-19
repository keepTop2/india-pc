import "v-calendar/style.css";
import "virtual:svg-icons-register";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import "/@/permission";
import "/@/styles/app.css";
import "/@/styles/index.scss";

import { Directive, createApp } from "vue";

import App from "/@/App.vue";
import VCalendar from "v-calendar";
import VueVirtualScroller from "vue-virtual-scroller";
import directives from "./directive/index";
import { i18n } from "/@/i18n/index";
import router from "/@/router";
import store from "/@/stores/index";

window.__VUE_PROD_DEVTOOLS__ = false;
window.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;
const app = createApp(App);

// 循环注册指令
Object.keys(directives).forEach((key) => {
	app.directive(key, (directives as { [key: string]: Directive })[key]);
});
app.use(VueVirtualScroller);
app.use(VCalendar, {});
app.use(store);

app.use(i18n).use(router).mount("#app");
// .use(VueGridLayout)

export default app;
