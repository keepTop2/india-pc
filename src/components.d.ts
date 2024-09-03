// import '@vue/runtime-core'
// export { };
import { NoneData } from "/@/components/noneData";
declare module "@vue/runtime-core" {
	export interface GlobalComponents {
		// BasicModal: typeof import('./../src/components/Modal/src/BasicModal.vue')['default']
		NoneData: typeof NoneData;
		Button: typeof import("/@/components/Button/Button.vue")["default"];
		FromInput: typeof import("/@/components/Input/fromInput.vue")["default"];
		CaptchaButton: typeof import("/@/components/captchaButton/captchaButton.vue")["default"];
	}
}
