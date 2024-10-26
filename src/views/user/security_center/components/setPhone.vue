<!-- src/components/RegisterForm.vue -->
<template>
	<div class="ChangePasswordWrapper">
		<div class="ChangePassword_form">
			<div class="login_text fs_20 mb_20">
				<span v-if="isCreate && !isEdit"> {{ $t(`security_center['绑定手机号']`) }}</span>
				<span v-else> {{ $t(`security_center['修改手机号']`) }}</span>
			</div>
			<div class="login_form">
				<div v-if="isCreate">
					<div>
						<p class="Text_s mb_8 mt_8"><span class="Wran_text">*</span>{{ $t(`security_center['新手机号']`) }}</p>
						<p class="common_password">
							<AreaCode @update:modelValue="areaCodeInput" :options="AreaCodeOptions" :class="userVerifyTypeVerifyError ? 'verifyError' : ''"></AreaCode>
						</p>
						<p v-show="userVerifyTypeVerifyError" class="Wran_text fs_12 mt_2">{{ $t(`security_center['请输入8-12位数字']`, { min: minLength, max: maxLength }) }}</p>
					</div>
					<div>
						<p class="Text_s mb_8 mt_8"><span class="Wran_text">*</span>{{ $t(`security_center['验证码']`) }}</p>
						<p class="common_password">
							<VerificationCode
								@VerificationCodeInput="VerificationCodeInput"
								@sendVerificationCode="sendVerificationCode"
								v-model="verificationBtn"
								:disabled="verificationBtn && payLoad.phone !== ''"
								ref="VerificationCodeRef"
							/>
						</p>
						<p class="fs_14 Text1 mt_16 fw_200">
							{{ $t(`security_center['有效时间']`) }}<span class="Theme_text curp">{{ $t(`security_center['联系客服']`) }}</span>
						</p>
					</div>
				</div>
				<div v-else>
					<div class="Text_s mb_8">{{ $t(`security_center['原手机号']`) }}</div>
					<div class="Text1">
						{{ $t(`security_center['验证码将发送至手机号']`) }}+{{ userStore.getUserGlobalSetInfo.areaCode }} {{ Common.maskString(userStore.getUserGlobalSetInfo.phone) }}
					</div>
					<div class="Text1">{{ $t(`security_center['有效时间：10分钟']`) }}</div>
					<div class="Text_s mt_16 mb_8">{{ $t(`security_center['验证码']`) }}</div>
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
						{{ $t(`security_center['有效时间']`) }}<span class="Theme_text curp">{{ $t(`security_center['联系客服']`) }}</span>
					</p>
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
import { CommonApi } from "/@/api/common";

const modalStore = useModalStore();
const userStore = useUserStore();
const VerificationCodeRef = ref(null);

// 登录表单
const payLoad = reactive({
	phone: "",
	verifyCode: "",
	type: 2,
	areaCode: "",
});
const isCreate = ref(true);
const isEdit = ref(false);
const minLength = ref(8);
const maxLength = ref(13);
const AreaCodeOptions = ref([]);
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

// 校验完成登录按钮可以点击
const disabledBtn = ref(true);
const verificationBtn = ref(true);
const userVerifyTypeVerifyError = ref(false);

const sendVerificationCode = async () => {
	const userPhoneRegex = new RegExp(`^\\d{${minLength.value},${maxLength.value}}$`);
	if (!userPhoneRegex.test(payLoad.phone) && isCreate.value) {
		showToast("手机号不正确", 1500);
		return;
	} else {
		const params = {
			phone: isCreate.value ? payLoad.phone : userStore.getUserGlobalSetInfo.phone,
			areaCode: isCreate.value ? payLoad.areaCode : userStore.getUserGlobalSetInfo.areaCode,
		};
		const res = await userApi.globalSendSms(params).catch((err) => err);
		const { code, message } = res;
		if (code == Common.ResCode.SUCCESS) {
			showToast(message, 1500);
			verificationBtn.value = true;
			(VerificationCodeRef.value as any).startCountdown(60);
		} else {
			showToast(message, 1500);
		}
	}
};
const areaCodeInput = (data: any) => {
	const { phone, areaCode } = data;
	if (areaCode) {
		const data: any = AreaCodeOptions.value.find((item: any) => item.areaCode === areaCode);
		minLength.value = data.minLength;
		maxLength.value = data.maxLength;
	}
	if (phone) {
		payLoad.phone = phone;
		const userPhoneRegex = new RegExp(`^\\d{${minLength.value},${maxLength.value}}$`);
		userPhoneRegex.test(payLoad.phone) ? (userVerifyTypeVerifyError.value = false) : (userVerifyTypeVerifyError.value = true);
		verificationBtn.value = userVerifyTypeVerifyError.value;
		verifyBtn();
	} else {
		payLoad.areaCode = areaCode;
	}
};
const VerificationCodeInput = (verifyCode: string) => {
	payLoad.verifyCode = verifyCode;
	verifyBtn();
};
const verifyBtn = () => {
	if (!isCreate.value) {
		if (payLoad.verifyCode) {
			disabledBtn.value = false;
		} else {
			disabledBtn.value = true;
		}
	} else {
		if (!userVerifyTypeVerifyError.value && payLoad.verifyCode) {
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
				areaCode: payLoad.areaCode,
				account: payLoad.phone,
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
			await getAreaCodeDownBox();
			showToast(checkVerifyRes.message);
			disabledBtn.value = true;
			isEdit.value = true;
			isCreate.value = true;
		}
	}
};
onMounted(() => {
	if (userStore.getUserGlobalSetInfo.phone) {
		isCreate.value = false;
		verificationBtn.value = false;
	} else {
		getAreaCodeDownBox();
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
