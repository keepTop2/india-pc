<!-- src/components/RegisterForm.vue -->
<template>
	<div class="ChangePasswordWrapper">
		<div class="ChangePassword_form">
			<div class="login_text fs_20 mb_20">
				<span v-if="isCreate && !isEdit"> {{ $t(`security_center['绑定邮箱']`) }}</span>
				<span v-else> {{ $t(`security_center['修改邮箱']`) }}</span>
			</div>
			<div class="login_form">
				<div v-if="isCreate">
					<div>
						<p class="Text_s mb_8 mt_8"><span class="Wran_text">*</span>{{ $t(`security_center['新邮箱账号']`) }}</p>
						<p class="common_password">
							<input
								type="text"
								v-model="payLoad.email"
								class="common_input"
								:placeholder="$t(`security_center['输入邮箱']`)"
								@input="emailOnInput"
								:class="userVerifyTypeVerifyError ? 'verifyError' : ''"
							/>
						</p>
						<p v-show="userVerifyTypeVerifyError" class="Wran_text fs_12 mt_2">{{ $t(`security_center['邮箱格式不正确']`) }}</p>
					</div>
					<div>
						<p class="Text_s mb_8 mt_8"><span class="Wran_text">*</span>{{ $t(`security_center['验证码']`) }}</p>
						<p class="common_password">
							<VerificationCode
								@VerificationCodeInput="VerificationCodeInput"
								@sendVerificationCode="sendVerificationCode"
								v-model="verificationBtn"
								:disabled="verificationBtn && payLoad.email"
								ref="VerificationCodeRef"
							/>
						</p>
						<p class="fs_14 Text1 mt_16 fw_200">
							{{ $t(`security_center['有效时间']`) }}<span class="color_Theme" @click="Common.getSiteCustomerChannel">{{ $t(`security_center['联系客服']`) }}</span>
						</p>
					</div>
				</div>
				<div v-else>
					<div class="Text_s mb_8">{{ $t(`security_center['原邮箱账号']`) }}</div>
					<div class="Text1">{{ $t(`security_center['验证码将发送至邮箱账号：']`) }}{{ Common.maskEmail(userStore.getUserGlobalSetInfo.email) }}</div>
					<div class="Text1">{{ $t(`security_center['有效时间：10分钟']`) }}</div>
					<div class="Text_s mt_16 mb_8">{{ $t(`security_center['验证码']`) }}</div>
					<VerificationCode
						@VerificationCodeInput="VerificationCodeInput"
						@sendVerificationCode="sendVerificationCode"
						v-model="verificationBtn"
						:disabled="verificationBtn"
						ref="VerificationCodeRef"
					/>
				</div>
				<div class="mt_40 mb_12">
					<button class="common_btn" :disabled="disabledBtn" type="button" @click="onSubmit">
						{{ isCreate ? $t(`security_center['确定']`) : $t(`security_center['下一步']`) }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import Common from "/@/utils/common";
import showToast from "/@/hooks/useToast";
import { userApi } from "/@/api/user";
import { useUserStore } from "/@/stores/modules/user";
import { useModalStore } from "/@/stores/modules/modalStore";
import CommonRegex from "/@/utils/CommonRegex";
const modalStore = useModalStore();
const userStore = useUserStore();
const VerificationCodeRef = ref(null);

// 登录表单
const payLoad = reactive({
	email: "",
	verifyCode: "",
	type: 1,
});
const isCreate = ref(true);
const isEdit = ref(false);
// 校验完成登录按钮可以点击
const disabledBtn = ref(true);
const verificationBtn = ref(true);
const userVerifyTypeVerifyError = ref(false);

const sendVerificationCode = async () => {
	const params = {
		email: isCreate.value ? payLoad.email : userStore.getUserGlobalSetInfo.email,
	};
	const res = await userApi.globalSendMail(params).catch((err) => err);
	const { code, message } = res;
	if (code == Common.ResCode.SUCCESS) {
		showToast(message, 1500);
		verificationBtn.value = true;
		(VerificationCodeRef.value as any).startCountdown(60);
	} else {
		showToast(message, 1500);
	}
};

const emailOnInput = () => {
	CommonRegex.userEmailRegex.test(payLoad.email) ? (userVerifyTypeVerifyError.value = false) : (userVerifyTypeVerifyError.value = true);
	verificationBtn.value = userVerifyTypeVerifyError.value;
	verifyBtn();
};
const VerificationCodeInput = (verifyCode: string) => {
	payLoad.verifyCode = verifyCode;
	verifyBtn();
};
const verifyBtn = () => {
	if (isCreate.value) {
		if (!userVerifyTypeVerifyError.value && payLoad.verifyCode) {
			disabledBtn.value = false;
		} else {
			disabledBtn.value = true;
		}
	} else {
		if (payLoad.verifyCode) {
			disabledBtn.value = false;
		} else {
			disabledBtn.value = true;
		}
	}
};

const onSubmit = async () => {
	verificationBtn.value = true;
	const params = {
		type: payLoad.type,
		verifyCode: payLoad.verifyCode,
	};
	const checkVerifyRes = await userApi.checkVerifyCode(params).catch((error) => error);
	if (checkVerifyRes.code === Common.ResCode.SUCCESS) {
		if (isCreate.value) {
			const params = {
				type: payLoad.type,
				verifyCode: payLoad.verifyCode,
				account: payLoad.email,
			};
			const res = await userApi.bindAccount(params).catch((err) => err);
			await userStore.uplateUserGlobalSetInfo();
			const { code, data, message } = res;
			if (code == Common.ResCode.SUCCESS) {
				modalStore.closeModal();
				showToast(message);
			} else {
				showToast(message);
			}
		} else {
			payLoad.verifyCode = "";
			showToast(checkVerifyRes.message);
			isCreate.value = true;
			isEdit.value = true;
			disabledBtn.value = true;
		}
	}
};
onMounted(() => {
	if (userStore.getUserGlobalSetInfo.email) {
		isCreate.value = false;
		verificationBtn.value = false;
	}
});
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
