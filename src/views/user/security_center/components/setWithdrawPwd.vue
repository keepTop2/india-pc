<!-- src/components/RegisterForm.vue -->
<template>
	<div class="ChangePasswordWrapper">
		<div class="ChangePassword_form">
			<div class="login_text fs_20 mb_20">
				<span v-if="isCreate"> {{ $t(`security_center['设置交易密码']`) }}</span>
				<span v-else> {{ $t(`security_center['修改交易密码']`) }}</span>
			</div>
			<div class="login_form">
				<!-- 设置交易密码 -->
				<div v-if="isCreate">
					<div>
						<p class="Text_s mb_8 mt_8"><span class="Wran_text">*</span>{{ $t(`security_center['交易密码']`) }}</p>
						<p class="common_password">
							<input :type="showPassword ? 'text' : 'password'" v-model="payLoad.password" class="common_input" @input="passwordOnInput" autocomplete="new-password" />
							<span class="eyes">
								<svg-icon :name="showOldPassword ? 'eyes' : 'eyes_on'" size="14px" @click="showOldPassword = !showOldPassword" />
							</span>
						</p>
						<p v-show="passwordVerifyTypeVerifyError" class="Wran_text fs_12 mt_2">{{ $t(`security_center['请输入6位数字']`) }}</p>
					</div>
					<div>
						<p class="Text_s mb_8 mt_8"><span class="Wran_text">*</span>{{ $t(`security_center['确认交易密码']`) }}</p>
						<p class="common_password">
							<input
								:type="showConfirmPassword ? 'text' : 'password'"
								v-model="payLoad.confirmPassword"
								class="common_input"
								@input="confirmPasswordOnInput"
								autocomplete="new-password"
							/>
							<span class="eyes">
								<svg-icon :name="showOldPassword ? 'eyes' : 'eyes_on'" size="14px" @click="showOldPassword = !showOldPassword" />
							</span>
						</p>
						<p class="fs_14 Text1 mt_16 fw_200"></p>
						<p v-show="confirmPasswordVerifyTypeVerifyError" class="Wran_text fs_12 mt_2">{{ $t(`security_center['两次密码不一致']`) }}</p>
					</div>
				</div>

				<!-- 修改交易密码 -->
				<div v-else>
					<!-- 旧密码 -->
					<div>
						<p class="Text_s mb_8 mt_8"><span class="Wran_text">*</span>{{ $t(`security_center['旧密码']`) }}</p>
						<p class="common_password">
							<input :type="showOldPassword ? 'text' : 'password'" v-model="payLoad.oldPassword" class="common_input" @input="oldPasswordOnInput" autocomplete="new-password" />
							<span class="eyes">
								<svg-icon :name="showOldPassword ? 'eyes' : 'eyes_on'" size="14px" @click="showOldPassword = !showOldPassword" />
							</span>
						</p>
						<p v-show="oldPasswordVerifyTypeVerifyError" class="Wran_text fs_12 mt_2">{{ $t(`security_center['请输入6位数字']`) }}</p>
					</div>
					<!-- 新密码 -->
					<div>
						<p class="Text_s mb_8 mt_8"><span class="Wran_text">*</span>{{ $t(`security_center['新密码']`) }}</p>
						<p class="common_password">
							<input :type="showNewPassword ? 'text' : 'password'" v-model="payLoad.newPassword" class="common_input" @input="newPasswordOnInput" />
							<span class="eyes">
								<svg-icon :name="showNewPassword ? 'eyes' : 'eyes_on'" size="14px" @click="showNewPassword = !showNewPassword" />
							</span>
						</p>
						<p v-show="newPasswordVerifyTypeVerifyError" class="Wran_text fs_12 mt_2">{{ $t(`security_center['请输入6位数字']`) }}</p>
					</div>
					<!-- 确认密码 -->
					<div>
						<p class="Text_s mb_8 mt_8"><span class="Wran_text">*</span>{{ $t(`security_center['确认密码']`) }}</p>
						<p class="common_password">
							<input :type="showConfirmPassword ? 'text' : 'password'" v-model="payLoad.confirmPassword" class="common_input" @input="confirmPasswordOnInput" />
							<span class="eyes">
								<svg-icon :name="showConfirmPassword ? 'eyes' : 'eyes_on'" size="14px" @click="showConfirmPassword = !showConfirmPassword" />
							</span>
						</p>
						<p v-show="confirmPasswordVerifyTypeVerifyError" class="Wran_text fs_12 mt_2">{{ $t(`security_center['两次密码不一致']`) }}</p>
					</div>
				</div>
				<div class="mt_40 mb_12">
					<button class="common_btn" :disabled="disabledBtn" type="button" @click="onSubmit">{{ $t(`security_center['确定']`) }}</button>
					<div class="findOldPwd">
						{{ $t(`security_center['忘记了旧交易密码？']`) }}
						<span class="Theme_text curp" @click="goToFindWithdrawPwd">{{ $t(`security_center['找回交易密码']`) }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import Common from "/@/utils/common";
import showToast from "/@/hooks/useToast";
import { userApi } from "/@/api/user";
import { useUserStore } from "/@/stores/modules/user";
import { useModalStore } from "/@/stores/modules/modalStore";
import CommonRegex from "/@/utils/CommonRegex";
const modalStore = useModalStore();
const userStore = useUserStore();
// 登陆表单
const payLoad = reactive({
	password: "",
	confirmPassword: "",
	oldPassword: "",
	newPassword: "",
});
const isCreate = ref(true);

const showPassword = ref(false);
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
// 校验完成登陆按钮可以点击
const disabledBtn = ref(true);
const verificationBtn = ref(true);
const passwordVerifyTypeVerifyError = ref(false);
const oldPasswordVerifyTypeVerifyError = ref(false);
const newPasswordVerifyTypeVerifyError = ref(false);
const confirmPasswordVerifyTypeVerifyError = ref(false);

const passwordOnInput = () => {
	CommonRegex.withdrawPwd.test(payLoad.password) ? (passwordVerifyTypeVerifyError.value = false) : (passwordVerifyTypeVerifyError.value = true);
	verificationBtn.value = passwordVerifyTypeVerifyError.value;
	verifyBtn();
};
const oldPasswordOnInput = () => {
	CommonRegex.withdrawPwd.test(payLoad.oldPassword) ? (oldPasswordVerifyTypeVerifyError.value = false) : (oldPasswordVerifyTypeVerifyError.value = true);
	verificationBtn.value = confirmPasswordVerifyTypeVerifyError.value;
	verifyBtn();
};
const confirmPasswordOnInput = () => {
	CommonRegex.withdrawPwd.test(payLoad.confirmPassword) ? (confirmPasswordVerifyTypeVerifyError.value = false) : (confirmPasswordVerifyTypeVerifyError.value = true);
	verificationBtn.value = confirmPasswordVerifyTypeVerifyError.value;
	verifyBtn();
};
const newPasswordOnInput = () => {
	CommonRegex.withdrawPwd.test(payLoad.newPassword) ? (newPasswordVerifyTypeVerifyError.value = false) : (newPasswordVerifyTypeVerifyError.value = true);
	verificationBtn.value = confirmPasswordVerifyTypeVerifyError.value;
	verifyBtn();
};

const verifyBtn = () => {
	if (isCreate.value) {
		if (!passwordVerifyTypeVerifyError.value && payLoad.password == payLoad.confirmPassword) {
			disabledBtn.value = false;
		} else {
			disabledBtn.value = true;
		}
	} else {
		if (
			!newPasswordVerifyTypeVerifyError.value &&
			!oldPasswordVerifyTypeVerifyError.value &&
			!confirmPasswordVerifyTypeVerifyError.value &&
			payLoad.newPassword &&
			payLoad.newPassword == payLoad.confirmPassword
		) {
			disabledBtn.value = false;
		} else {
			disabledBtn.value = true;
		}
	}
};

const goToFindWithdrawPwd = () => {
	if (!userStore.getUserGlobalSetInfo.phone && !userStore.getUserGlobalSetInfo.email) {
		showToast("请先绑定手机号或邮箱");
	} else {
		modalStore.openModal("FindWithdrawPwd");
	}
};
const onSubmit = async () => {
	verificationBtn.value = true;
	const params = {};
	if (isCreate.value) {
		Object.assign(params, {
			password: payLoad.password,
			confirmPassword: payLoad.confirmPassword,
		});
		const res = await userApi.setWithdrawPwd(params).catch((error) => error);
		if (res.code === Common.ResCode.SUCCESS) {
			await userStore.uplateUserGlobalSetInfo();
			modalStore.closeModal();
		} else {
			showToast(res.message);
		}
	} else {
		Object.assign(params, {
			newPassword: payLoad.newPassword,
			oldPassword: payLoad.oldPassword,
			confirmPassword: payLoad.confirmPassword,
		});
		const res = await userApi.changeWithdrawPwd(params).catch((error) => error);
		if (res.code === Common.ResCode.SUCCESS) {
			await userStore.uplateUserGlobalSetInfo();
			modalStore.closeModal();
		} else {
			showToast(res.message);
		}
	}
};
onMounted(() => {
	if (userStore.getUserGlobalSetInfo.isSetPwd) {
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
	.findOldPwd {
		text-align: right;
		font-size: 14px;
		color: var(--Text1);
		margin-top: 16px;
	}
}
</style>
