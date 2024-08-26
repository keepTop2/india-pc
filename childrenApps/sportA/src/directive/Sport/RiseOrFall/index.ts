/*
 * @Author: WangMingxin
 * @Description:  体育赔率组件(上升下降标识) 指令 

 */
import { createApp, Directive } from "vue";
import domRiseOrFall from "/@/components/Sport/RiseOrFall.vue";
// height: 20,
// width: 14,
// right: 10,
/**
 * @description: 体育赔率组件(上升下降标识) 指令
 *  使用方式  
		v-RiseOrFall={	
			time: 0,1
			status: 1
		}
 * @return {*}
 */
export const RiseOrFall: Directive = {
	mounted(el, binding) {
		const app = createApp(domRiseOrFall);
		const instance = app.mount(document.createElement("div"));
		el.instance = instance;
		if (binding.value) {
			appendEl(el);
		}
	},
	/**
	 * @description: 视图更改
	 * @param {*} el
	 * @param {*} binding
	 * @param {*} vNode
	 * @return {*}
	 */
	updated(el, binding, vNode) {
		if (Object.prototype.toString.call(binding.value) === "[object Object]") {
			Object.keys(binding.value).forEach((key) => {
				if (key) {
					el.instance.state[key] = binding.value[key];
				}
			});
		} else {
			el.instance.state.status = binding.value;
		}
	},
};
/**
 * @description: 插入元素
 * @param {*} el {主元素dome}
 * @return {*}
 */
const appendEl = (el) => {
	// 给父元素加个定位，让loading元素定位
	el.style.position = "relative";
	el?.appendChild(el.instance.$el);
};
