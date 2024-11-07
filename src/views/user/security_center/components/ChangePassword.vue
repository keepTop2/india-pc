<!-- src/components/RegisterForm.vue -->
<template>
	<div class="ChangePasswordWrapper">
		<div class="ChangePassword_form">
			<div class="login_text fs_20 mb_20">
				<span> {{ $t(`security_center['修改密码']`) }}</span>
			</div>
			<div class="login_form">
				<div>
					<!-- 旧密码 -->
					<div>
						<p class="Text_s mb_8 mt_8">{{ $t(`security_center['旧密码']`) }}</p>
						<p class="common_password">
							<input
								:type="showOldPassword ? 'text' : 'password'"
								v-model="payLoad.oldPassword"
								class="common_input"
								@input="oldPasswordOnInput"
								autocomplete="new-password"
								:maxlength="16"
							/>
							<span class="eyes">
								<svg-icon :name="showOldPassword ? 'eyes' : 'eyes_on'" size="14px" @click="showOldPassword = !showOldPassword" />
							</span>
						</p>
						<p v-show="VerifyError.oldPassword" class="Wran_text fs_12 mt_2">{{ $t(`security_center['8-16位，必须包含 数字和字母']`) }}</p>
					</div>
					<!-- 新密码 -->
					<div>
						<p class="Text_s mb_8 mt_8">{{ $t(`security_center['新密码']`) }}</p>
						<p class="common_password">
							<input :type="showNewPassword ? 'text' : 'password'" v-model="payLoad.newPassword" class="common_input" @input="newPasswordOnInput" :maxlength="16" />
							<span class="eyes">
								<svg-icon :name="showNewPassword ? 'eyes' : 'eyes_on'" size="14px" @click="showNewPassword = !showNewPassword" />
							</span>
						</p>
						<p v-show="VerifyError.newPassword" class="Wran_text fs_12 mt_2">{{ $t(`security_center['8-16位，必须包含 数字和字母']`) }}</p>
					</div>
					<!-- 确认密码 -->
					<div>
						<p class="Text_s mb_8 mt_8">{{ $t(`security_center['确认密码']`) }}</p>
						<p class="common_password">
							<input :type="showConfirmPassword ? 'text' : 'password'" v-model="payLoad.confirmPassword" class="common_input" @input="confirmOnInput" :maxlength="16" />
							<span class="eyes">
								<svg-icon :name="showConfirmPassword ? 'eyes' : 'eyes_on'" size="14px" @click="showConfirmPassword = !showConfirmPassword" />
							</span>
						</p>
						<p v-show="VerifyError.confirmPassword" class="Wran_text fs_12 mt_2">{{ $t(`security_center['两次密码不一致']`) }}</p>
					</div>
				</div>
				<div class="mt_40 mb_12">
					<button class="common_btn" :disabled="disabledBtn" type="button" @click="onSubmit">{{ $t(`security_center['确定']`) }}</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import Common from "/@/utils/common";
import showToast from "/@/hooks/useToast";
import { userApi } from "/@/api/user";
import { useModalStore } from "/@/stores/modules/modalStore";
import CommonRegex from "/@/utils/CommonRegex";

const modalStore = useModalStore();
const VerifyError = reactive({
	oldPassword: false,
	newPassword: false,
	confirmPassword: false,
});
// 验证码
const hcaptcha: any = ref(null);

// 登录表单
const payLoad = reactive({
	oldPassword: "",
	newPassword: "",
	confirmPassword: "",
	verifyCode: "",
});

// 校验完成登录按钮可以点击
const disabledBtn = ref(true);

// 显示密码
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const oldPasswordOnInput = () => {
	CommonRegex.passWordregex.test(payLoad.oldPassword) ? (VerifyError.oldPassword = false) : (VerifyError.oldPassword = true);
	verifyBtn();
};

const newPasswordOnInput = () => {
	CommonRegex.passWordregex.test(payLoad.newPassword) ? (VerifyError.newPassword = false) : (VerifyError.newPassword = true);
	verifyBtn();
};

const confirmOnInput = () => {
	CommonRegex.passWordregex.test(payLoad.confirmPassword) && payLoad.confirmPassword === payLoad.newPassword
		? (VerifyError.confirmPassword = false)
		: (VerifyError.confirmPassword = true);
	verifyBtn();
};

const verifyBtn = () => {
	if (!VerifyError.newPassword && !VerifyError.oldPassword && payLoad.newPassword && payLoad.confirmPassword === payLoad.newPassword) {
		disabledBtn.value = false;
	} else {
		disabledBtn.value = true;
	}
};

const onSubmit = async () => {
	const res = await userApi.changePassword(payLoad).catch((err) => err);
	const { code, data, message } = res;
	if (code == Common.ResCode.SUCCESS) {
		modalStore.closeModal();
		showToast(message);
	} else {
		showToast(message);
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
