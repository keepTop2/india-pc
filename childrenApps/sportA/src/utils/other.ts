import { defineAsyncComponent } from "vue";
import type { App } from "vue";
import * as svg from "@element-plus/icons-vue";

// 引入组件
const SvgIcon = defineAsyncComponent(() => import("/@/components/svgIcon/index.vue"));

/**
 * 导出全局注册 element plus svg 图标
 * @param app vue 实例
 * @description 使用：https://element-plus.gitee.io/zh-CN/component/icon.html
 */
export function elSvg(app: App) {
	const icons = svg as any;
	for (const i in icons) {
		app.component(`ele-${icons[i].name}`, icons[i]);
	}
	app.component("SvgIcon", SvgIcon);
}
