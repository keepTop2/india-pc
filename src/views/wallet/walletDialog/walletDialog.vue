<template>
	<CommonDialog v-model="isModalVisible" @close="clearComponent">
		<div class="wallet_container">
			<div class="wallet_main">
				<div class="wallet_container_header">
					<svg-icon name="close" size="30px" class="close pointer" @click="isModalVisible = false" />
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
import { ref, watch, computed, type Component } from "vue";
import { useRoute, useRouter } from "vue-router";
import pubsub from "/@/pubSub/pubSub";

import Recharge from "/@/views/wallet/recharge/recharge.vue";
import Withdrawal from "/@/views/wallet/withdrawal/withdrawal.vue";
import CurrencyConverter from "/@/views/wallet/currencyConverter/currencyConverter.vue";
import AccountChangeDetails from "/@/views/wallet/accountChangeDetails/accountChangeDetails.vue";

const route = useRoute();
const router = useRouter();
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
const RechargeSuccess = (orderNo: string) => {
	setComponent("accountChangeDetails");
	router.replace({ query: { walletDialogName: "accountChangeDetails", orderNo } });
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

// 更新当前组件及标签的路由参数
function setComponent(walletDialogName: string) {
	activeTab.value = walletDialogName; // 更新激活的标签
	router.replace({ query: { ...route.query, walletDialogName } });
}

// 清空路由参数，关闭弹窗
const clearComponent = () => {
	router.replace({ query: {} });
	isModalVisible.value = false;
};

// 关闭时清空组件信息
watch(isModalVisible, (visible) => {
	if (!visible) clearComponent();
});
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
		height: calc(634px - 40px); // 减去 header 的高度（假设 header 高度为80px）
		margin: 20px 20px 20px; // 上边距为20px，确保内容与 header 有间距
		padding: 0; // 移除内边距
		border-radius: 12px;
		overflow-y: auto; // 允许纵向滚动
	}

	.wallet_container_header {
		position: sticky;
		top: 0px;
		z-index: 1;
		padding: 20px 20px 0px 20px;
		background-color: var(--Bg1);
		border-top-left-radius: 12px;
		border-top-right-radius: 12px;
	}
	.close {
		position: absolute;
		top: 20px;
		right: 20px;
	}

	.tabs {
		width: 100%;
		display: flex;
		gap: 10px;
		padding-right: 30px;
		border-bottom: 1px solid var(--Line_1);
		box-shadow: 0px 1px 0px 0px #343d48;

		.tab {
			min-width: 120px;
			height: 40px;
			padding: 2px;
			text-align: center;
			color: var(--Text1);
			font-family: "PingFang SC";
			font-size: 22px;
			font-weight: 400;
			cursor: pointer;
		}

		.tab_active {
			position: relative;
			color: var(--Text_s);
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
