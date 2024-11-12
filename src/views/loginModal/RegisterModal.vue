<!-- src/components/RegisterForm.vue -->
<template>
	<div class="loginWrapper">

		<div class="login_right_form">
			<div class="login_text fs_24 mb_27">
				<span>{{ $t(`login['注册']`) }}</span>
			</div>
			<div class="login_form">
				<!-- 账号 -->
				<div>
					<p class="Text_s mb_8 mt_8 fs_14"><span class="Wran_text">*</span>{{ $t(`login['账号']`) }}</p>
					<p>
						<input
							type="text"
							v-model="payLoad.userAccount"
							class="common_input"
							:placeholder="$t(`login['输入账号']`)"
							@input="userOnInput"
									maxlength="11"
							:class="VerifyError.userAccount ? 'verifyError' : ''"
						/>
					</p>
					<p v-show="VerifyError.userAccount" class="Wran_text fs_10 mt_2">{{ $t(`login['账号规则']`) }}</p>
				</div>
				<!-- 密码 -->
				<div>
					<p class="Text_s mb_8 mt_8 fs_14"><span class="Wran_text">*</span>{{ $t(`login['登录密码']`) }}</p>
					<p class="common_password">
						<input
							:type="showPassword ? 'text' : 'password'"
							v-model="payLoad.password"
							class="common_input"
							:placeholder="$t(`login['输入密码']`)"
							@input="passOnInput"
							autocomplete="new-password"
										maxlength="16"
						/>
						<span class="eyes">
							<svg-icon :name="showPassword ? 'eyes':'eyes_on'" size="18px" @click="showPassword = !showPassword" />
						</span>
					</p>
					<p v-show="VerifyError.passWord" class="Wran_text fs_10 mt_2">{{ $t(`login['密码规则']`) }}</p>
				</div>
				<!-- 确认密码 -->
				<div>
					<p class="Text_s mb_8 mt_8 fs_14"><span class="Wran_text">*</span>{{ $t(`login['确认密码']`) }}</p>
					<p class="common_password">
						<input
							:type="showConfirmPassword ? 'text' : 'password'"
							v-model="payLoad.confirmPassword"
							class="common_input"
							:placeholder="$t(`login['输入确认密码']`)"
							@input="confirmOnInput"
								maxlength="16"
						/>
						<span class="eyes">
							<svg-icon :name="showConfirmPassword ? 'eyes':'eyes_on'" size="18px" @click="showConfirmPassword = !showConfirmPassword" />
						</span>
					</p>
					<p v-show="VerifyError.confirmPassword" class="Wran_text fs_10 mt_2">{{ $t(`login['两次输入密码不一致']`) }}</p>
				</div>

				<div>
					<p class="Text_s mb_8 mt_8 fs_14"><span class="Wran_text">*</span>{{ $t(`login['主货币']`) }}</p>
					<p style="height: 46px">
						<DropdownSelect :options="options" :placeholder="$t(`login['选择货币']`)" @update:modelValue="handleSelect" :model="payLoad.mainCurrency" />
					</p>
				</div>

				<div>
					<p class="Text_s mb_8 mt_8 fs_14 flex_start">{{ $t(`login['输入推荐码']`) }} 
						<svg-icon name="common-common-common-arrow_down_on" size="14px" class="ml_4 curp" @click="openinviteCode = !openinviteCode" v-if="openinviteCode"/>
						<svg-icon name="common-common-arrow_up_on" size="14px" class="ml_4 curp" @click="openinviteCode = !openinviteCode" v-else/>
					</p>
					<p class="common_password" v-if="openinviteCode"><input type="text" v-model="payLoad.inviteCode" class="common_input" placeholder="输入推荐码" /></p>
				</div>
				<div class="fs_12 userAgreement" :class="userAgreement ? 'Text_s' : 'Text1'" >
					<svg-icon
						class="curp"
						:name="userAgreement ? 'check_icon_on' : 'check_icon'"
						size="14px"
						@click="userAgreementOnInput"
						:style="{ color: userAgreement ? 'var(--Theme)' : '' }"
					/>
					<span
						>{{ $t(`login['我同意']`) }} <span class="Wran_text curp" @click="toHelpCenter"> {{ $t(`login['用户协议']`) }}</span> {{ $t(`login['并确认我已年满18岁']`) }}</span
					>
				</div>
				<div class="fs_12 userAgreement" :class="advertise ? 'Text_s' : 'Text1'">
					<svg-icon
						class="curp"
						:name="advertise ? 'check_icon_on' : 'check_icon'"
						size="14px"
						@click="advertise = !advertise"
						:style="{ color: advertise ? 'var(--Theme)' : '' }"
					/>

					<span>{{ $t(`login['我同意接收']`) }}[<span class="Wran_text">oksport</span>]{{ $t(`login['的营销促销信息']`) }}</span>
				</div>
				<div class="mt_16 mb_16">
					<Button :disabled="disabledBtn || !isOnloadScript"  @click="onLogin">{{ $t(`login['注册']`) }}</Button>
				</div>
				<div class="flex-center fs_12">
					<div class="Text1">
						{{ $t(`login['已有账号']`) }}<span class="Wran_text curp" @click="toLogin">{{ $t(`login['登录']`) }}</span>
					</div>
				</div>
			</div>
		</div>
		<p>
			<div id="captcha-element" ref="captchaBtn"/>
			<Hcaptcha :onSubmit="onSubmit" ref="hcaptcha" v-model="isOnloadScript" v-if="HcaptchaMounted"/>
		</p>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { loginApi } from "/@/api/login";
import Common from "/@/utils/common";
import { useUserStore } from "/@/stores/modules/user";
import { useModalStore } from "/@/stores/modules/modalStore";
import DropdownSelect from "/@/components/DropdownSelect/index.vue";
import showToast from "/@/hooks/useToast";
import { userApi } from "/@/api/user";
import router from "/@/router";
import { CommonApi } from "/@/api/common";
import CommonRegex from "/@/utils/CommonRegex";
const modalStore = useModalStore();
const UserStore = useUserStore();

const hcaptcha: any = ref(null);
const captchaBtn: any = ref(null);
const openinviteCode = ref(false)
const isOnloadScript = ref(false)
const HcaptchaMounted = ref(false)

const payLoad = reactive({
	userAccount: "",
	password: "",
	confirmPassword: "",
	mainCurrency: "",
	inviteCode: "",
});
const disabledBtn = ref(true);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const userAgreement = ref(false);
const advertise = ref(true);

const VerifyError = reactive({
	userAccount: false,
	passWord: false,
	confirmPassword: false,
});

onMounted(() => {
	Common.loadScript("https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js").then(() => {
		HcaptchaMounted.value = true;
	});
	if (UserStore.getRegisterModalInfo) {
		Object.assign(payLoad, UserStore.getRegisterModalInfo);
	}
});

const passOnInput = () => {
	CommonRegex.passWordregex.test(payLoad.password) ? (VerifyError.passWord = false) : (VerifyError.passWord = true);
	verifyBtn();
};
const userOnInput = () => {
	CommonRegex.userAccountRegex.test(payLoad.userAccount) ? (VerifyError.userAccount = false) : (VerifyError.userAccount = true);
	verifyBtn();
};
const confirmOnInput = () => {
	payLoad.confirmPassword === payLoad.password ? (VerifyError.confirmPassword = false) : (VerifyError.confirmPassword = true);
	verifyBtn();
};

const userAgreementOnInput = () => {
	userAgreement.value = !userAgreement.value;
	verifyBtn();
};
const verifyBtn = () => {
	if (payLoad.password && payLoad.userAccount && payLoad.confirmPassword && payLoad.mainCurrency &&userAgreement.value) {
		if (!VerifyError.userAccount && !VerifyError.passWord && !VerifyError.confirmPassword) {
			disabledBtn.value = false;
		} else {
			disabledBtn.value = true;
		}
	} else {
		disabledBtn.value = true;
	}
};
const onSubmit = async (token: string) => {
	const certifyId = hcaptcha.value.certifyId;
	const res = await loginApi.userRegister({ ...payLoad, certifyId }).catch((err) => err);
	const { code, data, message } = res;
	if (code == Common.ResCode.SUCCESS) {
		modalStore.closeModal();
		localStorage.setItem("userInfo", JSON.stringify(data));
		UserStore.setUserInfo(data);
		UserStore.initUserInfo();
		showToast(message, 1500);
	} else {
		showToast(message, 1500);
	}
};
const onLogin = async () => {
	if (!userAgreement.value) {
		showToast("请确定已阅读用户协议");
	} else {
		captchaBtn.value.click();
	}
};
const options = UserStore.getCurrencyList;

const handleSelect = (option: any) => {
	payLoad.mainCurrency = option.currencyCode;
	verifyBtn();
};

// const getUserInfo = async () => {
// 	const res = await userApi.getIndexInfo().catch((err) => err);
// 	const { code, data, message } = res;
// 	if (code == Common.ResCode.SUCCESS) {
// 		const userInfo = { ...UserStore.getUserInfo, ...data };
// 		UserStore.setUserInfo(userInfo);
// 		localStorage.setItem("userInfo", JSON.stringify(userInfo));
// 	} else {
// 		showToast(message, 1500);
// 	}
// };
const toHelpCenter = () => {
	UserStore.setRegisterModalInfo(payLoad);
	router.push({
		path: "/userAgreement",
	});
	modalStore.closeModal();
};
const toLogin = () => {
	modalStore.openModal("LoginModal");
};
</script>

<style lang="scss" scoped>
.loginWrapper {
	width: 436px;
	height: 663px;
	border-radius: 12px;
	background: var(--Bg);
	background-image: url("./image/headerBg.png"), url("./image/bottomBg.png");
	background-repeat: no-repeat no-repeat;
	background-size: 100% auto, 320px;
	background-position: top, bottom left;
	.login_left_img {
		img {
			height: 100%;
			width: 100%;
			border-radius: 12px;
		}
	}
	.login_right_form {
		height: 100%;
		padding: 18px 25px;
		overflow-y: auto;
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
			color: var(--Text-s);
			font-weight: 500;
			text-align: center;
		}
		.userAgreement {
			display: flex;
			gap: 4px;
			margin: 6px 0;
		}
	}
	.login_right_form::-webkit-scrollbar {
		display: none;
	}
}
</style>
