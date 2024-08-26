import { createApp, Directive } from "vue";
import store from "/@/stores/index";
import App from "/@/App.vue";
import router from "/@/router";
import "/@/permission";
import * as directives from "/@/directive/index";
import { i18n, setElementLang } from "/@/i18n/index";
import { elSvg } from "/@/utils/other";

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

// import useGlobalComponents from "./components/index";

let app: any = null;
window.mount = () => {
	console.log("子应用UMD sportA window.mount执行");
	app = createApp(App);
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
	elSvg(app);
	app
		// .use(ElementPlus, {
		// 	locale: setElementLang(),
		// })
		.use(i18n)
		// .use(VueGridLayout)
		.use(router)
		.mount("#app");
};

window.unmount = () => {
	console.log("子应用UMD sportA window.unmount卸载");
	app.unmount();
	app = null;
};

export default app;
