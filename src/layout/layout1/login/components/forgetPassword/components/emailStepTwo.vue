<template>
	<div>
		<div class="title">{{ $t('login["验证电子邮箱"]') }}</div>
		<p class="text">
			<span>{{ $t('login["验证码发送至邮箱"]') }}</span>
			<span>{{ props.data.account }}</span>
		</p>
		<p class="text">{{ $t('login["有效时间"]', { num: 5 }) }}</p>

		<FromInput v-model="state.verifyCode" class="mt_16" type="text" :placeholder="$t(`login['输入验证码']`)">
			<template v-slot:right>
				<div class="send">
					<CaptchaButton :account="props.data.account" emailStatus />
				</div>
			</template>
		</FromInput>

		<div class="tips mt_12">
			<span @click="onVerify">
				{{ $t('login["未收到验证码"]') }}
			</span>
		</div>

		<Button :type="btnDisabled ? 'disabled' : 'default'" class="mt_18" @click="onStep()">{{ $t(`login['下一步']`) }}</Button>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import FromInput from '/@/components/Input/fromInput.vue';
import Button from '/@/components/Button/Button.vue';
import CaptchaButton from '/@/components/captchaButton/captchaButton.vue';
const emit = defineEmits(['step', 'verify']);

const props = withDefaults(
	defineProps<{
		data?: any;
	}>(),
	{ data: {} }
);

const btnDisabled = ref(true);
const state = reactive({
	verifyCode: '',
});

watch(
	[() => state.verifyCode],
	([verifyCode]) => {
		if (verifyCode) {
			btnDisabled.value = false;
		} else {
			btnDisabled.value = true;
		}
	},
	{
		immediate: true,
	}
);

const onVerify = () => {
	emit('verify');
};

const onStep = () => {
	emit('step', state);
};
</script>

<style scoped lang="scss">
.title {
	padding-bottom: 6px;
	@include themeify {
		color: themed('Text1');
	}
	font-family: 'PingFang SC';
	font-size: 14px;
	font-weight: 400;
}
.text {
	margin-top: 6px;
	@include themeify {
		color: themed('Text4');
	}
	font-family: 'PingFang SC';
	font-size: 14px;
	font-weight: 400;
}
.send {
	position: relative;
	padding-left: 8px;
	@include themeify {
		color: themed('Text_s');
	}
	font-family: 'PingFang SC';
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
}
.send::after {
	position: absolute;
	content: '';
	top: 0px;
	left: 0px;
	width: 1px;
	height: 20px;
	@include themeify {
		background: themed('Line');
	}
}
.tips {
	@include themeify {
		color: themed('Theme');
	}
	font-family: 'PingFang SC';
	font-size: 14px;
	font-weight: 400;
	span {
		cursor: pointer;

		&:hover {
			text-decoration: underline;
		}
	}
}
</style>
