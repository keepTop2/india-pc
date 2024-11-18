<template>
	<header class="header" :class="collapse ? 'collapse' : ''">
		<div class="max-width center">
			<div class="login_plan">
				<svg-icon name="common-logo" width="132px" height="16px" v-if="collapse" class="curp" @click="router.push('/')" />
			</div>
			<div class="flex-center" v-if="isLogin">
				<div class="balance_box flex-center">
					<div class="balance" @click="isOpenplatCurrency = true">
						<img :src="UserStore.getUserInfo.currencyIconFileUrl" alt="" style="height: 16px" class="mr_4" />
						<span>{{ Common.thousands(UserStore.getUserInfo.totalBalance) }}</span>
						<svg-icon name="common-arrow_down" size="16px" class="curp ml_8" />
					</div>
					<div class="recharge" @click="openWalletDialog">{{ $t(`common['充值']`) }}</div>

					<div class="platAmount find-in" v-if="isOpenplatCurrency" ref="platCurrency">
						<div class="mb_12">
							<img v-lazy-load="UserStore.getUserInfo.currencyIconFileUrl" alt="" style="height: 16px" class="mr_4" />
							<span>{{ Common.thousands(UserStore.getUserInfo.totalBalance) }}</span>
						</div>
						<div class="line"></div>
						<div class="mt_12">
							<img v-lazy-load="UserStore.getUserInfo.platCurrencyIconFileUrl" alt="" style="height: 16px" class="mr_4" />
							<span>{{ Common.thousands(UserStore.getUserInfo.platAvailableAmount) }}</span>
							<Button>转换</Button>
						</div>
					</div>
				</div>
				<div class="flex-center message" @click="openMessageCenter" v-hover-svg>
					<svg-icon name="message" size="32px" />
					<span class="notice"></span>
				</div>
				<div class="lang user">
					<div>
						<img v-lazy-load="LangIcon" alt="" @click="openUserMenu" />
						<div class="userMenu" v-if="isOpenMenu" ref="userMenu">
							<div v-for="(item, index) in userMenus" :key="index" @click="goToPath(item)" v-hover-svg>
								<span><svg-icon :name="'user-' + item.icon" size="18px"></svg-icon></span>
								<span>{{ item.title }}</span>
							</div>
							<div class="mt_6px mb_6px login_out" @click="logOut" v-hover-svg>
								<span><svg-icon name="user-logout" size="18px"></svg-icon></span>
								<span> {{ $t(`common['退出登录']`) }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="flex-center" v-else style="gap: 16px">
				<div class="loginBtn btn fs_14" @click="openLoginModal">{{ $t(`common['登录']`) }}</div>
				<div class="registerBtn btn" @click="openRegisterModal">{{ $t(`common['注册']`) }}</div>
			</div>

			<messageCenter v-model="messageCenterVisible" />
		</div>
	</header>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useMenuStore } from "/@/stores/modules/menu";
import { useUserStore } from "/@/stores/modules/user";
import pubsub from "/@/pubSub/pubSub";
import Common from "/@/utils/common";
import { onClickOutside } from "@vueuse/core";
import userRoutes from "/@/router/modules/userMenu";
import router from "/@/router";
import { useModalStore } from "/@/stores/modules/modalStore";
import messageCenter from "/@/views/messageCenter/index.vue";
const userMenus = [
	{
		title: "个人信息",
		icon: "user_info",
		type: "modal",
		value: "userInfo",
	},
	{
		title: "存款",
		icon: "deposit",
		type: "page",
		value: "recharge",
	},
	{
		title: "提款",
		icon: "withdraw",
		type: "page",
		value: "withdrawal",
	},
	{
		title: "平台币转换",
		icon: "currencyConverter",
		type: "page",
		value: "currencyConverter",
	},
	{
		title: "交易记录",
		icon: "transaction_history",
		type: "page",
		value: "transactionRecords",
	},
	{
		title: "投注记录",
		icon: "bet_records",
		type: "page",
		value: "bettingRecords",
	},
	{
		title: "安全中心",
		icon: "security_center",
		type: "page",
		value: "security_center",
	},
	{
		title: "VIP俱乐部",
		icon: "vip",
		type: "modal",
		value: "vip",
	},
	{
		title: "邀请好友",
		icon: "invite_friends",
		type: "modal",
		value: "InviteFriends",
	},
	{
		title: "联盟计划",
		icon: "league",
		type: "modal",
	},
	{
		title: "意见反馈",
		icon: "feedback",
		type: "page",
		value: "feedback",
	},
];
const modalStore = useModalStore();

const MenuStore = useMenuStore();
const UserStore = useUserStore();
const userMenu = ref(null);
const platCurrency = ref(null);
const currentHover = ref();

const isOpenMenu = ref(false);
const isOpenplatCurrency = ref(false);

const collapse = computed(() => {
	return MenuStore.getCollapse;
});
const isLogin = computed(() => {
	return UserStore.getLogin;
});
const LangIcon = computed(() => {
	return UserStore.getLangList.find((item: any) => item.code == UserStore.getLang)?.iconFileUrl;
});

const openUserMenu = () => {
	isOpenMenu.value = true;
	currentHover.value = null;
};
onClickOutside(userMenu, () => {
	isOpenMenu.value = false;
});
onClickOutside(platCurrency, () => {
	isOpenplatCurrency.value = false;
});

// 消息中心
const messageCenterVisible = ref(false);
const openMessageCenter = () => {
	messageCenterVisible.value = true;
	// modalStore.openModal("messageCenter");
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

const openWalletDialog = () => {
	pubsub.publish("openWalletDialog");
};
const goToPath = (route: any) => {
	if (route.type === "page") {
		router.push({ name: route.value });
	} else {
		modalStore.openModal(route.value);
	}
	// if (route.name === "invite_friends") {
	// 	modalStore.openModal("InviteFriends");
	// } else if (route.name === "vip") {
	// 	modalStore.openModal("vip");
	// } else if (route.name === "userInfo") {
	// 	modalStore.openModal("userInfo");
	// } else if (route.name === "medal") {
	// 	modalStore.openModal("medal");
	// } else {
	// 	router.push({ name: route.name });
	// }
	isOpenMenu.value = false;
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
	background: var(--Bg-1);
	box-shadow: 0px 4px 12px 0px rgba(14, 16, 19, 0.25);
	color: var(--Text-1);
	z-index: 100;
	padding-left: 260px;
	transition: all 0.2s ease;
	.login_plan {
		height: 16px;
		padding-left: 10px;
		z-index: 1100;
		position: absolute;
		left: 60px;
		height: 64px;
		line-height: 64px;
	}
	&.collapse {
		padding-left: 64px;
	}

	> div.center {
		flex: 1;
		display: flex;
		justify-content: end;
		align-items: center;

		.balance_box {
			background: var(--Bg-2);
			height: 44px;
			padding: 3px;
			gap: 0;
			border-radius: 4px;
			position: relative;
			.recharge {
				border-radius: 4px;
				width: 78px;
				height: 38px;
				text-align: center;
				line-height: 38px;
				background: linear-gradient(180deg, rgba(255, 40, 75, 0.1) 0%, rgba(255, 40, 75, 0.8) 100%);
				color: var(--Text-a);
			}

			.balance {
				margin: 0 18px 0 12px;
				display: flex;
				align-items: center;
			}
			.platAmount {
				position: absolute;
				top: 60px;
				left: 0;
				width: 284px;
				padding: 12px 14px;
				background-color: var(--Bg-1);
				color: var(--Text-s);
				font-weight: 500;
				border-radius: 4px;
				.line {
					height: 1px;
					background: var(--Line-2);
				}
				> div {
					display: flex;
					align-items: center;
					img {
						border-radius: 50%;
					}
					button {
						height: 26px;
						padding: 5px 14px;
						font-size: 12px;
						width: auto;
						margin-left: auto;
						color: var(--Text-a);
					}
				}
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
				background: var(--Bg-1);
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
					border-top: 1px solid var(--Line-2);
					height: 58px;
				}

				> div:hover {
					background: var(--Bg-2);
					color: var(--Text-s);
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
			background: var(--Butter);
		}

		.registerBtn {
			color: var(--Text-a);
			height: 44px;
			background: linear-gradient(180deg, rgba(255, 40, 75, 0.1) 0%, rgba(255, 40, 75, 0.8) 100%);
			border-bottom: 2px solid var(--Theme);
		}

		.lang {
			position: relative;

			img {
				width: 27px;
				height: 27px;
				border-radius: 50%;
				padding: 2px;
				border: 1px solid var(--Theme);
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
