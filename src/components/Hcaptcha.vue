<template>
	<div id="hcaptchaContainer"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { loginApi } from "/@/api/login";
import Common from "/@/utils/common";
const certifyId = ref(null);
const props = defineProps({
	onSubmit: {
		type: Function,
		default: () => {},
	},
});
onMounted(() => {
	(window as any).initAliyunCaptcha({
		SceneId: "qxye14r6d",
		prefix: "5zbecta",
		mode: "popup",
		element: "#hcaptchaContainer",
		button: "#captcha-element",
		captchaVerifyCallback: captchaVerifyCallback,
		onBizResultCallback: props.onSubmit,
		getInstance: getInstance,
		slideStyle: {
			width: 360,
			height: 200,
		},
		language: "cn",
		region: "sgp",
	});
});

const captcha = ref(null);
const getInstance = (instance: any) => {
	captcha.value = instance;
};
// 验证码验证回调
const captchaVerifyCallback = (captchaVerifyParam: any) => {
	return loginApi.verifyCode({ captchaVerifyParam: captchaVerifyParam }).then((res) => {
		if (res.code === Common.ResCode.SUCCESS) {
			// 构造标准返回参数
			const verifyResult = {
				captchaResult: res.data.captchaResult,
				bizResult: res.data.captchaResult,
			};
			certifyId.value = JSON.parse(captchaVerifyParam).certifyId;

			return verifyResult;
		} else {
			// 构造标准返回参数
			const verifyResult = {
				captchaResult: res.data.captchaResult,
				bizResult: res.data.captchaResult,
			};
			return verifyResult;
		}
	});
};
defineExpose({
	certifyId,
});
</script>

<style scoped></style>
