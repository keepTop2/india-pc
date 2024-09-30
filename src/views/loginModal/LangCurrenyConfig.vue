<!-- src/components/RegisterForm.vue -->
<template>
	<div class="loginWrapper">
		<div>LangCurrenyConfig</div>
		<div><button @click="setLang(LangEnum['zh-CN'])">切切换语言 中文</button></div>
		<div><button @click="setLang(LangEnum['en-US'])">切切换语言 英文</button></div>
	</div>
</template>

<script setup lang="ts">
import { useUserStore } from "/@/stores/modules/user";
import { LangEnum } from "/@/enum/appConfigEnum";
const userStore = useUserStore();

const setLang = (lang: LangEnum) => {
	userStore.setLangs(lang);
	window.location.reload();
};
</script>

<style lang="scss" scoped>
.loginWrapper {
	width: 902px;
	height: 720px;
	display: flex;
	border-radius: 12px;
	background: var(--Bg);
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
