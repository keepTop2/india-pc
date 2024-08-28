import { createApp, Directive } from "vue";
import store from "/@/stores/index";
import App from "/@/App.vue";
import router from "/@/router";
import "/@/permission";
import * as directives from "/@/directive/index";
import { i18n } from "/@/i18n/index";

import "virtual:svg-icons-plugin-register";
import "/@/styles/app.css";
import "/@/styles/index.scss";
window.__VUE_PROD_DEVTOOLS__ = false;
window.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;
const app = createApp(App);
// 循环注册指令
Object.keys(directives).forEach((key) => {
	app.directive(key, (directives as { [key: string]: Directive })[key]);
});

// app.use(VCalendar, {});
app.use(store);

app
	.use(i18n)
	// .use(VueGridLayout)
	.use(router)
	.mount("#app");

export default app;
