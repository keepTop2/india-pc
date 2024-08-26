import { createApp, Directive } from "vue";
import store from "/@/stores/index";
import App from "/@/App.vue";
import router from "/@/router";
import "/@/permission";
import * as directives from "/@/directive/index";
import { i18n, setElementLang } from "/@/i18n/index";
import other from "/@/utils/other";

// import ElementPlus from "element-plus";
// import "element-plus/dist/index.css";
// import "element-plus/theme-chalk/dark/css-vars.css";
import "virtual:svg-icons-plugin-register";

// import VueGridLayout from "vue-grid-layout";
import "/@/styles/app.css";
import "/@/styles/index.scss";
// import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// import VCalendar from "v-calendar";
// import "v-calendar/style.css";
import microApp from "@micro-zoe/micro-app";
// import useGlobalComponents from "./components/index";

const app = createApp(App);
// useGlobalComponents(app);
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
// 	app.component(key, component);
// }

// 循环注册指令
Object.keys(directives).forEach((key) => {
	app.directive(key, (directives as { [key: string]: Directive })[key]);
});

// app.use(VCalendar, {});
app.use(store);
other.elSvg(app);
// app.use(CommonPlugin);
//注册主应用的路由对象
microApp.router.setBaseAppRouter(router);
//启动主应用
microApp.start({
	"keep-router-state": true, // 保留路由状态
});
app
	// .use(ElementPlus, {
	// 	locale: setElementLang(),
	// })
	.use(i18n)
	// .use(VueGridLayout)
	.use(router)
	.mount("#app");

export default app;
