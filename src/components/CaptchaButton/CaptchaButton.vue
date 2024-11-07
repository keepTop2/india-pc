<template>
	<div :class="buttonClass" @click="onCaptcha">
		<span v-if="!isCountingDown">
			<span v-if="!text">{{ $t('common["发送验证码"]') }}</span>
			<span v-else>{{ text }}</span>
		</span>
		<span v-else>{{ countdown }}S</span>
	</div>
</template>

<script setup lang="ts">
import { withDefaults, computed } from "vue";
import { useCountdown } from "/@/hooks/countdown";

const emit = defineEmits(["onCaptcha"]);

// 使用 ref 来存储组件状态
const props = withDefaults(
	defineProps<{
		disabled: boolean;
		type?: "button" | "text"; // 新增 type 参数，默认为 'button'
		text: string;
	}>(),
	{ disabled: false, type: "button", text: "" }
);

// 使用 countdown hook
const { countdown, isCountingDown, startCountdown, stopCountdown } = useCountdown();

// 计算按钮类名
const buttonClass = computed(() => {
	if (isCountingDown.value) {
		if (props.type === "button") {
			return "send"; // 倒计时中，使用 'send' 类
		} else if (props.type === "text") {
			return "send_text"; // 倒计时中，使用 'send' 类
		}
	}
	if (props.type === "text") {
		return props.disabled ? "send_text_disabled" : "send_text"; // 文本类型样式
	}
	return props.disabled ? "send_disabled" : "send"; // 按钮类型样式
});

// 处理验证码点击事件
const onCaptcha = async () => {
	if (props.disabled || isCountingDown.value) return;
	emit("onCaptcha");
};

defineExpose({
	startCountdown,
	stopCountdown,
});
</script>

<style scoped lang="scss">
.send,
.send_disabled {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 4px 10px;
	border-radius: 3px;
	border: 1px solid;
	text-align: center;
	font-family: "PingFang SC";
	font-size: 12px;
	font-weight: 400;
	box-sizing: border-box;
	user-select: none;
}

.send {
	color: var(--Theme);
	border-color: var(--Theme);
	cursor: pointer;
}

.send_disabled {
	color: var(--Theme);
	border-color: var(--Theme);
	cursor: no-drop;
}

.send_text,
.send_text_disabled {
	min-width: 80px;
	font-family: "PingFang SC";
	font-size: 12px;
	font-weight: 400;
	text-align: center;
}

.send_text {
	color: var(--Theme);
}

.send_text_disabled {
	color: var(--Theme);
}
</style>
