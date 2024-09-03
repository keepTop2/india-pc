<!-- src/components/RegisterForm.vue -->
<template>
	<form class="loginWrapper">
		<div class="login_left_img">
			<img src="/@/assets/common/login_left.png" alt="" />
		</div>
		<div class="login_right_form">
			<div class="login_text"><span>登陆</span></div>
			<div class="login_form">
				<div>
					<p class="Text_s mb_8 mt_8 fs_16"><span class="Wran_text">*</span>账号</p>
					<p>
						<input type="text" :value="payLoad.userAccount" class="common_input" placeholder="输入账号" @input="userOnInput" autocomplete="new-password" />
					</p>
					<p v-show="userAccountVerifyError" class="Wran_text fs_12 mt_2">4-11位，数字 ，字母组成 ，首位必须是字母</p>
				</div>
				<div>
					<p class="Text_s mb_8 mt_8"><span class="Wran_text">*</span>登陆密码</p>
					<p class="common_password">
						<input
							:type="showPassword ? 'text' : 'password'"
							:value="payLoad.password"
							class="common_input"
							placeholder="输入密码"
							@input="passOnInput"
							autocomplete="new-password"
						/>
						<span class="eyes">
							<svg-icon :name="showPassword ? 'eyes_on' : 'eyes'" size="18px" @click="showPassword = !showPassword" />
						</span>
					</p>
					<p v-show="passWordVerifyError" class="Wran_text fs_12 mt_2">8-16位，必须包含 数字和字母， 可包含@ _ $</p>
				</div>
				<div class="flex_space-between fs_14 mt_10">
					<div class="Text1 curp flex-center" style="gap: 6px">
						<svg-icon
							:name="rememberPassword ? 'check_icon_on' : 'check_icon'"
							size="18px"
							@click="rememberPassword = !rememberPassword"
							:style="{ color: rememberPassword ? 'var(--Theme)' : '' }"
						/>
						记住密码
					</div>
					<div class="Text_s curp" @click="forgetPassword">忘记密码？</div>
				</div>
				<div class="mt_40 mb_12">
					<button class="common_btn" :disabled="disabledBtn" type="button" @click="onLogin">登陆</button>
				</div>
				<div class="flex_space-between fs_14">
					<div class="Text1">新用户？ <span class="Wran_text">创建账号</span></div>
					<div><span class="Wran_text">联系客服</span></div>
				</div>
			</div>
		</div>
	</form>
	<Hcaptcha ref="hcaptcha" @submit="onSubmit" />
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { loginApi } from "/@/api/login";
import { userApi } from "/@/api/user";
import Common from "/@/utils/common";
import eventBus from "/@/utils/eventBus";
import showToast from "/@/hooks/useToast";
import EncryptionFn from "/@/utils/encryption";
import { useUserStore } from "/@/stores/modules/user";
const UserStore = useUserStore();

// 验证码
const hcaptcha: any = ref(null);

// 登陆表单
const payLoad = reactive({
	userAccount: "",
	password: "",
});
const rememberPassword = ref(false);
//账号密码校验规则
const userAccountRegex = /^[a-zA-Z][a-zA-Z0-9]{3,10}$/;
const passWordregex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@_$]{8,16}$/;

//显示校验提示
const userAccountVerifyError = ref(false);
const passWordVerifyError = ref(false);

// 校验完成登陆按钮可以点击
const disabledBtn = ref(true);

// 显示密码
const showPassword = ref(false);

onMounted(() => {
	if (UserStore.getLoginInfo) {
		Object.assign(payLoad, UserStore.getLoginInfo);
		rememberPassword.value = true;
		verifyBtn();
	}
});
// 监听输入框变化
const userOnInput = (e: any) => {
	payLoad.userAccount = e.target.value;
	userAccountRegex.test(payLoad.userAccount) ? (userAccountVerifyError.value = false) : (userAccountVerifyError.value = true);
	verifyBtn();
};
const passOnInput = (e: any) => {
	payLoad.password = e.target.value;
	passWordregex.test(payLoad.password) ? (passWordVerifyError.value = false) : (passWordVerifyError.value = true);
	verifyBtn();
};

// 表单验证
const verifyBtn = () => {
	if (!passWordVerifyError.value && payLoad.password && !userAccountVerifyError.value && payLoad.userAccount) {
		disabledBtn.value = false;
	} else {
		disabledBtn.value = true;
	}
};

// 点击登录，弹出真人验证
const onLogin = async () => {
	hcaptcha.value?.validate();
};

// 前端验证通过，提交表单
const onSubmit = async (token: string) => {
	const verifyToken = token;
	const res = await loginApi.userLogin({ ...payLoad, verifyToken }).catch((err) => err);
	const { code, data, message } = res;
	if (code == Common.ResCode.SUCCESS) {
		showToast(message, 1500);
		eventBus.emit("hide-modal");
		await UserStore.setUserInfo(data);
		getUserInfo();
		// 保存登陆密码
		if (rememberPassword.value) {
			UserStore.setLoginInfo({ userAccount: payLoad.userAccount, password: payLoad.password });
		} else {
			UserStore.setLoginInfo();
		}
	} else {
		payLoad.password = "";
		payLoad.userAccount = "";
		showToast(message, 1500);
	}
};

const getUserInfo = async () => {
	const res = await userApi.getIndexInfo().catch((err) => err);
	const { code, data, message } = res;
	if (code == Common.ResCode.SUCCESS) {
		const userInfo = { ...UserStore.getUserInfo, ...data };
		UserStore.setUserInfo(userInfo);
		localStorage.setItem("userInfo", JSON.stringify(userInfo));
	} else {
		showToast(message, 1500);
	}
};

const forgetPassword = () => {
	eventBus.emit("show-modal", "ForgetPassword");
};
</script>

<style lang="scss" scoped>
.loginWrapper {
	width: 902px;
	height: 720px;
	border-radius: 12px;
	display: flex;

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
			font-size: var(--title-text-size);
			font-weight: 500;
			margin-bottom: 33px;
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
