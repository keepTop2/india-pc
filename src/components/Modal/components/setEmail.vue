<!-- src/components/RegisterForm.vue -->
<template>
	<div class="ChangePasswordWrapper">
		<div class="ChangePassword_form">
			<div class="login_text fs_20 mb_20">
				<span v-if="userStore.getUserGlobalSetInfo.email"> {{ $t(`login['设置邮箱']`) }}</span>
				<span v-else> {{ $t(`login['绑定邮箱']`) }}</span>
			</div>
			<div class="login_form">
				<div>
					<!-- 旧密码 -->
					<div>
						<p class="Text_s mb_8 mt_8"><span class="Wran_text">*</span>{{ $t(`login['邮箱']`) }}</p>
						<p class="common_password">
							<input type="text" v-model="payLoad.email" class="common_input" :placeholder="$t(`login['输入账号']`)" @input="emailOnInput" />
						</p>
						<p v-show="userVerifyTypeVerifyError" class="Wran_text fs_12 mt_2">{{ $t(`login['手机号规则']`) }}</p>
					</div>
					<!-- 新密码 -->
					<div>
						<p class="Text_s mb_8 mt_8"><span class="Wran_text">*</span>{{ $t(`login['验证码']`) }}</p>
						<p class="common_password">
							<VerificationCode
								@VerificationCodeInput="VerificationCodeInput"
								@sendVerificationCode="sendVerificationCode"
								v-model="verificationBtn"
								:disabled="verificationBtn"
								ref="VerificationCodeRef"
							/>
						</p>
						<p class="fs_14 Text1 mt_16 fw_200">
							{{ $t(`login['有效时间']`) }}<span class="Theme_text">{{ $t(`login['联系客服']`) }}</span>
						</p>
					</div>
				</div>
				<div class="mt_40 mb_12">
					<button class="common_btn" :disabled="disabledBtn" type="button" @click="onSubmit">{{ $t(`login['确定']`) }}</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import Common from "/@/utils/common";
import eventBus from "/@/utils/eventBus";
import showToast from "/@/hooks/useToast";
import { userApi } from "/@/api/user";
import options from "/@/assets/ts/areaCode";
import { useUserStore } from "/@/stores/modules/user";
const userStore = useUserStore();
// 登陆表单
const payLoad = reactive({
	email: "",
	verifyCode: "",
	type: 1,
	areaCode: options[0].areaCode,
});

// 校验完成登陆按钮可以点击
const disabledBtn = ref(true);
const verificationBtn = ref(true);
const userVerifyTypeVerifyError = ref(false);
const userEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VerificationCodeRef = ref(null);
const sendVerificationCode = async () => {
	if (!userEmailRegex.test(payLoad.email)) {
		showToast("手机号不正确", 1500);
		return;
	} else {
		const params = {
			phone: payLoad.email,
		};
		const res = await userApi.globalSendSms(params).catch((err) => err);
		const { code, message } = res;
		if (code == Common.ResCode.SUCCESS) {
			showToast(message, 1500);
			(VerificationCodeRef.value as any).startCountdown(10);
			verificationBtn.value = true;
		} else {
			showToast(message, 1500);
		}
	}
};
const emailOnInput = () => {
	userEmailRegex.test(payLoad.email) ? (userVerifyTypeVerifyError.value = false) : (userVerifyTypeVerifyError.value = true);
	verificationBtn.value = userVerifyTypeVerifyError.value;
	verifyBtn();
};

const VerificationCodeInput = (verifyCode: string) => {
	payLoad.verifyCode = verifyCode;
	verifyBtn();
};
const verifyBtn = () => {
	if (userVerifyTypeVerifyError && payLoad.verifyCode) {
		disabledBtn.value = false;
	} else {
		disabledBtn.value = true;
	}
};

const onSubmit = async () => {
	const params = {
		type: payLoad.type,
		verifyCode: payLoad.verifyCode,
	};
	const checkVerifyRes = await userApi.checkVerifyCode(params).catch((error) => error);
	if (checkVerifyRes.code === Common.ResCode.SUCCESS) {
		const params = {
			type: payLoad.type,
			verifyCode: payLoad.verifyCode,
			areaCode: payLoad.areaCode,
			account: payLoad.email,
		};
		const res = await userApi.bindAccount(params).catch((err) => err);
		const { code, data, message } = res;
		if (code == Common.ResCode.SUCCESS) {
			eventBus.emit("hide-modal");

			showToast(message);
		} else {
			showToast(message);
		}
	}
};
</script>

<style lang="scss" scoped>
.ChangePasswordWrapper {
	width: 448px;
	height: 542px;
	border-radius: 12px;
	.ChangePassword_form {
		padding: 25px 32px;
		.common_password {
			position: relative;
			.eyes {
				position: absolute;
				right: 16px;
				top: 50%;
				transform: translateY(-50%);
				cursor: pointer;
			}
		}
		.login_text {
			color: var(--Text_s);
			font-weight: 500;
			span {
				position: relative;
			}
			span::after {
				content: "";
				position: absolute;
				bottom: -2px;
				left: 50%;
				transform: translateX(-50%);
				right: 0;
				width: 18px;
				height: 2px;
				background-color: var(--Theme);
			}
		}
	}
}
</style>
