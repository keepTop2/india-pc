<template>
	<form class="loginWrapper">
		<div class="login_left_img">
			<img src="/@/assets/common/login_left.png" alt="Login Image" />
		</div>

		<div class="login_right_form">
			<!-- 登录标题 -->
			<div class="login_text fs_16 mb_20">
				<span>{{ $t(`login['登陆']`) }}</span>
			</div>

			<!-- 登录表单 -->
			<div class="login_form">
				<!-- 账号输入 -->
				<div class="mb_12">
					<p class="Text_s fs_12"><span class="Wran_text">*</span>{{ $t(`login['账号']`) }}</p>
					<p>
						<input type="text" :value="payLoad.userAccount" class="common_input mt_8" :placeholder="$t(`login['输入账号']`)" @input="userOnInput" autocomplete="new-password" />
					</p>
				</div>

				<!-- 密码输入 -->
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
						<span class="eyes" @click="showPassword = !showPassword">
							<svg-icon :name="showPassword ? 'eyes_on' : 'eyes'" size="14px" />
						</span>
					</p>
				</div>

				<!-- 记住密码和忘记密码 -->
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

				<!-- 登录按钮 -->
				<div class="mt_40 mb_12">
					<button class="common_btn fs_12" type="button" id="captcha-element" @click="onLogin">
						{{ $t(`login['登陆']`) }}
					</button>
				</div>

				<!-- 注册和联系客服 -->
				<div class="flex_space-between fs_12">
					<div class="Text1">
						{{ $t(`login['新用户']`) }}？
						<span class="Wran_text curp" @click="toRegister">
							{{ $t(`login['创建账号']`) }}
						</span>
					</div>
					<div>
						<span class="Wran_text fs_12">{{ $t(`login['联系客服']`) }}</span>
					</div>
				</div>
			</div>
		</div>
	</form>

	<!-- 验证码容器 -->
	<div id="hcaptchaContainer"></div>
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
let hcaptcha: any = null;

// 控制验证码的显示
const showhcaptcha = ref(false);

// 表单数据
const payLoad = reactive({
	userAccount: "",
	password: "",
});

// 记住密码
const rememberPassword = ref(false);

// 输入验证正则
const userAccountRegex = /^[a-zA-Z][a-zA-Z0-9]{3,10}$/;
const passWordregex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@_$]{8,16}$/;

// 验证提示
const userAccountVerifyError = ref(false);
const passWordVerifyError = ref(false);

// 密码显示切换
const showPassword = ref(false);

// 初始化验证码
onMounted(() => {
	if (UserStore.getLoginInfo) {
		Object.assign(payLoad, UserStore.getLoginInfo);
		rememberPassword.value = true;
		verifyBtn();
	}
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
	});
});

// 账号输入变化处理
const userOnInput = (e: any) => {
	payLoad.userAccount = e.target.value;
	userAccountVerifyError.value = !userAccountRegex.test(payLoad.userAccount);
	verifyBtn();
};

// 密码输入变化处理
const passOnInput = (e: any) => {
	payLoad.password = e.target.value;
	passWordVerifyError.value = !passWordregex.test(payLoad.password);
	verifyBtn();
};

// 验证按钮状态
const verifyBtn = () => {};

// 登录处理
const onLogin = async () => {
	if (userAccountRegex.test(payLoad.userAccount) && passWordregex.test(payLoad.password)) {
		showhcaptcha.value = true;
	} else {
		showToast("用户名或密码错误", 1500);
	}
};

// 获取验证码实例
const getInstance = (instance: any) => {
	hcaptcha.value = instance;
};

// 提交处理
const onSubmit = async (token: string) => {
	const verifyToken = token;
	const res = await loginApi.userLogin({ ...payLoad, verifyToken }).catch((err) => err);
	const { code, data, message } = res;
	if (code === Common.ResCode.SUCCESS) {
		showToast(message, 1500);
		eventBus.emit("hide-modal");
		await UserStore.setUserInfo(data);
		getUserInfo();
		rememberPassword.value ? UserStore.setLoginInfo(payLoad) : UserStore.setLoginInfo();
	} else {
		payLoad.password = "";
		payLoad.userAccount = "";
		showToast(message, 1500);
	}
};

// 获取用户信息
const getUserInfo = async () => {
	const res = await userApi.getIndexInfo().catch((err) => err);
	const { code, data, message } = res;
	if (code === Common.ResCode.SUCCESS) {
		const userInfo = { ...UserStore.getUserInfo, ...data };
		UserStore.setUserInfo(userInfo);
		localStorage.setItem("userInfo", JSON.stringify(userInfo));
	} else {
		showToast(message, 1500);
	}
};

// 忘记密码处理
const forgetPassword = () => {
	eventBus.emit("show-modal", "ForgetPassword");
};

// 注册处理
const toRegister = () => {
	eventBus.emit("show-modal", "RegisterModal");
};

// 验证码验证回调
const captchaVerifyCallback = (captchaVerifyParam: any) => {
	// 构造标准返回参数
	const verifyResult = {
		captchaResult: true,
		bizResult: true,
	};
	return verifyResult;
};
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
