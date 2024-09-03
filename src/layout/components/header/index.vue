<template>
	<header class="header" :class="collapse ? 'collapse' : ''">
		<div class="max-width">
			<div class="flex-center" v-if="isLogin">
				<div class="balance_box flex-center">
					<div class="balance">
						<img src="/@/assets/common/coin.png" alt="" style="height: 16px" class="mr_4" />
						<span>{{ Common.thousands(123123123123.123) }}</span>
					</div>
					<div class="recharge">{{ $t(`common['充值']`) }}</div>
				</div>
				<div class="flex-center message" @mouseover="onMouseover('message')" @mouseout="onMouseout">
					<svg-icon name="message" size="32px" :hover="hoverItem"></svg-icon>{{}}
					<span class="notice"></span>
				</div>
				<div class="lang user">
					<img :src="LangIcon" alt="" @click="openUserMenu" />
					<div class="userMenu" v-if="isOpenMenu" ref="userMenu">
						<div v-for="(route, index) in userRoutes" :key="index" @mouseover="onMouseover('user-' + route.meta.icon)" @mouseout="onMouseout" @click="goToPath(route)">
							<span><svg-icon :name="'user-' + route.meta.icon" size="18px" :hover="hoverItem"></svg-icon></span>
							<span>{{ $t(`common[${route.meta.title}]`) }}</span>
						</div>
						<div class="mt_6px mb_6px login_out" @mouseover="onMouseover('user-logout')" @mouseout="onMouseout" @click="logOut">
							<span><svg-icon name="user-logout" size="18px" :hover="hoverItem"></svg-icon></span>
							<span> {{ $t(`common['退出登陆']`) }}</span>
						</div>
					</div>
				</div>
			</div>

			<div class="flex-center" v-else>
				<div class="loginBtn btn" @click="openLoginModal">{{ $t(`common['登陆']`) }}</div>
				<div class="registerBtn btn" @click="openRegisterModal">{{ $t(`common['注册']`) }}</div>
			</div>

			<div class="lang">
				<img :src="LangIcon" alt="" @click="openLangCurrenyConfig" />
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useMenuStore } from "/@/stores/modules/menu";
import { useUserStore } from "/@/stores/modules/user";
import eventBus from "/@/utils/eventBus";
import Common from "/@/utils/common";
import { modalEnum } from "/@/enum/modalEnum";
import { onClickOutside } from "@vueuse/core";

import userRoutes from "/@/router/modules/userMenu";
import router from "/@/router";

import useSvgHoverHooks from "/@/hooks/useSvgHover";
const { onMouseout, onMouseover, hoverItem } = useSvgHoverHooks();

const MenuStore = useMenuStore();
const UserStore = useUserStore();
const userMenu = ref(null);
const currentHover = ref();

const isOpenMenu = ref(false);

const collapse = computed(() => {
	return MenuStore.getCollapse;
});
const isLogin = computed(() => {
	return UserStore.getLogin;
});
const LangIcon = computed(() => {
	return UserStore.getLangList.find((item: any) => item.code == UserStore.getLang)?.icon;
});

const openUserMenu = () => {
	isOpenMenu.value = true;
	currentHover.value = null;
};
onClickOutside(userMenu, (event) => {
	isOpenMenu.value = false;
});
const openLoginModal = () => {
	eventBus.emit("show-modal", modalEnum.LoginModal);
};
const openRegisterModal = () => {
	eventBus.emit("show-modal", modalEnum.RegisterModal);
};
const openLangCurrenyConfig = () => {
	eventBus.emit("show-modal", modalEnum.LangCurrenyConfig);
};
const mouseover = (icon: string) => {
	currentHover.value = icon;
};
const goToPath = (route: any) => {
	isOpenMenu.value = false;
	router.push({ name: route.name });
};
const logOut = () => {
	UserStore.logOut();
};
</script>

<style scoped lang="scss">
.header {
	position: fixed;
	height: 64px;
	top: 0;
	left: 260px;
	width: calc(100% - 260px);
	display: flex;
	align-items: center;
	justify-content: center;

	background: var(--Bg1);
	box-shadow: 0px 4px 12px 0px rgba(14, 16, 19, 0.25);
	color: var(--Text1);
	&.collapse {
		left: 64px;
		width: calc(100% - 64px);
	}
	> div {
		flex: 1;
		display: flex;
		justify-content: end;
		align-items: center;
		.balance_box {
			background: var(--Bg2);
			height: 44px;
			padding: 3px;
			gap: 0;
			border-radius: 4px;
			.recharge {
				border-radius: 4px;
				width: 78px;
				height: 38px;
				text-align: center;
				line-height: 38px;
				background: linear-gradient(180deg, rgba(255, 40, 75, 0.1) 0%, rgba(255, 40, 75, 0.8) 100%);
				color: var(--Text_a);
			}
			.balance {
				margin: 0 18px 0 12px;
				display: flex;
				align-items: center;
			}
		}
		.message {
			position: relative;
			.notice {
				position: absolute;
				top: 0;
				right: 0;
				height: 8px;
				width: 8px;
				background-color: var(--Theme);
				border-radius: 50%;
			}
		}
		.user {
			position: relative;
			.userMenu {
				position: absolute;
				top: 100%;
				right: -40px;
				display: block;
				width: 220px;
				transform: translateY(25px);
				background: var(--Bg1);
				border-radius: 4px;
				box-shadow: 0px 4px 12px 0px rgba(14, 16, 19, 0.25);
				> div {
					display: flex;
					align-items: center;
					gap: 12px;
					height: 44px;
					padding: 0 24px;
					font-size: 14px;
					line-height: 14px;
				}
				.login_out {
					border-top: 1px solid var(--Line_2);
					height: 58px;
				}
				> div:hover {
					background: var(--Bg2);
					color: var(--Text_s);
				}
			}
		}
		> div {
			margin: 8px;
			cursor: pointer;
		}
		.btn {
			padding: 11px 40px;
			border-radius: 4px;
		}
		.loginBtn {
			background: var(--butter);
		}
		.registerBtn {
			color: var(--Text_a);
			background: linear-gradient(180deg, rgba(255, 40, 75, 0.1) 0%, rgba(255, 40, 75, 0.8) 100%);
		}
		.lang {
			position: relative;
			img {
				width: 27px;
				height: 27px;
				border-radius: 50%;
				padding: 2px;
				border: 1px solid var(--light-Theme-, #ff284b);
			}
		}
	}
}
.lang::after {
	content: "";
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translate(-50%, 50%);
	display: inline-block;
	height: 14px;
	width: 14px;
	background: url("/@/assets/svg/dark/lang_down_icon.svg");
}
</style>
