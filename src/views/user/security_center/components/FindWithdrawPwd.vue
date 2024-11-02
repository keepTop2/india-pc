<!-- src/components/RegisterForm.vue -->
<template>
	<div class="loginWrapper">
		<div class="login_right_form">
			<div class="login_text fs_20 mb_20">
				<span> {{ $t(`security_center['找回交易密码']`) }}</span>
			</div>

			<div class="login_form">
				<!-- 第一步 -->
				<div v-if="currentStep === 0">
					<p class="Text_s mb_8 mt_8">{{ verifyType == "email" ? $t(`security_center['邮箱验证']`) : $t(`security_center['手机号验证']`) }}</p>
					<p class="color_Theme fs_12 text_unline curp">
						<span @click="changeVerifyType" v-if="UserStore.getUserGlobalSetInfo.email && UserStore.getUserGlobalSetInfo.phone">{{ $t(`security_center['其他方式']`) }}</span>
					</p>
					<div>
						<p class="Text_s mb_8 mt_8">{{ $t(`security_center['登录密码']`) }}</p>
						<p class="common_password">
							<input
								:type="showPassword ? 'text' : 'password'"
								v-model="payLoad.password"
								class="common_input"
								@input="passOnInput"
								maxlength="16"
								autocomplete="new-password"
								:class="VerifyError.passWord ? 'verifyError' : ''"
							/>
							<span class="eyes">
								<svg-icon :name="showPassword ? 'eyes' : 'eyes_on'" size="14px" @click="showPassword = !showPassword" />
							</span>
						</p>
						<p v-show="VerifyError.passWord" class="Wran_text fs_12 mt_2">{{ $t(`security_center['8-16位，必须包含 数字和字母']`) }}</p>
					</div>
				</div>
				<!-- 第二部 -->
				<div v-else-if="currentStep === 1">
					<!-- 密码 -->
					<div>
						<p class="Text_s mb_8 mt_8 fs_16">{{ $t(`security_center['新交易密码']`) }}</p>
						<p class="common_password">
							<input
								:type="showNewPassword ? 'text' : 'password'"
								v-model="payLoad.newPassword"
								class="common_input"
								@input="newPassOnInput"
								maxlength="6"
								autocomplete="new-password"
								:class="VerifyError.newPassword ? 'verifyError' : ''"
							/>
							<span class="eyes">
								<svg-icon :name="showNewPassword ? 'eyes' : 'eyes_on'" size="14px" @click="showNewPassword = !showNewPassword" />
							</span>
						</p>
						<p v-show="VerifyError.newPassword" class="Wran_text fs_12 mt_2">{{ $t(`security_center['请输入6位数字']`) }}</p>
					</div>
					<!-- 确认密码 -->
					<div>
						<p class="Text_s mb_8 mt_8 fs_16">{{ $t(`security_center['确认交易密码']`) }}</p>
						<p class="common_password">
							<input
								:type="showConfimPassword ? 'text' : 'password'"
								v-model="payLoad.confirmPassword"
								class="common_input"
								@input="confirmOnInput"
								maxlength="6"
								autocomplete="new-password"
								:class="VerifyError.confirmPassword ? 'verifyError' : ''"
							/>
							<span class="eyes">
								<svg-icon :name="showConfimPassword ? 'eyes' : 'eyes_on'" size="14px" @click="showConfimPassword = !showConfimPassword" />
							</span>
						</p>
						<p v-show="VerifyError.confirmPassword" class="Wran_text fs_12 mt_2">{{ $t(`security_center['两次密码不一致']`) }}</p>
					</div>
					<div>
						<p class="Text_s mb_8 mt_8">{{ verifyType == "email" ? $t(`security_center['邮箱账号验证']`) : $t(`security_center['手机号验证']`) }}</p>
						<p class="Text1 mt_8" v-if="verifyType == 'phone'">
							{{ $t(`security_center['验证码将发送至手机号']`) }}+{{ UserStore.getUserGlobalSetInfo.areaCode }} {{ Common.maskString(UserStore.getUserGlobalSetInfo.phone) }}
						</p>
						<p class="Text1 mt_8" v-else>{{ $t(`security_center['验证码将发送至邮箱账号：']`) }}{{ Common.maskEmail(UserStore.getUserGlobalSetInfo.email) }}</p>
						<p class="Text1 mb_8">有效时间：10分钟</p>
					</div>
					<div>
						<p class="Text_s mb_8 mt_8">{{ $t(`security_center['验证码']`) }}</p>
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
							{{ $t(`security_center['未收到验证码？请重新发送或']`) }}<span class="color_Theme">{{ $t(`security_center['联系客服']`) }}</span>
						</p>
					</div>
				</div>
				<div class="mt_40 mb_12">
					<button class="common_btn" :disabled="disabledBtn" type="button" @click="onNextStep(currentStep)">
						{{ currentStep === 2 ? $t(`security_center['确定']`) : $t(`security_center['下一步']`) }}
					</button>
				</div>
			</div>
		</div>
	</div>
	<!-- 验证码容器 -->
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { loginApi } from "/@/api/login";
import Common from "/@/utils/common";
import AreaCode from "/@/components/AreaCode/index.vue";
import { useUserStore } from "/@/stores/modules/user";
import VerificationCode from "/@/components/VerificationCode/index.vue";
import showToast from "/@/hooks/useToast";
import { CommonApi } from "/@/api/common";
import { useModalStore } from "/@/stores/modules/modalStore";
import CommonRegex from "/@/utils/CommonRegex";
import { userApi } from "/@/api/user";
const modalStore = useModalStore();
const UserStore = useUserStore();
const currentStep = ref(0);
const VerificationCodeRef = ref(null);
const VerificationCodeRef2 = ref(null);
enum verifyTypeEnum {
	email = "email",
	phone = "phone",
}
const verifyType = ref(UserStore.getUserGlobalSetInfo.email ? verifyTypeEnum.email : verifyTypeEnum.phone);
const VerifyError = reactive({
	newPassword: false,
	passWord: false,
	confirmPassword: false,
});

// 验证码
const hcaptcha: any = ref(null);

const AreaCodeOptions: any = ref([]);
// 登录表单
const payLoad = reactive({
	userAccount: "",
	areaCode: "",
	verifyCode: "",
	password: "",
	confirmPassword: "",
	newPassword: "",
});
//账号密码校验规则
const minLength = ref(8);
const maxLength = ref(13);
const userAccountRegex = /^[a-zA-Z][a-zA-Z0-9]{3,10}$/;
const userEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passWordregex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@_$]{8,16}$/;

//显示校验提示
const userAccountVerifyError = ref(false);
const userVerifyTypeVerifyError = ref(false);
// 校验完成登录按钮可以点击
const disabledBtn = ref(true);
const verificationBtn = ref(false);
// 显示密码
const showPassword = ref(false);
const showNewPassword = ref(false);
const showConfimPassword = ref(false);

const passOnInput = () => {
	CommonRegex.passWordregex.test(payLoad.password) ? (VerifyError.passWord = false) : (VerifyError.passWord = true);
	verifyBtn();
};
const newPassOnInput = () => {
	CommonRegex.withdrawPwd.test(payLoad.newPassword) ? (VerifyError.newPassword = false) : (VerifyError.newPassword = true);
	verifyBtn();
};
const confirmOnInput = () => {
	payLoad.confirmPassword === payLoad.newPassword ? (VerifyError.confirmPassword = false) : (VerifyError.confirmPassword = true);
	verifyBtn();
};

// 表单验证
const verifyBtn = () => {
	switch (currentStep.value) {
		case 0:
			if (!VerifyError.passWord) {
				disabledBtn.value = false;
			} else {
				disabledBtn.value = true;
			}
			break;
		case 1:
			if (payLoad.confirmPassword == payLoad.newPassword && payLoad.verifyCode) {
				disabledBtn.value = false;
			} else {
				disabledBtn.value = true;
			}
			break;
	}
};

const changeVerifyType = () => {
	if (verifyType.value === verifyTypeEnum.email) {
		verifyType.value = verifyTypeEnum.phone;
	} else {
		verifyType.value = verifyTypeEnum.email;
	}
};

const onNextStep = async (step: number) => {
	let res = null;
	switch (step) {
		case 0:
			const params0 = {
				password: payLoad.password,
				type: 0,
			};
			res = await userApi.reFindWithdrawPwd(params0).catch((err) => err);
			break;
		case 1:
			const params = {
				newPassword: payLoad.newPassword,
				confirmPassword: payLoad.confirmPassword,
				verifyCode: payLoad.verifyCode,
			};
			res = await userApi.reSetWithdrawPwd(params).catch((err) => err);
			break;
	}
	const { code, message } = res;
	if (code == Common.ResCode.SUCCESS) {
		if (currentStep.value === 1) {
			showToast(message, 1500);
			UserStore.uplateUserGlobalSetInfo();
			modalStore.closeModal();
		} else {
			currentStep.value++;
		}
		disabledBtn.value = true;
	} else {
		showToast(message, 1500);
	}
};

const VerificationCodeInput = (verifyCode: string) => {
	payLoad.verifyCode = verifyCode;
	verifyBtn();
};

const sendVerificationCode = async () => {
	if (verifyType.value == verifyTypeEnum.email) {
		if (!userEmailRegex.test(UserStore.getUserGlobalSetInfo.email)) {
			showToast("邮箱格式不正确", 1500);
			verificationBtn.value = true;
		} else {
			const params = {
				email: UserStore.getUserGlobalSetInfo.email,
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
		}
	} else {
		const params = {
			phone: UserStore.getUserGlobalSetInfo.phone,
			areaCode: UserStore.getUserGlobalSetInfo.areaCode,
		};
		const res = await userApi.globalSendSms(params).catch((err) => err);
		const { code, message } = res;
		if (code == Common.ResCode.SUCCESS) {
			showToast(message, 1500);
			(VerificationCodeRef.value as any).startCountdown(60);
		} else {
			showToast(message, 1500);
		}
	}
};

const onSubmit = async (token: string) => {
	const res = await loginApi.submitAccount(payLoad).catch((err) => err);
	const { code, data, message } = res;
	if (code == Common.ResCode.SUCCESS) {
		modalStore.closeModal();
		localStorage.setItem("userInfo", JSON.stringify(data));
		UserStore.setUserInfo(data);
		showToast("登录成功");
	} else {
		payLoad.userAccount = "";
		showToast(message);
	}
};
</script>

<style lang="scss" scoped>
.loginWrapper {
	width: 448px;
	height: 542px;

	.login_left_img {
		img {
			height: 100%;
			width: 100%;
			border-radius: 12px;
		}
	}
	.login_right_form {
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
