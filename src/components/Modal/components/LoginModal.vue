<!-- src/components/RegisterForm.vue -->
<template>
	<form class="loginWrapper">
		<div class="login_left_img">
			<img src="/@/assets/common/login_left.png" alt="" />
		</div>
		<div class="login_right_form">
			<div class="login_text fs_16 mb_20">
				<span>{{ $t(`login['登陆']`) }}</span>
			</div>
			<div class="login_form">
				<div class="mb_12">
					<p class="Text_s fs_12"><span class="Wran_text">*</span>{{ $t(`login['账号']`) }}</p>
					<p>
						<input type="text" :value="payLoad.userAccount" class="common_input mt_8" :placeholder="$t(`login['输入账号']`)" @input="userOnInput" autocomplete="new-password" />
					</p>
				</div>
				<div class="mb_12">
					<p class="Text_s mb_8 mt_8 fs_12"><span class="Wran_text">*</span>{{ $t(`login['登录密码']`) }}</p>
					<p class="common_password">
						<input
							:type="showPassword ? 'text' : 'password'"
							:value="payLoad.password"
							class="common_input"
							:placeholder="$t(`login['输入密码']`)"
							@input="passOnInput"
							autocomplete="new-password"
						/>
						<span class="eyes">
							<svg-icon :name="showPassword ? 'eyes_on' : 'eyes'" size="14px" @click="showPassword = !showPassword" />
						</span>
					</p>
				</div>
				<div class="flex_space-between fs_12 mt_10">
					<div class="Text1 curp flex-center" style="gap: 6px">
						<svg-icon
							:name="rememberPassword ? 'check_icon_on' : 'check_icon'"
							size="14px"
							@click="rememberPassword = !rememberPassword"
							:style="{ color: rememberPassword ? 'var(--Theme)' : '' }"
						/>
						{{ $t(`login['记住密码']`) }}
					</div>
					<div class="Text_s curp fs_12" @click="forgetPassword">{{ $t(`login['忘记密码']`) }}？</div>
				</div>
				<div class="mt_40 mb_12">
					<button class="common_btn fs_12" type="button" @click="onLogin">{{ $t(`login['登陆']`) }}</button>
				</div>
				<div class="flex_space-between fs_12">
					<div class="Text1">
						{{ $t(`login['新用户']`) }}？ <span class="Wran_text curp" @click="toRegister">{{ $t(`login['创建账号']`) }}</span>
					</div>
					<div>
						<span class="Wran_text fs_12">{{ $t(`login['联系客服']`) }}</span>
					</div>
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
import { useUserStore } from "/@/stores/modules/user";
const UserStore = useUserStore();

// 验证码
const hcaptcha: any = ref(null);
=======
const hcaptcha: any = ref(null);
const certifyId = ref(null);
// 控制验证码的显示
const showhcaptcha = ref(false);
>>>>>>> 828ee03 (feat:修改登陆验证)

// 登陆表单
const payLoad = reactive({
	userAccount: "",
	password: "",
});
// 记住密码
const rememberPassword = ref(false);

//账号密码校验规则
const userAccountRegex = /^[a-zA-Z][a-zA-Z0-9]{3,10}$/;
const passWordregex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@_$]{8,16}$/;

//显示校验提示
const userAccountVerifyError = ref(false);
const passWordVerifyError = ref(false);

// 显示密码
const showPassword = ref(false);

// 获取是否记住密码
onMounted(() => {
	if (UserStore.getLoginInfo) {
		Object.assign(payLoad, UserStore.getLoginInfo);
		rememberPassword.value = true;
		verifyBtn();
	}
<<<<<<< HEAD
=======
	(window as any).initAliyunCaptcha({
		SceneId: "qxye14r6d",
		prefix: "5zbecta",
		mode: "popup",
		element: "#hcaptchaContainer",
		button: "#captcha-element",
		captchaVerifyCallback: captchaVerifyCallback,
		onBizResultCallback: onSubmit,
		getInstance: getInstance,
		slideStyle: {
			width: 360,
			height: 200,
		},
		language: "cn",
		region: "sgp",
	});
>>>>>>> 828ee03 (feat:修改登陆验证)
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
const verifyBtn = () => {};

// 点击登录，弹出真人验证
const onLogin = async () => {
	if (userAccountRegex.test(payLoad.userAccount) && passWordregex.test(payLoad.password)) {
<<<<<<< HEAD
		hcaptcha.value?.validate();
=======
>>>>>>> 828ee03 (feat:修改登陆验证)
	} else {
		showToast("用户名或密码错误", 1500);
	}
};

<<<<<<< HEAD
// 前端验证通过，提交表单
const onSubmit = async (token: string) => {
	const verifyToken = token;
	const res = await loginApi.userLogin({ ...payLoad, verifyToken }).catch((err) => err);
=======
// 获取验证码实例
const getInstance = (instance: any) => {
	hcaptcha.value = instance;
};

// 提交处理
const onSubmit = async () => {
	const res = await loginApi.userLogin({ ...payLoad, certifyId: certifyId.value }).catch((err) => err);
>>>>>>> 828ee03 (feat:修改登陆验证)
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
		showhcaptcha.value = false;
		payLoad.password = "";
		payLoad.userAccount = "";
		showToast(message, 1500);
	}
};

// 登录成功获取用户信息
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

// 忘记密码
const forgetPassword = () => {
	eventBus.emit("show-modal", "ForgetPassword");
};

// 新用户注册
const toRegister = () => {
	eventBus.emit("show-modal", "RegisterModal");
};
<<<<<<< HEAD
=======

// 验证码验证回调
const captchaVerifyCallback = (captchaVerifyParam: any) => {
	return loginApi.verifyCode({ captchaVerifyParam: captchaVerifyParam }).then((res) => {
		if (res.code === Common.ResCode.SUCCESS) {
			// 构造标准返回参数
			const verifyResult = {
				captchaResult: res.data.captchaResult,
				bizResult: res.data.captchaResult,
			};
			certifyId.value = JSON.parse(captchaVerifyParam).certifyId;

			return verifyResult;
		} else {
			// 构造标准返回参数
			const verifyResult = {
				captchaResult: res.data.captchaResult,
				bizResult: res.data.captchaResult,
			};
			return verifyResult;
		}
	});
};
>>>>>>> 828ee03 (feat:修改登陆验证)
</script>

<style lang="scss" scoped>
.loginWrapper {
	width: 680px;
	height: 542px;
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
		padding: 18px 25px;
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
