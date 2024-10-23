<template>
	<div class="countdown color_T2" v-if="modelValue !== undefined">
		<div class="card">
			<p>H</p>
			{{ hours }}
		</div>
		<span class="">:</span>
		<div class="card">
			<p>M</p>
			{{ minutes }}
		</div>
		<span class="">:</span>
		<div class="card">
			<p>S</p>
			{{ seconds }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";

/**
 * @description 定义组件的属性
 * @param defaultTime 默认倒计时时间，单位为秒
 */
const props = defineProps({
	modelValue: {
		type: Number,
		require: true,
		default: 0,
	},
});

// 计算小时、分钟和秒
const hours = computed(() => String(Math.floor(props.modelValue / 3600)).padStart(2, "0"));
const minutes = computed(() => String(Math.floor((props.modelValue % 3600) / 60)).padStart(2, "0"));
const seconds = computed(() => String(props.modelValue % 60).padStart(2, "0"));
</script>

<style scoped lang="scss">
@font-face {
	font-family: "MyFont";
	src: url("./DS.ttf") format("truetype");
	/* 可以添加其他字体格式，如 woff2、ttf、otf 等 */
}
/* 样式设置 */
.countdown {
	display: flex;
	gap: 6px;
	justify-content: space-between;
	align-items: center;
	border-radius: 20px;
	span {
		color: var(--Text1);
	}
}
.card {
	width: 44px;
	height: 44px;
	background-color: #eaecf2;
	border: 1px solid #ccc;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 20px;
	font-weight: bold;
	flex-direction: column;
	font-family: "MyFont", sans-serif;
	border-radius: 10px;
	color: var(--Text2);
	p {
		font-size: 12px;
		margin: 0;
		padding: 0;
	}
}
</style>
