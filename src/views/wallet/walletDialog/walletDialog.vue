<template>
	<CommonDialog v-model="isModalVisible">
		<div class="wallet_container">
			<div class="wallet_main">
				<div class="wallet_container_header">
					<svg-icon name="common-close" size="30px" class="close pointer" @click="closeDialog" />
					<div class="tabs">
						<div class="tab" :class="{ tab_active: activeTab === 'recharge' }" @click="setComponent('recharge')">{{ $t(`wallet['存款']`) }}</div>
						<div class="tab" :class="{ tab_active: activeTab === 'withdrawal' }" @click="setComponent('withdrawal')">{{ $t(`wallet['提款']`) }}</div>
						<div class="tab" :class="{ tab_active: activeTab === 'currencyConverter' }" @click="setComponent('currencyConverter')">{{ $t(`wallet['转换']`) }}</div>
					</div>
				</div>
				<component
					:is="currentComponent"
					:dialogType="true"
					@RechargeSuccess="RechargeSuccess"
					@CancelDepositOrder="CancelDepositOrder"
					@ContinueRecharge="ContinueRecharge"
				></component>
			</div>
		</div>
	</CommonDialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, type Component, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import pubsub from "/@/pubSub/pubSub";

import Recharge from "/@/views/wallet/recharge/recharge.vue";
import Withdrawal from "/@/views/wallet/withdrawal/withdrawal.vue";
import CurrencyConverter from "/@/views/wallet/currencyConverter/currencyConverter.vue";
import AccountChangeDetails from "/@/views/wallet/accountChangeDetails/accountChangeDetails.vue";

import { useUserStore } from "/@/stores/modules/user";
import { useModalStore } from "/@/stores/modules/modalStore";
import showToast from "/@/hooks/useToast";
import { i18n } from "/@/i18n/index";
import { useTipsDialog } from "/@/hooks/useTipsDialog";
const route = useRoute();
const router = useRouter();
const $: any = i18n.global;

const isModalVisible = ref(false);

const componentMap: Record<string, Component> = {
	recharge: Recharge as Component,
	withdrawal: Withdrawal as Component,
	currencyConverter: CurrencyConverter as Component,
	accountChangeDetails: AccountChangeDetails as Component,
};
// 当前激活的标签
const activeTab = ref(route.query.walletDialogName || "recharge");

// 当前组件
const currentComponent = computed(() => componentMap[activeTab.value as string] || Recharge);

// 订单充值成功回调
const RechargeSuccess = (routerParams: any) => {
	setComponent("accountChangeDetails");
	router.replace({ query: { walletDialogName: "accountChangeDetails", orderNo: routerParams.orderNo, tradeWayType: routerParams.tradeWayType } });
};

// 撤销订单成功回调
const CancelDepositOrder = () => {
	clearComponent();
};

// 继续充值回调
const ContinueRecharge = () => {
	setComponent("recharge");
};

// 订阅弹窗开启事件，并默认设置存款组件
pubsub.subscribe("openWalletDialog", () => {
	isModalVisible.value = true;
	setComponent("recharge");
});

// 订阅弹窗关闭事件
pubsub.subscribe("closeWalletDialog", () => {
	clearComponent();
});

// 更新当前组件及标签的路由参数
function setComponent(walletDialogName: string) {
	const UserStore = useUserStore();
	const modalStore = useModalStore();
	const { isSetPwd, phone } = toRefs(UserStore.getUserGlobalSetInfo);

	if (walletDialogName === "withdrawal") {
		if (!phone.value && !isSetPwd.value) {
			useTipsDialog({
				title: $.t(`wallet["温馨提示"]`),
				text: $.t(`wallet["您还未设置交易密码，请先设置交易密码"]`),
				confirmText: $.t(`wallet["去设置"]`),
				onConfirm: async () => {
					await clearComponent();
					await router.replace({ path: "/user/security_center" }); // 跳转到设置页面
					await modalStore.openModal("setWithdrawPwd");
				},
				onClose: () => {
					useTipsDialog({
						title: $.t(`wallet["温馨提示"]`),
						text: $.t(`wallet["您还未绑定手机号，请先绑定手机号"]`),
						confirmText: $.t(`wallet["去绑定"]`),
						onConfirm: async () => {
							await clearComponent();
							await router.replace({ path: "/user/security_center" }); // 跳转到绑定手机号页面
							await modalStore.openModal("setPhone");
						},
						onClose: () => {},
					});
				},
			});
			return;
		} else if (phone.value && !isSetPwd.value) {
			useTipsDialog({
				title: $.t(`wallet["温馨提示"]`),
				text: $.t(`wallet["您还未设置交易密码，请先设置交易密码"]`),
				confirmText: $.t(`wallet["去设置"]`),
				onConfirm: async () => {
					await clearComponent();
					await router.replace({ path: "/user/security_center" }); // 跳转到设置页面
					await modalStore.openModal("setWithdrawPwd");
				},
				onClose: () => {
					// 更新激活的标签并更新路由参数
					activeTab.value = walletDialogName;
					router.replace({ query: { ...route.query, walletDialogName } });
				},
			});
			return;
		}
	}
	// 更新激活的标签并更新路由参数
	activeTab.value = walletDialogName;
	router.replace({ query: { ...route.query, walletDialogName } });
}

// 清空路由参数，关闭弹窗
const clearComponent = () => {
	// router.replace({ query: {} });
	isModalVisible.value = false;
};

const closeDialog = () => {
	router.replace({ query: {} });
	isModalVisible.value = false;
};

// 关闭时清空组件信息
// watch(isModalVisible, (visible) => {
// 	if (!visible) clearComponent();
// });
</script>

<style scoped lang="scss">
.wallet_container {
	width: 980px;
	height: 634px;
	border-radius: 12px;
	background: var(--Bg);
	overflow: hidden;
	// overflow-y: auto;

	.wallet_main {
		position: relative;
		height: calc(634px - 40px); // 减去 header 的高度（假设 header 高度为80px）
		margin: 20px 20px 20px; // 上边距为20px，确保内容与 header 有间距
		padding: 0; // 移除内边距
		border-radius: 12px;
		overflow-y: auto; // 允许纵向滚动
		z-index: 2;
		/* 自定义滚动条样式 */
		::-webkit-scrollbar {
			width: 8px; // 滚动条的宽度
			background-color: transparent; // 滚动条背景色
		}

		::-webkit-scrollbar-thumb {
			background-color: rgba(0, 0, 0, 0.5); // 滚动块的颜色
			border-radius: 4px; // 滚动块的圆角
		}

		::-webkit-scrollbar-thumb:hover {
			background-color: rgba(0, 0, 0, 0.8); // 滚动块悬停时的颜色
		}

		::-webkit-scrollbar-track {
			background-color: rgba(255, 255, 255, 0.1); // 滚动条轨道的颜色
			border-radius: 4px; // 滚动条轨道的圆角
		}
	}

	.wallet_main {
		scrollbar-width: thin; // 设置滚动条为细
		scrollbar-color: rgba(0, 0, 0, 0.5) rgba(255, 255, 255, 0.1); // 滚动块颜色和轨道颜色
	}

	.wallet_container_header {
		position: sticky;
		top: 0px;
		z-index: 1;
		padding: 20px 20px 0px 20px;
		background-color: var(--Bg-1);
		border-top-left-radius: 12px;
		border-top-right-radius: 12px;
		z-index: 11;
	}
	.close {
		position: absolute;
		top: 20px;
		right: 20px;
	}

	.tabs {
		width: 100%;
		height: 40px;
		display: flex;
		gap: 10px;
		padding-right: 30px;
		border-bottom: 1px solid var(--Line-1);
		box-shadow: 0px 1px 0px 0px var(--Shadow-1);
		box-sizing: border-box;

		.tab {
			min-width: 120px;
			height: 40px;
			padding: 2px;
			text-align: center;
			color: var(--Text-1);
			font-family: "PingFang SC";
			font-size: 22px;
			font-weight: 400;
			cursor: pointer;
		}

		.tab_active {
			position: relative;
			color: var(--Text-s);
			&::after {
				position: absolute;
				content: "";
				bottom: 0px;
				left: 0px;
				width: 100%;
				height: 2px;
				background-color: var(--Theme);
			}
		}
	}
}
</style>
