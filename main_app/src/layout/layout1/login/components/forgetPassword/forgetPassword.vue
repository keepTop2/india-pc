<template>
	<div class="forgetPassword">
		<div>
			<div class="header">
				<SvgIcon iconName="back_icon" :size="28" @click="onNextStep(1)" />
				<h2 class="title">{{ $t('login["找回密码"]') }}</h2>
			</div>
			<div class="from-container">
				<div class="tabs">
					<div class="tab" :class="{ 'tab-active': state.type == '1' }" @click="tabClick('1')">{{ $t(`login['电子邮箱']`) }}</div>
					<div class="tab" :class="{ 'tab-active': state.type == '2' }" @click="tabClick('2')">{{ $t(`login['电话号码']`) }}</div>
				</div>

				<div class="steps mt_24" :class="{ 'step-two': stepActive >= 1, 'step-Third': stepActive >= 2 }">
					<div class="step" :class="{ 'step-active': stepActive == index }" v-for="(item, index) in 3" :key="item">
						<span v-if="stepActive <= index">{{ item }}</span>
						<SvgIcon v-else iconName="step_icon" :size="20" />
					</div>
				</div>

				<div class="from mt_24">
					<KeepAlive>
						<component :is="components[componentActive]" :data="state" @verify="onVerify" @step="mapComponents"></component>
					</KeepAlive>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="forgetPassword">
import { ref, reactive } from 'vue';
import Common from '/@/utils/common';
import { ForgetPasswordApi } from '/@/api/login/forgetPassword';
import emailStepOne from './components/emailStepOne.vue';
import emailStepTwo from './components/emailStepTwo.vue';
import emailStepThird from './components/emailStepThird.vue';
import phoneStepOne from './components/phoneStepOne.vue';
import phoneStepTwo from './components/phoneStepTwo.vue';
import phoneStepThird from './components/phoneStepThird.vue';
import { i18n } from '/@/i18n/index';
const $: any = i18n.global;

const componentActive = ref(0 as number | string); // 组件索引
const stepActive = ref(0); // 步骤索引
const components = {
	0: emailStepOne,
	1: phoneStepOne,
	2: emailStepTwo,
	3: phoneStepTwo,
	4: emailStepThird,
	5: phoneStepThird,
};

const emit = defineEmits(['step', 'toggleModal']);

let state = reactive({
	type: '1' as string, // 类型 1 邮箱 2 手机号
});

/**
 * @param tabActive tab索引，不同的tab对应邮箱与手机
 * @param componentActive 组件索引
 */
const mapComponents = async (params?: any) => {
	state = Object.assign({}, state, params);
	if (stepActive.value == 0) {
		// 第一步
		checkAccount();
	} else if (stepActive.value == 1) {
		// 第二步
		checkVerifyCode();
	} else if (stepActive.value == 2) {
		// 第三步
		resetPassword();
	}
};

// 切换组件
const componentSwitching = () => {
	if (state.type == '1') {
		if (componentActive.value == 0) {
			componentActive.value = 2;
		} else if (componentActive.value == 2) {
			componentActive.value = 4;
		}
	} else if (state.type == '2') {
		if (componentActive.value == 1) {
			componentActive.value = 3;
		} else if (componentActive.value == 3) {
			componentActive.value = 5;
		}
	}
};

// 校验邮箱和手机号
const checkAccount = async () => {
	const res = await ForgetPasswordApi.checkAccount(state).catch((err) => err);
	if (res.code == Common.ResCode.SUCCESS) {
		componentSwitching();
		stepActive.value++; // 步骤加一
	}
};

// 验证码校验
const checkVerifyCode = async () => {
	const res = await ForgetPasswordApi.checkVerifyCode(state).catch((err) => err);
	if (res.code == Common.ResCode.SUCCESS) {
		componentSwitching();
		stepActive.value++; // 步骤加一
	}
};

// 重置密码
const resetPassword = async () => {
	const res = await ForgetPasswordApi.resetPassword(state).catch((err) => err);
	if (res.code == Common.ResCode.SUCCESS) {
		componentSwitching();
		emit('toggleModal', $.t('login["密码设置成功"]'));
	}
};

const tabClick = (active: string) => {
	stepActive.value = 0;
	state.type = active;
	componentActive.value = state.type == '1' ? 0 : 1;
};

const onVerify = () => {
	const forgetPassword = true; // 忘记密码入口标记
	emit('step', 3, state, forgetPassword);
};

// 忘记密码返回判断
const onNextStep = (active: number) => {
	if (componentActive.value == 0 || componentActive.value == 1) {
		emit('step', active);
		return;
	}
	if (componentActive.value == 2) {
		stepActive.value--;
		componentActive.value = 0;
	} else if (componentActive.value == 3) {
		stepActive.value--;
		componentActive.value = 1;
	} else if (componentActive.value == 4) {
		stepActive.value--;
		componentActive.value = 2;
	} else if (componentActive.value == 5) {
		stepActive.value--;
		componentActive.value = 3;
	}
};
</script>

<style scoped lang="scss">
.forgetPassword {
	position: relative;
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

	.from-container {
		padding: 30px 32px;
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
		.steps {
			position: relative;
			display: flex;
			justify-content: space-between;

			.step {
				width: 34px;
				height: 34px;
				display: flex;
				align-items: center;
				justify-content: center;
				border: 1px solid;
				@include themeify {
					border-color: themed('Theme');
					color: themed('Theme');
				}
				background-color: #ebffe6;
				border-radius: 50%;
				box-sizing: border-box;
				font-family: 'PingFang SC';
				font-size: 18px;
				font-weight: 500;
			}

			.step-active {
				border: 0;
				@include themeify {
					background-color: themed('Theme') !important;
					color: themed('Text_a') !important;
				}
			}
		}
		.steps::after,
		.steps::before {
			position: absolute;
			content: '';
			top: 50%;
			width: 100px;
			display: flex;
			border-bottom: 1px dashed;
			@include themeify {
				border-color: themed('Line');
			}
		}
		.steps::after {
			left: 42px;
		}
		.steps::before {
			right: 42px;
		}

		.step-two {
			position: relative;
		}
		.step-two::after {
			position: absolute;
			@include themeify {
				border-color: themed('Theme');
			}
		}
		.step-Third {
			position: relative;
		}
		.step-Third::before {
			position: absolute;
			@include themeify {
				border-color: themed('Theme');
			}
		}
	}
}
</style>
