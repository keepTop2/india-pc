<template>
	<div class="verification-code">
		<div class="input-container">
			<FromInput
				placeholder="请输入验证码"
				@input="validateInput"
				:disabled="sendCodeText == '发送'"
				:maxlength="6"
				style="width: 100%"
				:hideLeftIcon="hideLeftIcon"
				v-model="value"
				:noColse="true"
			>
				<template #left v-if="!hideLeftIcon">
					<svg-icon name="common-VerificationCode" size="18px" />
				</template>
			</FromInput>
			<button @click="sendVerificationCode" class="send-button" :disabled="disabled && countdown > 0" :class="countdown > 0 ? 'iscountdown' : ''">
				{{ isCountingDown ? countdown + "s" : sendCodeText }}
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useCountdown } from "/@/hooks/countdown";
const { countdown, isCountingDown, startCountdown } = useCountdown();
const sendCodeText = ref("发送");
const value = ref("");
const emit = defineEmits<{
	(e: "update:modelValue", value: Boolean): void;
	(e: "sendVerificationCode"): void;
	(e: "VerificationCodeInput", value: string): void;
}>();

const props = defineProps({
	disabled: {
		type: Boolean,
	},
	hideLeftIcon: {
		type: Boolean,
	},
});
watch(
	() => isCountingDown.value,
	() => {
		if (!isCountingDown.value) {
			emit("update:modelValue", false);
		}
	}
);

const validateInput = (e: any) => {
	emit("VerificationCodeInput", e.target.value);
};
const sendVerificationCode = () => {
	sendCodeText.value = "重新发送";
	emit("sendVerificationCode");
};
defineExpose({
	startCountdown,
});
</script>

<style scoped>
.verification-code {
	margin: 0 auto;
	border-radius: 8px;
}

.input-container {
	position: relative;
	display: flex;
	align-items: center;
}

.send-button {
	position: absolute;
	right: 8px;
	top: 15px;
	padding: 6px 12px;
	border: none;
	height: 32px;
	border-radius: 4px;
	background: var(--Bg-1);
	border: 1px solid var(--Theme);
	color: var(--Theme);
	cursor: pointer;
	z-index: 1;
	font-size: 12px;
}
.send-button:disabled {
	cursor: not-allowed;
	background: var(--Bg);
	border: 1px solid var(--Line-2);
	color: var(--Text-2);
}
.iscountdown.send-button:disabled {
	border: 1px solid var(--Theme);
	color: var(--Theme);
	opacity: 0.4;
}
</style>
