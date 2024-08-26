<template>
	<div>
		<div class="header">{{ $t(`login['登录']`) }}</div>
		<div class="from">
			<div class="tabs">
				<div class="tab" :class="{ 'tab-active': state.type == '1' }" @click="tabClick('1')">{{ $t(`login['电子邮箱']`) }}
				</div>
				<div class="tab" :class="{ 'tab-active': state.type == '2' }" @click="tabClick('2')">{{ $t(`login['电话号码']`) }}
				</div>
			</div>

			<FromInput v-if="state.type == '1'" v-model="state.email" class="mt_24" type="text"
				:placeholder="$t(`login['邮箱账号']`)" />

			<FromInput v-if="state.type == '2'" v-model="state.phone" class="mt_24 phone-area-code-input" type="text"
				:placeholder="$t(`login['电话号码']`)">
				<template v-slot:left>
					<PhoneAreaCode :areaCode="state.areaCode" @select="onSelection" />
				</template>
			</FromInput>

			<FromInput v-model="state.password" class="mt_10" :type="eyeShow ? 'password' : 'text'"
				:placeholder="$t(`login['登录密码']`)">
				<template v-slot:right>
					<SvgIcon :iconName="eyeShow ? 'eye-off' : 'eye'" :size="30" @click="eyeShow = !eyeShow" />
				</template>
			</FromInput>

			<div class="referral-code">
				<span @click="onNextStep(4)">{{ $t('login["忘记密码"]') }}</span>
			</div>

			<Button class="mt_18" :type="btnDisabled ? 'disabled' : 'default'" @click="onLogin">{{ $t(`login['登录']`)
				}}</Button>

			<Alert class="mt_10" v-if="state.description" :description="state.description" />

			<div class="footer">
				<span class="text">{{ $t('login["新用户？"]') }}</span>
				<span class="create" @click="onNextStep(0)">{{ $t('login["创建账号"]') }}</span>
			</div>
		</div>

		<Hcaptcha ref="hcaptcha" @submit="onSubmit" />
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import Common from '/@/utils/common';
import { loginApi } from '/@/api/login/signin';
import PhoneAreaCode from '/@/layout/layout1/login/components/components/phoneAreaCode.vue';
import Alert from '/@/components/Alert/index.vue';
import Hcaptcha from '/@/components/Hcaptcha/hcaptcha.vue';
import { i18n } from '/@/i18n/index';
import { useUserStore } from '/@/stores/modules/user';

const store = useUserStore();
const $: any = i18n.global;
const emit = defineEmits(['step', 'login', 'close']);
const btnDisabled = ref(true);
const eyeShow = ref(true);
const hcaptcha = ref(null);

const state = reactive({
	areaCode: '+86',
	type: '1' as string, // 类型 1 邮箱 2 手机号
	phone: '',
	email: '',
	account: '', // 邮箱或者手机号
	password: '', // 密码
	deviceNo: '', // 设备
	description: '',
});

watch(
	[() => state.phone, () => state.email, () => state.password, () => state.type],
	([phone, email, password, type]) => {
		if (type == '1') {
			if (email && password) {
				btnDisabled.value = false;
			} else {
				btnDisabled.value = true;
			}
		} else {
			if (phone && password) {
				btnDisabled.value = false;
			} else {
				btnDisabled.value = true;
			}
		}
	},
	{
		immediate: true,
	}
);

const userLogin = async () => {
	const params = {
		type: state.type,
		account: state.account,
		password: state.password,
		deviceNo: state.deviceNo,
	};
	const res = await loginApi.userLogin(params).catch((err) => err);
	if (res.code == Common.ResCode.SUCCESS) {
		store.setInfo(res.data);
		emit('close');
	}
};

const onSubmit = async (token: string) => {
	const res = await loginApi.verifyCode({ verifyToken: token }).catch((err) => err);
	if (res.code == Common.ResCode.SUCCESS) {
		userLogin();
	}
};

const tabClick = (active: string) => {
	state.type = active;
};

const onLogin = () => {
	// 判断类型
	if (state.type == '2') {
		state.account = state.areaCode + state.phone;
		// 校验手机
		if (!Common.accountPassword(state.password)) {
			state.description = $.t('login["手机登录失败"]');
		} else {
			state.description = '';
		}
	} else {
		state.account = state.email;
		// 校验邮箱
		if (!Common.emailReg(state.account) || !Common.accountPassword(state.password)) {
			state.description = $.t('login["邮箱登录失败"]');
		} else {
			state.description = '';
		}
	}
	hcaptcha.value?.validate();
};

// 选择区号
const onSelection = (item: any) => {
	state.areaCode = item.code;
};

const onNextStep = (active: string | number) => {
	emit('step', active);
};
</script>

<style scoped lang="scss">
.header {
	padding: 26px 22px 30px;

	@include themeify {
		color: themed('Text_s');
	}

	font-family: 'PingFang SC';
	font-size: 20px;
	font-weight: 500;
}

.from {
	padding: 0px 32px;

	.tabs {
		display: flex;
		height: 32px;

		.tab {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;

			@include themeify {
				color: themed('Text1');
			}

			font-family: 'PingFang SC';
			font-size: 16px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			cursor: pointer;
		}

		.tab-active {
			position: relative;

			@include themeify {
				color: themed('Theme');
			}

			background: linear-gradient(180deg, rgba(59, 193, 22, 0) 35.94%, rgba(59, 193, 22, 0.25) 100%);
		}

		.tab-active::after {
			position: absolute;
			width: 100%;
			height: 100%;
			content: '';

			@include themeify {
				color: themed('Theme');
				border-color: themed('Theme');
			}

			border-bottom: 2px solid;
		}
	}

	.phone-area-code-input {
		position: relative;

		:deep(input) {
			margin-left: 10px;
		}
	}

	.referral-code {
		margin-top: 10px;

		@include themeify {
			color: themed('Text_s');
		}

		font-family: 'PingFang SC';
		font-size: 14px;
		font-weight: 500;
		text-align: end;

		span {
			cursor: pointer;

			&:hover {
				text-decoration: underline;
			}
		}
	}

	.footer {
		margin-top: 12px;

		.text {
			@include themeify {
				color: themed('Text4');
			}

			font-size: 14px;
			font-weight: 400;
		}

		.create {
			@include themeify {
				color: themed('Theme');
			}

			font-size: 14px;
			font-weight: 500;
			cursor: pointer;

			&:hover {
				text-decoration: underline;
			}
		}
	}
}
</style>
