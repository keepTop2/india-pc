<template>
	<div class="shopCart" v-if="!isOrdered">
		<!-- 头部信息 -->
		<div class="header-container" @click="changeShopCart">
			<div class="left">
				<span class="label">投注单</span>
				<span class="num_total" v-if="sportsBetEvent.sportsBetEventData.length">{{ sportsBetEvent.sportsBetEventData.length }}</span>
				<span class="arrow"><svg-icon name="sports-arrow_card_header" width="12px" height="8px"></svg-icon></span>
			</div>
			<div class="right">
				<!-- 余额信息 -->
				<div class="sportsBetEventData" @click.stop="refreshBalance">
					<span class="stake">{{ Common.formatAmount(Number(sportsBetInfo.balance)) }}</span>
					<span class="refresh_icon" :class="{ rotateAn: isRotating }" @animationend="handleAnimationEnd"><svg-icon name="sports-refresh" size="18px"></svg-icon></span>
				</div>
				<!-- 关闭按钮 -->
				<span v-if="ShopCatControlStore.getShopCatShow" class="close_icon" @click.stop="onClickClear"><svg-icon name="sports-close" size="30px"></svg-icon></span>
			</div>
		</div>
		<div v-if="ShopCatControlStore.getShopCatShow" class="container-main">
			<!-- 无赛事时展示 -->
			<div class="noData" v-if="!sportsBetEvent.sportsBetEventData.length"><span> 请完成您的下注 </span></div>
			<!-- 购物车赛事列表 -->
			<div class="shop-plan" v-else>
				<div class="event-list">
					<!-- 赛事列表 单关串关公用 -->
					<EventCard v-for="(data, index) in sportsBetEvent.sportsBetEventData" :key="index" :shopData="data" :hasClose="true" />
					<!-- 单关表单 -->
					<SingleTicketFrom v-if="sportsBetEvent.sportsBetEventData.length == 1" />
					<!-- 串关表单 -->
					<ParlayTicketsFrom v-if="sportsBetEvent.sportsBetEventData.length > 1" />
				</div>
				<!-- 单关投注按钮 -->
				<SingleTicketFooter v-if="sportsBetEvent.sportsBetEventData.length == 1" @singleTicketSuccess="getSingleTicketSuccess" />
				<!-- 串关键盘按钮 -->
				<ParlayTicketsFooter v-if="sportsBetEvent.sportsBetEventData.length > 1" @parlayTicketsSuccess="getParlayTicketsSuccess" />
			</div>
		</div>
	</div>

	<!-- 下单结束 -->
	<template v-if="isOrdered">
		<!-- 单关投注返回结果 -->
		<SingleTicketFinish v-if="sportsBetEvent.sportsBetEventData.length == 1" :data="state.singleTicketSuccess" @onOrderConfirm="onOrderConfirm" />
		<!-- 串关投注返回结果 -->
		<ParlayTicketsFinish v-if="sportsBetEvent.sportsBetEventData.length > 1" :data="state.parlayTicketsSuccess" @onOrderConfirm="onOrderConfirm" @onSecondBet="onSecondBet" />
	</template>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { EventCard, SingleTicketFrom, ParlayTicketsFrom, SingleTicketFooter, ParlayTicketsFooter, SingleTicketFinish, ParlayTicketsFinish } from "./components/index";

import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import Common from "/@/utils/common";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
import { useSportsBetInfoStore } from "/@/stores/modules/sports/sportsBetInfo";
import { getBetOrderId } from "/@/views/sports/utils/commonFn";
import { useUserStore } from "/@/stores/modules/user";
import shopCartPubSub from "/@/views/sports/hooks/shopCartPubSub";
const sportsBetInfo = useSportsBetInfoStore();
const ShopCatControlStore = useShopCatControlStore();
const sportsBetEvent = useSportsBetEventStore();
const isRotating = ref(false);

const isChange = ref(false);
/**  是否下单结束 */
const isOrdered = ref(false);

const state = reactive({
	singleTicketSuccess: {}, // 单关下注详情
	parlayTicketsSuccess: {}, // 串关下注详情
});

onMounted(() => {
	// 请求余额信息
	// getIndexInfo();
	// 请求注单ID
	getBetOrderId();
	// 请求赔率设置
	// getPublicSetting();
});

// 监听购物车赛事变化
watch(
	() => sportsBetEvent.sportsBetEventData.length,
	(newValue, oldValue) => {
		// 长度变化则监听
		if (newValue == 1 && !oldValue) {
			// 首次有赛事加入开启弹窗
			ShopCatControlStore.setShopCatShow(true);
		}
		// 判断购物车弹窗层开启的时候 购物车赛事发生变化 则重新开关线程发起推送
		// 还需要判断购物车赛事信息是否有 需要赛事信息大于0
		if (ShopCatControlStore.getShopCatShow && newValue > 0) {
			// 开启线程
			sportsBetEvent.sportsOpenSse();
		}
		/** 长度小于0时 清除改动记录 */
		if (!newValue) {
			isChange.value = false;
		}
	}
);

/*购物车隐藏时 关闭错误弹框*/
watch(
	() => ShopCatControlStore.getShopCatShow,
	(newValue) => {
		if (newValue) {
		}
	}
);

/**
 * @description 单关请求回调执行
 */
const getSingleTicketSuccess = (result: any) => {
	sportsBetEvent.closeShopCart(); // 关闭购物车弹窗
	isOrdered.value = true; // 开启投注成功注单列表
	state.singleTicketSuccess = result;
};

/**
 * @description 串关请求回调执行
 */
const getParlayTicketsSuccess = (result: any) => {
	sportsBetEvent.closeShopCart(); // 关闭购物车弹窗
	isOrdered.value = true;
	state.parlayTicketsSuccess = result;
};

// 刷新余额交互
const refreshBalance = () => {
	if (isRotating.value) {
		return;
	}
	// 刷新余额
	useUserStore().initUserInfo();
	// 触发旋转动画
	isRotating.value = true;
};

// 动画结束时，移除旋转效果
function handleAnimationEnd() {
	isRotating.value = false;
}

// 打开关闭弹窗
const changeShopCart = () => {
	if (ShopCatControlStore.getShopCatShow) {
		ShopCatControlStore.setShopCatShow(false);
	} else {
		ShopCatControlStore.setShopCatShow(true);
	}
};

/**
 * @description 二次投注执行
 */
const onSecondBet = () => {
	// 开启线程
	sportsBetEvent.sportsOpenSse();
	// 开启赛事列表
	isOrdered.value = false;
	// 开启购物车弹窗
	ShopCatControlStore.setShopCatShow(true);
};

// 关闭弹窗
const onClickClear = () => {
	ShopCatControlStore.setShopCatShow(false);
};

// 订单确认
const onOrderConfirm = () => {
	sportsBetEvent.clearShopCart();
	isOrdered.value = false;
	shopCartPubSub.initializeState();
};
</script>

<style scoped lang="scss">
.shopCart {
	width: 520px;
	min-height: 100%;
	background: var(--Bg1);
	color: var(--Text_s);
	box-shadow: 0px -3px 30px 0px rgba(14, 16, 19, 0.4);
	border-radius: 4px;
	box-sizing: border-box;

	.header-container {
		height: 52px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0px 15px;
		cursor: pointer;

		.left {
			display: flex;
			gap: 8px;

			.label {
				color: var(--Text_s);
				font-family: "PingFang SC";
				font-size: 16px;
				font-weight: 500;
			}

			.num_total {
				width: 21px;
				height: 21px;
				display: flex;
				align-items: center;
				justify-content: center;
				background: var(--Theme);
				font-size: 14px;
				color: #fff;
				border-radius: 50%;
			}

			.arrow {
				width: 12px;
				height: 8px;
				transition: 0.3s ease;
			}
		}

		.right {
			display: flex;
			align-items: center;
			gap: 10px;

			.sportsBetEventData {
				height: 34px;
				display: flex;
				align-items: center;
				padding: 8px 10px;
				border-radius: 34px;
				gap: 10px;
				background: var(--Bg3);
				color: var(--Theme);
				cursor: pointer;

				.stake {
					text-align: right;
					font-family: "DIN Alternate";
					font-size: 14px;
					font-style: normal;
					font-weight: 700;
					line-height: normal;
					color: var(--Text_s) !important;
				}
				.refresh_icon {
					width: 18px;
					height: 18px;
				}
			}
			.close_icon {
				width: 30px;
				height: 30px;
			}
		}
	}

	.container-main {
		position: relative;
		overflow-y: hidden;
		padding: 10px 15px 15px;

		&::after {
			position: absolute;
			content: "";
			top: 0px;
			left: 0px;
			width: 100%;
			height: 1px;
			background-color: var(--Line_1);
			box-shadow: 0px 1px 0px 0px #343d48;
		}
	}

	.noData {
		padding: 18px 0;
		text-align: center;
		font-size: 14px;
		color: var(--Text1);
	}
}

.shop-plan {
	display: grid;
	gap: 6px;
	.event-list {
		display: grid;
		gap: 6px;
	}
}

.left_arrow {
	position: absolute;
	bottom: 20%;
	left: 48%;
	width: 22px;
	height: 16px;
	transform: rotate(-90deg);
	cursor: pointer;
}

.rotate {
	transform: rotate(180deg);
}

.rotateAn {
	transform-origin: 50% 50%;
	animation: reflash 1s linear 1;
}

@keyframes reflash {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
