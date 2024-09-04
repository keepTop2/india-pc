<template>
	<div class="verification-code">
		<div class="input-container">
			<input placeholder="Enter your phone number" @input="validateInput" class="contact-input common_input" :disabled="sendCodeText == '发送'" />
			<button @click="sendVerificationCode" class="send-button" :isSending="isSending" :disabled="disabled">
				{{ isSending && isCountingDown ? countdown + "s" : sendCodeText }}
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useCountdown } from "/@/hooks/countdown";
const { countdown, isCountingDown, startCountdown } = useCountdown();
const sendCodeText = ref("发送");
const isSending = ref(false);
const emit = defineEmits<{
	(e: "update:modelValue", value: string): void;
	(e: "sendVerificationCode"): void;
}>();
const props = defineProps({
	disabled: {
		type: Boolean,
	},
});
const validateInput = (e: any) => {
	emit("update:modelValue", e.target.value);
};

const sendVerificationCode = async () => {
	isSending.value = true;
	startCountdown(10);
	sendCodeText.value = "重新发送";
	emit("sendVerificationCode");
};
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
	top: 5px;
	bottom: 5px;
	padding: 0 10px;
	border: none;
	width: 69px;
	border-radius: 4px;
	background: var(--Bg1);
	border: 1px solid var(--Theme);
	color: var(--Theme);
	cursor: pointer;
	z-index: 1;
	font-size: 10px;
}
.send-button:disabled {
	cursor: not-allowed;
}
</style>
