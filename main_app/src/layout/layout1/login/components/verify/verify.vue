<template>
	<div class="verify">
		<div class="header">
			<SvgIcon iconName="back_icon" :size="28" @click="onNextStep(0)" />
			<h2 v-if="props.fromParams.type == '1'" class="title">{{ $t('login["邮箱验证"]') }}</h2>
			<h2 v-if="props.fromParams.type == '2'" class="title">{{ $t('login["手机验证"]') }}</h2>
		</div>
		<div class="from">
			<div class="info mt_17">{{ $t('login["验证码已发送至"]') }}{{ props.fromParams.account }}</div>
			<div class="time mt_6">
				{{ $t('login["有效时间"]', { num: 5 }) }}
			</div>

			<FromInput v-model="state.verifyCode" class="mt_16" type="text" :placeholder="$t(`login['输入验证码']`)">
				<template v-slot:right>
					<div class="send">
						<CaptchaButton :account="props.fromParams.account" :emailStatus="props.fromParams.type == '1' ? true : false" />
					</div>
				</template>
			</FromInput>

			<div class="tips mt_12">
				<span @click="onNextStep(3)">
					{{ $t('login["未收到验证码"]') }}
				</span>
			</div>

			<Button :type="btnDisabled ? 'disabled' : 'default'" class="mt_18" @click="onSubmit">{{ $t(`login['提交']`) }}</Button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import Common from '/@/utils/common';
import { registerApi } from '/@/api/login/register';
import FromInput from '/@/components/Input/fromInput.vue';
import Button from '/@/components/Button/Button.vue';
import CaptchaButton from '/@/components/captchaButton/captchaButton.vue';
import { i18n } from '/@/i18n/index';
const $: any = i18n.global;

const emit = defineEmits(['step', 'toggleModal']);
const props = withDefaults(
	defineProps<{
		fromParams?: any;
	}>(),
	{}
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

const onSubmit = async () => {
	const params = {
		type: props.fromParams.type,
		account: props.fromParams.account,
		password: props.fromParams.password,
		mainCurrency: props.fromParams.mainCurrency,
		inviteCode: props.fromParams.inviteCode,
		deviceNo: props.fromParams.deviceNo,
		verifyCode: state.verifyCode,
	};
	const res = await registerApi.submitRegister(params).catch((err: any) => err);
	if (res.code == Common.ResCode.SUCCESS) {
		emit('toggleModal', $.t('login["注册成功"]'));
	}
};

const onNextStep = (active: number) => {
	emit('step', active, props.fromParams);
};
</script>

<style scoped lang="scss">
.verify {
	.header {
		display: flex;
		padding: 26px 22px;

		.icon {
			color: #fff;
		}

		.title {
			@include themeify {
				color: themed('Text_s');
			}
			font-family: 'PingFang SC';
			font-size: 20px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
		}
	}
	.from {
		padding: 20px 32px 20px;

		.send {
			position: relative;
			padding-left: 8px;
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

		.info,
		.time {
			@include themeify {
				color: themed('Text1');
			}
			font-family: 'PingFang SC';
			font-size: 14px;
			font-weight: 400;
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
			}
		}
	}
}
</style>
