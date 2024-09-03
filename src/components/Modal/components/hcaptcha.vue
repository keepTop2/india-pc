<template>
	<div ref="hcaptchaContainer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const hcaptchaContainer = ref<HTMLDivElement | null>(null);
const siteKey = "dcbefb7f-d3a4-4e87-8ae3-7b4a93813cbf";

// 扩展 Window 接口以包含 hcaptcha 属性
declare global {
	interface Window {
		hcaptcha: any;
	}
}

let hcaptcha: any = null;

const emit = defineEmits(["submit", "opened"]);

// 打开验证
const validate = () => {
	if (hcaptcha) {
		hcaptcha.execute();
	}
};

// 验证完成回调
const onSubmit = (token: string) => {
	emit("submit", token);
	// stopLoading();
};

// 验证关闭回调
const closed = () => {};

defineExpose({
	validate,
});

onMounted(() => {
	const script = document.createElement("script");
	script.src = "https://js.hcaptcha.com/1/api.js";
	script.async = true;
	script.defer = true;
	script.onload = () => {
		if (hcaptchaContainer.value) {
			hcaptcha = window.hcaptcha;
			hcaptcha.render(hcaptchaContainer.value, {
				sitekey: siteKey,
				callback: onSubmit,
				size: "invisible",
				"close-callback": closed,
			});
		}
	};
	script.onerror = () => {
		console.error("Failed to load hCaptcha script.");
	};
	document.head.appendChild(script);
});
</script>
