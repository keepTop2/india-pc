import type { Component, App } from "vue";
import { NoneData } from "./noneData";
import Button from "/@/components/Button/Button.vue";
import FromInput from "/@/components/Input/fromInput.vue";
import { Notification } from "./Notification";
const components: {
	[propName: string]: Component;
} = {
	NoneData,
	Button,
	FromInput,
};

/**
 * 全局注册组件
 * @param app vue 实例
 * @description
 */
const useGlobalComponents = (app: App) => {
	for (const key in components) {
		app.component(key, components[key]);
	}
};
export { Notification };
export default useGlobalComponents;
