<!-- src/components/RegisterForm.vue -->
<template>
	<div class="loginWrapper">
		<div class="login_left_img">
			<img src="/@/assets/common/login_left.png" alt="" />
		</div>
		<div class="login_right_form">
			<div class="login_text"><span>注册</span></div>
			<div class="login_form">
				<!-- 账号 -->
				<div>
					<p class="Text_s mb_8 mt_8 fs_16"><span class="Wran_text">*</span>账号</p>
					<p>
						<input type="text" :value="payLoad.userAccount" class="common_input" placeholder="输入账号" @input="userOnInput" />
					</p>
					<p v-show="VerifyError.userAccount" class="Wran_text fs_12 mt_2">4-11位，数字 ，字母组成 ，首位必须是字母</p>
				</div>
				<!-- 密码 -->
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
					<p v-show="VerifyError.passWord" class="Wran_text fs_12 mt_2">8-16位，必须包含 数字和字母， 可包含@ _ $</p>
				</div>
				<!-- 确认密码 -->
				<div>
					<p class="Text_s mb_8 mt_8"><span class="Wran_text">*</span>确认密码</p>
					<p class="common_password">
						<input :type="showConfirmPassword ? 'text' : 'password'" :value="payLoad.confirmPassword" class="common_input" placeholder="输入密码" @input="confirmOnInput" />
						<span class="eyes">
							<svg-icon :name="showConfirmPassword ? 'eyes_on' : 'eyes'" size="18px" @click="showConfirmPassword = !showConfirmPassword" />
						</span>
					</p>
					<p v-show="VerifyError.confirmPassword" class="Wran_text fs_12 mt_2">两次输入密码不一致</p>
				</div>

				<div>
					<p class="Text_s mb_8 mt_8"><span class="Wran_text">*</span>主货币</p>
					<p style="height: 46px">
						<DropdownSelect :options="options" placeholder="请选择" @update:modelValue="handleSelect" @search="handleSearch" />
					</p>
				</div>

				<div>
					<p class="Text_s mb_8 mt_8">推荐码（非必填）</p>
					<p class="common_password">
						<input type="text" :value="payLoad.inviteCode" class="common_input" placeholder="输入推荐码" />
						<svg-icon name="eyesOn" size="18px" />
					</p>
				</div>
				<div class="Text1 fs_14">我同意 <span>用户协议</span> 并确认我已年满 18 岁</div>
				<div class="Text_s fs_14">我同意接收[ <span>oksport</span> ]的营销促销信息</div>
				<div class="mt_16 mb_16">
					<button class="common_btn" :disabled="disabledBtn" type="button" @click="onLogin">注册</button>
				</div>
				<div class="flex-center fs_14">
					<div class="Text1">已有账号？ <span class="Wran_text">登陆</span></div>
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
import { useUserStore } from "/@/stores/modules/user";
import DropdownSelect from "/@/components/DropdownSelect/index.vue";
import showToast from "/@/hooks/useToast";
import { userApi } from "/@/api/user";

const UserStore = useUserStore();
const userAccountRegex = /^[a-zA-Z][a-zA-Z0-9]{3,10}$/;
const passWordregex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@_$]{8,16}$/;

const hcaptcha: any = ref(null);
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

const VerifyError = reactive({
	userAccount: false,
	passWord: false,
	confirmPassword: false,
});

const passOnInput = (e: any) => {
	payLoad.password = e.target.value;
	passWordregex.test(payLoad.password) ? (VerifyError.passWord = false) : (VerifyError.passWord = true);
	verifyBtn();
};
const userOnInput = (e: any) => {
	payLoad.userAccount = e.target.value;
	userAccountRegex.test(payLoad.userAccount) ? (VerifyError.userAccount = false) : (VerifyError.userAccount = true);
	verifyBtn();
};
const confirmOnInput = (e: any) => {
	payLoad.confirmPassword = e.target.value;
	payLoad.confirmPassword === payLoad.password ? (VerifyError.confirmPassword = false) : (VerifyError.confirmPassword = true);
	verifyBtn();
};

const verifyBtn = () => {
	if (payLoad.password && payLoad.userAccount && payLoad.confirmPassword && payLoad.mainCurrency) {
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
	const verifyToken = token;
	const res = await loginApi.userRegister({ ...payLoad, verifyToken }).catch((err) => err);
	const { code, data, message } = res;
	if (code == Common.ResCode.SUCCESS) {
		eventBus.emit("hide-modal");
		localStorage.setItem("userInfo", JSON.stringify(data));
		UserStore.setUserInfo(data);
		getUserInfo();
		showToast(message, 1500);
	} else {
		payLoad.password = "";
		payLoad.userAccount = "";
		payLoad.confirmPassword = "";
		payLoad.mainCurrency = "";
		showToast(message, 1500);
	}
};
const onLogin = async () => {
	hcaptcha.value?.validate();
};
const options = UserStore.getCurrencyList;

const handleSelect = (option: any) => {
	payLoad.mainCurrency = option.code;
	verifyBtn();
};

const handleSearch = (query: string) => {
	console.log("Search query:", query);
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
</script>

<style lang="scss" scoped>
.loginWrapper {
	width: 902px;
	height: 720px;
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
	.login_right_form::-webkit-scrollbar {
		display: none;
	}
}
</style>
