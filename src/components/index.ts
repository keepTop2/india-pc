import type { Component, App } from "vue";
import { NoneData } from "./noneData";
import Button from "/@/components/Button/Button.vue";
import FromInput from "/@/components/Input/fromInput.vue";
import CaptchaButton from "/@/components/captchaButton/captchaButton.vue";
import { Notification } from "./Notification";
import { WImage } from "./wImage";
const components: {
	[propName: String]: Component;
} = {
	NoneData,
	Button,
	FromInput,
	CaptchaButton,
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
export { Notification, WImage };
export default useGlobalComponents;
