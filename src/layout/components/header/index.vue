<template>
	<header class="header" :class="collapse ? 'collapse' : ''">
		<div class="max-width">
			<div class="flex-center" v-if="isLogin">
				<div class="balance_box flex-center">
					<div class="balance">
						<img src="/@/assets/common/coin.png" alt="" style="height: 16px" class="mr_4" />
						<span>{{ Common.thousands(UserStore.getUserInfo.totalBalance) }}</span>
					</div>
					<div class="recharge" @click="router.push('/user/deposit')">{{ $t(`common['充值']`) }}</div>
				</div>
				<div class="flex-center message" @click="openMessageCenter" v-hover-svg>
					<svg-icon name="message" size="32px" />
					<span class="notice"></span>
				</div>
				<div class="lang user">
					<div>
						<img v-lazy-load="LangIcon" alt="" @click="openUserMenu" />
						<div class="userMenu" v-if="isOpenMenu" ref="userMenu">
							<div v-for="(route, index) in userRoutes" :key="index" @click="goToPath(route)" v-hover-svg>
								<span><svg-icon :name="'user-' + route.meta.icon" size="18px"></svg-icon></span>
								<span>{{ $t(`common['${route.meta.title}']`) }}</span>
							</div>

							<div class="mt_6px mb_6px login_out" @click="logOut" v-hover-svg>
								<span><svg-icon name="user-logout" size="18px"></svg-icon></span>
								<span> {{ $t(`common['退出登陆']`) }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="flex-center" v-else>
				<div class="loginBtn btn" @click="openLoginModal">{{ $t(`common['登陆']`) }}</div>
				<div class="registerBtn btn" @click="openRegisterModal">{{ $t(`common['注册']`) }}</div>
			</div>

			<div class="lang">
				<img v-lazy-load="LangIcon" alt="" @click="openLangCurrenyConfig" />
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useMenuStore } from "/@/stores/modules/menu";
import { useUserStore } from "/@/stores/modules/user";
import Common from "/@/utils/common";
import { onClickOutside } from "@vueuse/core";
import userRoutes from "/@/router/modules/userMenu";
import router from "/@/router";
import { useModalStore } from "/@/stores/modules/modalStore";
const modalStore = useModalStore();

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
onClickOutside(userMenu, () => {
	isOpenMenu.value = false;
});

const openMessageCenter = () => {
	modalStore.openModal("messageCenter");
};
const openLoginModal = () => {
	modalStore.openModal("LoginModal");
};
const openRegisterModal = () => {
	modalStore.openModal("RegisterModal");
};
const openLangCurrenyConfig = () => {
	modalStore.openModal("LangCurrenyConfig");
};
const goToPath = (route: any) => {
	if (route.name === "invite_friends") {
		modalStore.openModal("InviteFriends");
	} else {
		isOpenMenu.value = false;
		router.push({ name: route.name });
	}
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
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	background: var(--Bg1);
	box-shadow: 0px 4px 12px 0px rgba(14, 16, 19, 0.25);
	color: var(--Text1);
	z-index: 100;
	padding-left: 260px;
	transition: all 0.2s ease;
	&.collapse {
		padding-left: 64px;
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
				right: -40px;
				display: block;
				width: 220px;
				overflow-y: auto;
				overflow-x: hidden;
				transform: translateY(25px);
				background: var(--Bg1);
				border-radius: 4px;
				z-index: 150;
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
			.userMenu::-webkit-scrollbar {
				display: none;
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
	bottom: 0px;
	left: 50%;
	transform: translate(-50%, 50%);
	display: inline-block;
	height: 14px;
	width: 14px;
	background: url("/@/assets/svg/dark/lang_down_icon.svg");
	background-size: cover;
}
</style>
