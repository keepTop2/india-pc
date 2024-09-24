import { createApp, Directive } from "vue";
import Loading from "./index.vue";

export const okLoading: Directive = {
	mounted(el, binding) {
		const app = createApp(Loading);
		const instance = app.mount(document.createElement("div"));
		el.instance = instance;
		if (binding.value) {
			appendEl(el);
		}
	},
	updated(el, binding) {
		if (binding.value !== binding.oldValue) {
			binding.value ? appendEl(el) : removeEl(el);
		}
	},
};
// 插入元素
const appendEl = (el) => {
	// 给父元素加个定位，让loading元素定位
	el.style.position = "relative";
	el.style.overflow = "hidden";
	el?.appendChild(el.instance.$el);
};
// 移除元素
const removeEl = (el) => {
	el.style.position = "";
	const $el = el.instance.$el;
	if (el?.contains($el)) {
		el?.removeChild($el);
	}
};
