<!-- src/components/RegisterForm.vue -->
<template>
	<div class="loginWrapper">
		<div class="login_left_img">
			<img src="/@/assets/common/login_left.png" alt="" />
		</div>
		<div class="login_right_form">
			<div class="login_text fs_16 mb_20">
				<span> {{ $t(`login['忘记密码']`) }}</span>
			</div>

			<div class="login_form">
				<!-- 第一步 -->
				<div v-if="currentStep === 0">
					<p class="Text_s mb_8 mt_8 fs_12"><span class="Wran_text">*</span>{{ $t(`login['账号']`) }}</p>
					<p>
						<input
							type="text"
							v-model="payLoad.userAccount"
							class="common_input"
							:placeholder="$t(`login['输入账号']`)"
							@input="userOnInput"
							:class="userAccountVerifyError ? 'verifyError' : ''"
						/>
					</p>
					<p v-show="userAccountVerifyError" class="Wran_text fs_12 mt_2">{{ $t(`login['账号规则']`) }}</p>
				</div>

				<!-- 第二步 -->
				<div v-else-if="currentStep === 1">
					<p class="Text_s mb_8 mt_8 fs_14">{{ verifyType == "email" ? $t(`login['邮箱验证']`) : $t(`login['手机号验证']`) }}</p>
					<p class="Theme_text fs_12 text_unline curp">
						<span @click="changeVerifyType">{{ $t(`login['其他方式']`) }}</span>
					</p>
					<div>
						<p class="Text_s mb_8 mt_8 fs_12"><span class="Wran_text">*</span>{{ verifyType == "email" ? $t(`login['电子邮箱']`) : $t(`login['电话号码']`) }}</p>
						<p>
							<input
								type="text"
								v-model="payLoad.email"
								class="common_input"
								:placeholder="$t(`login['输入邮箱']`)"
								@input="emailOnInput"
								v-if="verifyType == 'email'"
								:class="userVerifyTypeVerifyError ? 'verifyError' : ''"
							/>
							<AreaCode v-else @update:modelValue="areaCodeInput" :options="AreaCodeOptions" :type="verifyType" :class="userVerifyTypeVerifyError ? 'verifyError' : ''"></AreaCode>
						</p>
						<p v-show="userVerifyTypeVerifyError" class="Wran_text fs_12 mt_2">
							{{ verifyType == "email" ? $t(`login['电子邮箱不正确']`) : $t(`security_center['请输入8-12位数字']`, { min: minLength, max: maxLength }) }}
						</p>
					</div>
					<div>
						<p class="Text_s mb_8 mt_8 fs_12"><span class="Wran_text">*</span>{{ $t(`login['验证码']`) }}</p>
						<p>
							<VerificationCode
								@VerificationCodeInput="VerificationCodeInput"
								@sendVerificationCode="sendVerificationCode"
								v-model="verificationBtn"
								:disabled="verificationBtn && payLoad.email"
								ref="VerificationCodeRef"
								v-show="verifyType == 'email'"
							/>
							<VerificationCode
								@VerificationCodeInput="VerificationCodeInput"
								@sendVerificationCode="sendVerificationCode"
								v-model="verificationBtn2"
								:disabled="verificationBtn2 && payLoad.phone"
								ref="VerificationCodeRef2"
								v-show="verifyType == 'phone'"
							/>
						</p>
					</div>
					<p class="fs_10 Text1 mt_16 fw_200">
						{{ $t(`login['有效时间']`) }}<span class="Theme_text">{{ $t(`login['联系客服']`) }}</span>
					</p>
				</div>
				<!-- 第三步 -->
				<div v-else-if="currentStep === 2">
					<p class="Text_s mb_8 mt_8 fs_14">{{ $t(`login['新密码']`) }}</p>
					<!-- 密码 -->
					<div>
						<p class="Text_s mb_8 mt_8 fs_12"><span class="Wran_text">*</span>{{ $t(`login['密码']`) }}</p>
						<p class="common_password">
							<input
								:type="showPassword ? 'password' : 'text'"
								v-model="payLoad.password"
								class="common_input"
								:placeholder="$t(`login['输入密码']`)"
								@input="passOnInput"
								autocomplete="new-password"
								:class="VerifyError.passWord ? 'verifyError' : ''"
							/>
							<span class="eyes">
								<svg-icon :name="showPassword ? 'eyes_on' : 'eyes'" size="14px" @click="showPassword = !showPassword" />
							</span>
						</p>
						<p v-show="VerifyError.passWord" class="Wran_text fs_12 mt_2">{{ $t(`login['密码规则']`) }}</p>
					</div>
					<!-- 确认密码 -->
					<div>
						<p class="Text_s mb_8 mt_8 fs_12"><span class="Wran_text">*</span>{{ $t(`login['确认密码']`) }}</p>
						<p class="common_password">
							<input
								:type="showConfimPassword ? 'password' : 'text'"
								v-model="payLoad.confirmPassword"
								class="common_input"
								:placeholder="$t(`login['输入密码']`)"
								@input="confirmOnInput"
								autocomplete="new-password"
								:class="VerifyError.confirmPassword ? 'verifyError' : ''"
							/>
							<span class="eyes">
								<svg-icon :name="showConfimPassword ? 'eyes_on' : 'eyes'" size="14px" @click="showConfimPassword = !showConfimPassword" />
							</span>
						</p>
						<p v-show="VerifyError.confirmPassword" class="Wran_text fs_12 mt_2">{{ $t(`login['两次输入密码不一致']`) }}</p>
					</div>
				</div>
				<div class="mt_40 mb_12">
					<button class="common_btn" :disabled="disabledBtn" type="button" @click="onNextStep(currentStep)">{{ currentStep === 2 ? "确定" : $t(`login['下一步']`) }}</button>
					<div class="flex-center mt_12 Theme_text fs_12 curp" v-if="currentStep === 0">联系客服</div>
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
const modalStore = useModalStore();
const UserStore = useUserStore();
const currentStep = ref(0);
const VerificationCodeRef = ref(null);
const VerificationCodeRef2 = ref(null);
enum verifyTypeEnum {
	email = "email",
	phone = "phone",
}
const verifyType = ref(verifyTypeEnum.email);
const VerifyError = reactive({
	userAccount: false,
	passWord: false,
	confirmPassword: false,
});

// 验证码
const hcaptcha: any = ref(null);
const AreaCodeOptions: any = ref([]);
// 登陆表单
const payLoad = reactive({
	userAccount: "",
	phone: "",
	email: "",
	areaCode: "",
	verifyCode: "",
	password: "",
	confirmPassword: "",
});
//账号密码校验规则
const minLength = ref(8);
const maxLength = ref(13);

const getAreaCodeDownBox = async () => {
	const res = await CommonApi.getAreaCodeDownBox().catch((err) => err);
	const { code, message, data } = res;
	if (code == Common.ResCode.SUCCESS) {
		AreaCodeOptions.value = data;
		payLoad.areaCode = data[0]?.areaCode;
		minLength.value = data[0]?.minLength;
		maxLength.value = data[0]?.maxLength;
	} else {
		showToast(message);
	}
};
//显示校验提示
const userAccountVerifyError = ref(false);
const userVerifyTypeVerifyError = ref(false);
// 校验完成登陆按钮可以点击
const disabledBtn = ref(true);
const verificationBtn = ref(true);
const verificationBtn2 = ref(true);
// 显示密码
const showPassword = ref(true);
const showConfimPassword = ref(true);
// 监听输入框变化
const userOnInput = () => {
	CommonRegex.userAccountRegex.test(payLoad.userAccount) ? (userAccountVerifyError.value = false) : (userAccountVerifyError.value = true);
	verifyBtn();
};
const emailOnInput = () => {
	CommonRegex.userEmailRegex.test(payLoad.email) ? (userVerifyTypeVerifyError.value = false) : (userVerifyTypeVerifyError.value = true);
	verificationBtn.value = userVerifyTypeVerifyError.value;
	verifyBtn();
};
const passOnInput = () => {
	CommonRegex.passWordregex.test(payLoad.password) ? (VerifyError.passWord = false) : (VerifyError.passWord = true);
	verifyBtn();
};
const confirmOnInput = () => {
	payLoad.confirmPassword === payLoad.password ? (VerifyError.confirmPassword = false) : (VerifyError.confirmPassword = true);
	verifyBtn();
};
// 手机号区号输入变化
const areaCodeInput = (data: any) => {
	const { phone, areaCode } = data;
	if (areaCode) {
		const data = AreaCodeOptions.value.find((item: any) => item.areaCode === areaCode);
		minLength.value = data.minLength;
		maxLength.value = data.maxLength;
	}

	if (phone) {
		const userPhoneRegex = new RegExp(`^\\d{${minLength.value},${maxLength.value}}$`);
		payLoad.phone = phone;
		userPhoneRegex.test(payLoad.phone) ? (userVerifyTypeVerifyError.value = false) : (userVerifyTypeVerifyError.value = true);
		verificationBtn2.value = userVerifyTypeVerifyError.value;
		verifyBtn();
	} else {
		payLoad.areaCode = areaCode;
	}
};

// 表单验证
const verifyBtn = () => {
	switch (currentStep.value) {
		case 0:
			if (!userAccountVerifyError.value && payLoad.userAccount) {
				disabledBtn.value = false;
			} else {
				disabledBtn.value = true;
			}
			break;
		case 1:
			if (!userVerifyTypeVerifyError.value && (payLoad.email || payLoad.phone) && payLoad.verifyCode) {
				disabledBtn.value = false;
			} else {
				disabledBtn.value = true;
			}
			break;
		case 2:
			if (!VerifyError.passWord && !VerifyError.confirmPassword) {
				disabledBtn.value = false;
			} else {
				disabledBtn.value = true;
			}
			break;
	}
};
// 切换类型
const changeVerifyType = () => {
	if (verifyType.value === verifyTypeEnum.email) {
		verifyType.value = verifyTypeEnum.phone;
	} else {
		verifyType.value = verifyTypeEnum.email;
		emailOnInput();
	}
};
// 下一步
const onNextStep = async (step: number) => {
	let res = null;
	switch (step) {
		case 0:
			res = await loginApi.submitAccount(payLoad).catch((err) => err);
			getAreaCodeDownBox();
			break;
		case 1:
			const params = {
				type: verifyType.value === verifyTypeEnum.email ? "1" : 2,
				userAccount: payLoad.userAccount,
				account: verifyType.value === verifyTypeEnum.email ? payLoad.email : payLoad.phone,
				verifyCode: payLoad.verifyCode,
				areaCode: payLoad.areaCode,
			};
			res = await loginApi.checkVerifyCode(params).catch((err) => err);
			break;
		case 2:
			const params2 = {
				userAccount: payLoad.userAccount,
				account: verifyType.value === verifyTypeEnum.email ? payLoad.email : payLoad.phone,
				newPassword: payLoad.password,
				confirmPassword: payLoad.confirmPassword,
			};
			res = await loginApi.resetPassword(params2).catch((err) => err);
			break;
	}
	const { code, message } = res;
	if (code == Common.ResCode.SUCCESS) {
		if (currentStep.value === 2) {
			localStorage.setItem("loginInfo", "");
			UserStore.setLoginInfo({});
			modalStore.openModal("LoginModal");
			showToast(message, 1500);
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
// 发送验证码
const sendVerificationCode = async () => {
	if (verifyType.value == verifyTypeEnum.email) {
		if (!CommonRegex.userEmailRegex.test(payLoad.email)) {
			showToast("邮箱格式不正确", 1500);
			verificationBtn.value = true;
		} else {
			const params = {
				userAccount: payLoad.userAccount,
				email: payLoad.email,
			};
			const res = await loginApi.sendMail(params).catch((err) => err);
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
		const userPhoneRegex = new RegExp(`^\\d{${minLength.value},${maxLength.value}}$`);
		if (!userPhoneRegex.test(payLoad.phone)) {
			showToast("手机号不正确", 1500);
			verificationBtn2.value = true;
			return;
		} else {
			const params = {
				userAccount: payLoad.userAccount,
				phone: payLoad.phone,
				areaCode: payLoad.areaCode,
			};
			console.log(payLoad);
			const res = await loginApi.sendSms(params).catch((err) => err);
			const { code, message } = res;
			if (code == Common.ResCode.SUCCESS) {
				showToast(message, 1500);
				verificationBtn2.value = true;
				(VerificationCodeRef2.value as any).startCountdown(60);
			} else {
				showToast(message, 1500);
			}
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
		showToast("登陆成功");
	} else {
		payLoad.userAccount = "";
		showToast(message);
	}
};
</script>

<style lang="scss" scoped>
.loginWrapper {
	width: 680px;
	height: 542px;
	display: flex;
	border-radius: 12px;
	background: var(--Bg);
	> div {
		width: 50%;
	}
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
