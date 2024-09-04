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
						<input type="text" :value="payLoad.userAccount" class="common_input" :placeholder="$t(`login['输入账号']`)" @input="userOnInput" />
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
							<input type="text" :value="payLoad.email" class="common_input" :placeholder="$t(`login['输入账号']`)" @input="emailOnInput" v-if="verifyType == 'email'" />
							<AreaCode v-else @update:modelValue="areaCodeInput" :options="options"></AreaCode>
						</p>
						<p v-show="userVerifyTypeVerifyError" class="Wran_text fs_12 mt_2">{{ verifyType == "email" ? $t(`login['电子邮箱不正确']`) : $t(`login['电话号码不正确']`) }}</p>
					</div>
					<div>
						<p class="Text_s mb_8 mt_8 fs_12"><span class="Wran_text">*</span>{{ $t(`login['验证码']`) }}</p>
						<p>
							<VerificationCode @update:modelValue="VerificationCodeInput" @sendVerificationCode="sendVerificationCode" :disabled="verificationBtn" />
						</p>
					</div>
					<p class="fs_10 Text1 mt_16 fw_200">
						{{ $t(`login['有效时间']`) }}<span class="Theme_text">{{ $t(`login['联系客服']`) }}</span>
					</p>
				</div>
				<!-- 第三步 -->
				<div v-else-if="currentStep === 2">
					<p class="Text_s mb_8 mt_8 fs_16">{{ $t(`login['新密码']`) }}</p>
					<!-- 密码 -->
					<div>
						<p class="Text_s mb_8 mt_8"><span class="Wran_text">*</span>{{ $t(`login['密码']`) }}</p>
						<p class="common_password">
							<input type="password" :value="payLoad.password" class="common_input" :placeholder="$t(`login['输入密码']`)" @input="passOnInput" />
						</p>
						<p v-show="VerifyError.passWord" class="Wran_text fs_12 mt_2">{{ $t(`login['密码规则']`) }}</p>
					</div>
					<!-- 确认密码 -->
					<div>
						<p class="Text_s mb_8 mt_8"><span class="Wran_text">*</span>{{ $t(`login['确认密码']`) }}</p>
						<p class="common_password">
							<input type="password" :value="payLoad.confirmPassword" class="common_input" :placeholder="$t(`login['输入密码']`)" @input="confirmOnInput" />
						</p>
						<p v-show="VerifyError.confirmPassword" class="Wran_text fs_12 mt_2">{{ $t(`login['两次输入密码不一致']`) }}</p>
					</div>
				</div>
				<div class="mt_40 mb_12">
					<button class="common_btn" :disabled="disabledBtn" type="button" @click="onNextStep(currentStep)">{{ $t(`login['下一步']`) }}</button>
				</div>
			</div>
		</div>
	</div>
	<Hcaptcha ref="hcaptcha" @submit="onSubmit" />
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { loginApi } from "/@/api/login";
import Common from "/@/utils/common";
import eventBus from "/@/utils/eventBus";
import AreaCode from "/@/components/AreaCode/index.vue";
import { useUserStore } from "/@/stores/modules/user";
import VerificationCode from "/@/components/VerificationCode/index.vue";
import options from "/@/assets/ts/areaCode";
import showToast from "/@/hooks/useToast";
const UserStore = useUserStore();
const currentStep = ref(0);

const verificationBtn = ref(true);
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

// 登陆表单
const payLoad = reactive({
	userAccount: "",
	phone: "",
	email: "",
	areaCode: options[0].areaCode,
	verifyCode: "",
	password: "",
	confirmPassword: "",
});

//账号密码校验规则
const userAccountRegex = /^[a-zA-Z][a-zA-Z0-9]{3,10}$/;
const userEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const userPhoneRegex = /^\d{8,11}$/;
const passWordregex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@_$]{8,16}$/;

//显示校验提示
const userAccountVerifyError = ref(false);
const userVerifyTypeVerifyError = ref(false);
// 校验完成登陆按钮可以点击
const disabledBtn = ref(true);

// 显示密码
const showPassword = ref(false);

// 监听输入框变化
const userOnInput = (e: any) => {
	payLoad.userAccount = e.target.value;
	userAccountRegex.test(payLoad.userAccount) ? (userAccountVerifyError.value = false) : (userAccountVerifyError.value = true);
	verifyBtn();
};

const emailOnInput = (e: any) => {
	payLoad.email = e.target.value;
	userEmailRegex.test(payLoad.email) ? (userVerifyTypeVerifyError.value = false) : (userVerifyTypeVerifyError.value = true);
	verificationBtn.value = userVerifyTypeVerifyError.value;
	verifyBtn();
};

const passOnInput = (e: any) => {
	payLoad.password = e.target.value;
	passWordregex.test(payLoad.password) ? (VerifyError.passWord = false) : (VerifyError.passWord = true);
	verifyBtn();
};
const confirmOnInput = (e: any) => {
	payLoad.confirmPassword = e.target.value;
	payLoad.confirmPassword === payLoad.password ? (VerifyError.confirmPassword = false) : (VerifyError.confirmPassword = true);
	verifyBtn();
};

const areaCodeInput = (data: any) => {
	const { phone, areaCode } = data;
	if (phone) {
		payLoad.phone = phone;
		userPhoneRegex.test(payLoad.phone) ? (userVerifyTypeVerifyError.value = false) : (userVerifyTypeVerifyError.value = true);
		verificationBtn.value = userVerifyTypeVerifyError.value;
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
			res = await loginApi.submitAccount(payLoad).catch((err) => err);
			break;
		case 1:
			const params = {
				type: verifyType.value === verifyTypeEnum.email ? "1" : 2,
				userAccount: payLoad.userAccount,
				account: verifyType.value === verifyTypeEnum.email ? payLoad.email : payLoad.phone,
				verifyCode: payLoad.verifyCode,
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
			eventBus.emit("hide-modal");
			eventBus.emit("show-modal", "LoginModal");
			showToast(message, 1500);
		} else {
			currentStep.value++;
		}
	} else {
		showToast(message, 1500);
	}
	disabledBtn.value = true;
};

const VerificationCodeInput = (verifyCode: string) => {
	payLoad.verifyCode = verifyCode;
	verifyBtn();
};

const sendVerificationCode = async () => {
	if (verifyType.value == verifyTypeEnum.email) {
		if (!userEmailRegex.test(payLoad.email)) {
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
			} else {
				showToast(message, 1500);
				verificationBtn.value = true;
			}
		}
	} else {
		if (!userPhoneRegex.test(payLoad.phone)) {
			showToast("手机号不正确", 1500);
			verificationBtn.value = true;
			return;
		} else {
			const params = {
				userAccount: payLoad.userAccount,
				email: payLoad.phone,
			};
			const res = await loginApi.sendSms(params).catch((err) => err);
			const { code, message } = res;
			if (code == Common.ResCode.SUCCESS) {
				showToast(message, 1500);
			} else {
				showToast(message, 1500);
				verificationBtn.value = true;
			}
		}
	}
};
const onSubmit = async (token: string) => {
	const res = await loginApi.submitAccount(payLoad).catch((err) => err);
	const { code, data, message } = res;
	if (code == Common.ResCode.SUCCESS) {
		eventBus.emit("hide-modal");
		localStorage.setItem("userInfo", JSON.stringify(data));
		UserStore.setUserInfo(data);
		alert("登陆成功");
	} else {
		payLoad.userAccount = "";
		alert("error");
	}
};
</script>

<style lang="scss" scoped>
.loginWrapper {
	width: 680px;
	height: 542px;
	display: flex;
	border-radius: 12px;

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
