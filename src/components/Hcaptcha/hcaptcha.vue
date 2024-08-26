<template>
	<div ref="hcaptchaContainer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import { useLoading } from '/@/directive/loading/hooks';
const { startLoading, stopLoading } = useLoading();

const hcaptchaContainer = ref(null);
const siteKey = 'dcbefb7f-d3a4-4e87-8ae3-7b4a93813cbf';
let hcaptcha: any; // hcaptcha 实例

const emit = defineEmits(['submit', 'opened']);

// 打开验证
const validate = () => {
	startLoading();
	hcaptcha.execute();
};

// 验证打开回调
const opened = () => {
	stopLoading();
};

// 验证完成回调
const onSubmit = (token: string) => {
	emit('submit', token);
	startLoading();
	stopLoading();
};

// 验证打开回调
const closed = () => {
	startLoading();
	stopLoading();
};

defineExpose({
	validate,
});

onMounted(() => {
	const script = document.createElement('script');
	script.src = 'https://js.hcaptcha.com/1/api.js';
	script.async = true;
	script.defer = true;
	script.onload = () => {
		hcaptcha = window.hcaptcha; // 将 hcaptcha 实例赋值给变量
		hcaptcha.render(hcaptchaContainer.value, {
			sitekey: siteKey,
			callback: onSubmit,
			size: 'invisible',
			'open-callback': opened,
			'close-callback': closed,
		});
	};
	document.head.appendChild(script);
});
</script>
