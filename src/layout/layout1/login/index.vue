<template>
	<div>
		<el-dialog v-model="loginDialogVisible" :width="800" :show-close="false" align-center :destroy-on-close="true">
			<div class="login-dialog">
				<div class="login-left">
					<img class="logo-bg" :src="loginLogo" alt="" />

					<div class="text-info">
						<p class="text1">{{ $t('login["欢迎来到"]') }}<span class="Theme">OKsport</span></p>
						<p class="text2">{{ $t('login["现在就开始你的游戏之旅吧"]') }}</p>

						<SvgIcon class="mt_8" iconName="login_logo" :size="132" :height="16" />
					</div>
				</div>
				<div class="login-right">
					<Transition name="scale">
						<KeepAlive include="forgetPassword">
							<component :is="components[componentActive]" :fromParams="fromParams" :forget="forget" @step="mapComponents" @toggleModal="toggleModal" @close="close"></component>
						</KeepAlive>
					</Transition>
				</div>
			</div>
			<Success :isModalOpen="isModalOpen" :text="successText" @step="mapComponents" @close="isModalOpen = false" />
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

import dialogSingleton from '/@/layout/layout1/login/dialogSingleton';
import loginLogo from '/@/assets/zh/default/layout/layout1/login/login-logo.png';
import register from './components/register/register.vue';
import signIn from './components/signin/signin.vue';
import verify from './components/verify/verify.vue';
import notReceived from './components/notReceived/notReceived.vue';
import forgetPassword from './components/forgetPassword/forgetPassword.vue';
import Success from './components/success/index.vue';
import pubsub from '/@/pubSub/pubSub';
pubsub.subscribe(pubsub.PubSubEvents.LoginEvents.showOrHiddenLoginDialog.eventName, showOrHidden);
const components = {
	0: register, // 注册
	1: signIn, // 登录
	2: verify, // 验证码
	3: notReceived, // 未收到验证码
	4: forgetPassword, // 忘记密码
};

const loginDialogVisible = dialogSingleton.loginDialogVisible;
const componentActive = dialogSingleton.componentActive ? dialogSingleton.componentActive : ref(0);
const forget = ref(false as boolean | undefined);
let fromParams = reactive({} as any);
const isModalOpen = ref(false);
let successText = ref('');

/**
 * @param active 组件索引 0: register,1: signIn,2: verify,3: notReceived,4: forgetPassword,
 * @param params 表单参数信息
 * @param forgetPassword 找回密码入口标记
 */
const mapComponents = (active: number, params?: any, forgetPassword?: boolean) => {
	componentActive.value = active;
	fromParams = params;
	forget.value = forgetPassword;
};

function toggleModal(text: string) {
	isModalOpen.value = !isModalOpen.value;
	successText.value = text;
}

const close = () => {
	dialogSingleton.hideDialog();
};

function showOrHidden(type: number) {
	dialogSingleton.showDialog({ componentActive: type });
}
</script>

<style scoped lang="scss">
.login-dialog {
	width: 800px;
	height: 634px;
	display: flex;
	border-radius: 6px;
	@include themeify {
		background-color: themed('Bg1');
	}
	overflow: hidden;

	.login-left {
		position: relative;
		width: 400px;
		@include themeify {
			background-color: themed('Bg2');
		}

		.logo-bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
		}
		.text-info {
			width: 100%;
			margin-top: 420px;
			text-align: center;
			.text1 {
				@include themeify {
					color: themed('Text_a');
				}
				font-family: 'PingFang SC';
				font-size: 20px;
				font-weight: 500;
			}
			.text2 {
				@include themeify {
					color: themed('Text1');
				}
				font-family: 'PingFang SC';
				font-size: 14px;
				font-weight: 400;
			}
			.Theme {
				@include themeify {
					color: themed('Theme');
				}
			}
		}
	}
	.login-right {
		flex: 1;
	}
}

/* 定义缩放动画 */
.scale-leave-active {
	display: none;
}
.scale-enter-active {
	animation: scale-animation 0.2s;
}

/* 定义缩放动画的关键帧 */
@keyframes scale-animation {
	0% {
		transform: scale(0.98);
		opacity: 0.5;
	}
	100% {
		transform: scale(1);
		opacity: 1;
	}
}

:deep(.el-dialog) {
	background-color: unset;
	box-shadow: unset;
}

:deep(.el-dialog__header),
:deep(.el-dialog__body) {
	margin: 0;
	padding: 0;
}
</style>
