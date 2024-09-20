<!-- src/components/RegisterForm.vue -->
<template>
	<div class="ChangePasswordWrapper">
		<div class="ChangePassword_form">
			<div class="login_text fs_20 mb_20">
				<span> {{ $t(`login['修改密码']`) }}</span>
			</div>
			<div class="login_form">
				<div>
					<!-- 旧密码 -->
					<div>
						<p class="Text_s mb_8 mt_8"><span class="Wran_text">*</span>{{ $t(`login['旧密码']`) }}</p>
						<p class="common_password">
							<input
								:type="showOldPassword ? 'text' : 'password'"
								v-model="payLoad.oldPassword"
								class="common_input"
								:placeholder="$t(`login['输入密码']`)"
								@input="oldPasswordOnInput"
								autocomplete="new-password"
							/>
							<span class="eyes">
								<svg-icon :name="showOldPassword ? 'eyes_on' : 'eyes'" size="14px" @click="showOldPassword = !showOldPassword" />
							</span>
						</p>
						<p v-show="VerifyError.oldPassword" class="Wran_text fs_12 mt_2">{{ $t(`login['密码规则']`) }}</p>
					</div>
					<!-- 新密码 -->
					<div>
						<p class="Text_s mb_8 mt_8"><span class="Wran_text">*</span>{{ $t(`login['新密码']`) }}</p>
						<p class="common_password">
							<input
								:type="showNewPassword ? 'text' : 'password'"
								v-model="payLoad.newPassword"
								class="common_input"
								:placeholder="$t(`login['输入密码']`)"
								@input="newPasswordOnInput"
							/>
							<span class="eyes">
								<svg-icon :name="showNewPassword ? 'eyes_on' : 'eyes'" size="14px" @click="showNewPassword = !showNewPassword" />
							</span>
						</p>
						<p v-show="VerifyError.newPassword" class="Wran_text fs_12 mt_2">{{ $t(`login['密码规则']`) }}</p>
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
	<Hcaptcha ref="hcaptcha" @submit="onSubmit" />
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import Common from "/@/utils/common";
import eventBus from "/@/utils/eventBus";
import showToast from "/@/hooks/useToast";
import { userApi } from "/@/api/user";

const VerifyError = reactive({
	oldPassword: false,
	newPassword: false,
	confirmPassword: false,
});
// 验证码
const hcaptcha: any = ref(null);

// 登陆表单
const payLoad = reactive({
	oldPassword: "",
	newPassword: "",
	confirmPassword: "",
	verifyCode: "",
});

//账号密码校验规则
const passWordregex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@_$]{8,16}$/;

// 校验完成登陆按钮可以点击
const disabledBtn = ref(true);

// 显示密码
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const oldPasswordOnInput = () => {
	passWordregex.test(payLoad.oldPassword) ? (VerifyError.oldPassword = false) : (VerifyError.oldPassword = true);
	verifyBtn();
};

const newPasswordOnInput = () => {
	passWordregex.test(payLoad.newPassword) ? (VerifyError.newPassword = false) : (VerifyError.newPassword = true);
	verifyBtn();
};

const confirmOnInput = () => {
	passWordregex.test(payLoad.newPassword) && payLoad.confirmPassword === payLoad.newPassword ? (VerifyError.confirmPassword = false) : (VerifyError.confirmPassword = true);
	verifyBtn();
};

const verifyBtn = () => {
	if (!VerifyError.newPassword && !VerifyError.confirmPassword && !VerifyError.oldPassword && payLoad.confirmPassword) {
		disabledBtn.value = false;
	} else {
		disabledBtn.value = true;
	}
};

const onSubmit = async () => {
	const res = await userApi.changePassword(payLoad).catch((err) => err);
	const { code, data, message } = res;
	if (code == Common.ResCode.SUCCESS) {
		eventBus.emit("hide-modal");
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
