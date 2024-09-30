<!-- src/components/RegisterForm.vue -->
<template>
	<div class="ChangePasswordWrapper">
		<div class="ChangePassword_form">
			<div class="login_text fs_20 mb_20">
				<span v-if="userStore.getUserGlobalSetInfo.isSetPwd"> {{ $t(`login['设置交易密码']`) }}</span>
				<span v-else> {{ $t(`login['修改交易密码']`) }}</span>
			</div>
			<div class="login_form">
				<div>
					<!-- 旧密码 -->
					<div v-if="userStore.getUserGlobalSetInfo.isSetPwd">
						<p class="Text_s mb_8 mt_8"><span class="Wran_text">*</span>{{ $t(`login['原交易密码']`) }}</p>
						<p class="common_password">
							<input
								:type="showOldPassword ? 'text' : 'password'"
								v-model="payLoad.oldPassword"
								class="common_input"
								:placeholder="$t(`login['输入密码']`)"
								@input="oldPasswordOnInput"
								autocomplete="new-password"
								:class="VerifyError.oldPassword ? 'verifyError' : ''"
							/>
							<span class="eyes">
								<svg-icon :name="showOldPassword ? 'eyes_on' : 'eyes'" size="14px" @click="showOldPassword = !showOldPassword" />
							</span>
						</p>
						<p v-show="VerifyError.oldPassword" class="Wran_text fs_12 mt_2">{{ $t(`login['密码规则']`) }}</p>
					</div>
					<!-- 密码 -->
					<div>
						<p class="Text_s mb_8 mt_8"><span class="Wran_text">*</span>{{ $t(`login['交易密码']`) }}</p>
						<p class="common_password">
							<input
								:type="showPassword ? 'text' : 'password'"
								v-model="payLoad.password"
								class="common_input"
								:placeholder="$t(`login['输入密码']`)"
								@input="passwordOnInput"
								autocomplete="new-password"
							/>
							<span class="eyes">
								<svg-icon :name="showPassword ? 'eyes_on' : 'eyes'" size="14px" @click="showPassword = !showPassword" />
							</span>
						</p>
						<p v-show="VerifyError.oldPassword" class="Wran_text fs_12 mt_2">{{ $t(`login['密码规则']`) }}</p>
					</div>
					<!-- 确认密码 -->
					<div>
						<p class="Text_s mb_8 mt_8"><span class="Wran_text">*</span>{{ $t(`login['确认密码']`) }}</p>
						<p class="common_password">
							<input
								:type="showConfirmPassword ? 'text' : 'password'"
								v-model="payLoad.confirmPassword"
								class="common_input"
								:placeholder="$t(`login['输入密码']`)"
								@input="confirmOnInput"
							/>
							<span class="eyes">
								<svg-icon :name="showConfirmPassword ? 'eyes_on' : 'eyes'" size="14px" @click="showConfirmPassword = !showConfirmPassword" />
							</span>
						</p>
						<p v-show="VerifyError.confirmPassword" class="Wran_text fs_12 mt_2">{{ $t(`login['两次输入密码不一致']`) }}</p>
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
import showToast from "/@/hooks/useToast";
import { userApi } from "/@/api/user";
import { useUserStore } from "/@/stores/modules/user";
const userStore = useUserStore();
const VerifyError = reactive({
	oldPassword: false,
	newPassword: false,
	confirmPassword: false,
	password: false,
});

// 登陆表单
const payLoad = reactive({
	password: "",
	oldPassword: "",
	newPassword: "",
	confirmPassword: "",
	verifyCode: "",
});

//账号密码校验规则
const passWordregex = /^\d{6}$/;

// 校验完成登陆按钮可以点击
const disabledBtn = ref(true);

// 显示密码
const showOldPassword = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const passwordOnInput = () => {
	passWordregex.test(payLoad.password) ? (VerifyError.password = false) : (VerifyError.password = true);
	verifyBtn();
};
const oldPasswordOnInput = () => {
	passWordregex.test(payLoad.oldPassword) ? (VerifyError.oldPassword = false) : (VerifyError.oldPassword = true);
	verifyBtn();
};

const newPasswordOnInput = () => {
	passWordregex.test(payLoad.newPassword) ? (VerifyError.newPassword = false) : (VerifyError.newPassword = true);
	verifyBtn();
};

const confirmOnInput = (e: any) => {
	payLoad.confirmPassword = e.target.value;
	passWordregex.test(payLoad.password) && payLoad.confirmPassword === payLoad.password ? (VerifyError.confirmPassword = false) : (VerifyError.confirmPassword = true);
	verifyBtn();
};

const verifyBtn = () => {
	if (!VerifyError.password && !VerifyError.confirmPassword && payLoad.password == payLoad.confirmPassword) {
		disabledBtn.value = false;
	} else {
		disabledBtn.value = true;
	}
};

const onSubmit = async () => {
	let params = {};
	if (userStore.getUserGlobalSetInfo.isSetPwd) {
		params = {
			password: payLoad.password,
			confirmPassword: payLoad.confirmPassword,
		};
	} else {
		params = {
			password: payLoad.password,
			confirmPassword: payLoad.confirmPassword,
		};
	}
	const res = await userApi.setWithdrawPwd(params).catch((err) => err);
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
