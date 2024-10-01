<template>
	<div class="shopCart" v-if="!isOrdered">
		<!-- 头部信息 -->
		<div class="header-container" @click="changeShopCart">
			<div class="left">
				<span>投注单</span>
				<span class="num_total" v-if="ChampionShopCartStore.championBetData.length">{{ ChampionShopCartStore.championBetData.length }}</span>
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
			<div class="noData" v-if="!ChampionShopCartStore.championBetData.length && !sportsBetEvent.sportsBetEventData.length"><span> 请完成您的下注 </span></div>
			<!-- 购物车赛事列表 -->
			<div class="shop-plan" v-else>
				<div class="event-list" ref="container">
					<template v-for="(data, index) in ChampionShopCartStore.championBetData" :key="index">
						<!-- 冠军赛事列表卡片 单关串关公用 -->
						<ChampionCard v-if="data.type == '1'" :shopData="data" :hasClose="true" />
						<!-- 盘口赛事列表卡片 -->
						<EventCard v-if="data.type == '0'" :shopData="data.event" :hasClose="true" />
					</template>

					<!-- 单关表单 -->
					<SingleTicketFrom v-if="ChampionShopCartStore.championBetData.length == 1" />
					<!-- 指示箭头 -->
					<img v-if="arrowShow" class="left_arrow" :src="left_arrow" />
				</div>

				<div class="footer-container">
					<!-- 单关投注按钮 -->
					<SingleTicketFooter :cartStatus="cartStatus" @singleTicketSuccess="getSingleTicketSuccess" />
				</div>
			</div>
		</div>
	</div>

	<!-- 下单结束 -->
	<template v-if="isOrdered">
		<!-- 单关投注返回结果 -->
		<SingleTicketFinish v-if="ChampionShopCartStore.championBetData.length == 1" :data="state.singleTicketSuccess" @onOrderConfirm="onOrderConfirm" />
	</template>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, provide, reactive, ref, watch } from "vue";
import left_arrow from "/@/assets/zh-CN/sports/left_arrow.gif";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import {
	ChampionCard,
	EventCard,
	SingleTicketFrom,
	SingleTicketFooter,
	SingleTicketFinish,
} from "/@/views/sports/layout/components/sportsShopCart/components/championCart/components/index";

import sportsApi from "/@/api/sports/sports";
import Common from "/@/utils/common";
import weakHint from "/@/hooks/weakHint";
import { useSportsBetChampionStore } from "/@/stores/modules/sports/championShopCart";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
import { debounce, throttle, isEmpty } from "lodash-es";
import { useLoading } from "/@/directive/loading/hooks";
import { useSportsBetInfoStore } from "/@/stores/modules/sports/sportsBetInfo";
import { i18n } from "/@/i18n/index";
import { getBetOrderId } from "/@/views/sports/utils/commonFn";
import { useToLogin } from "/@/hooks/toLogin";
import { useUserStore } from "/@/stores/modules/user";
import shopCartChampionPubSub from "/@/views/sports/hooks/shopCartChampionPubSub";
const UserStore = useUserStore();
const { toLogin } = useToLogin();
const $: any = i18n.global;
const { startLoading, stopLoading } = useLoading();
const sportsBetInfo = useSportsBetInfoStore();
const ShopCatControlStore = useShopCatControlStore();
const ChampionShopCartStore = useSportsBetChampionStore();
const { weakOpen, weakClose } = weakHint();

const sportsBetEvent = useSportsBetEventStore();

const isRotating = ref(false);

const isChange = ref(false);
/**  是否下单结束 */
const isOrdered = ref(false);
const container = ref<HTMLElement | null>(null);
const hasScrollbar = ref(false);
const arrowShow = ref(false);

const state = reactive({
	singleTicketSuccess: {}, // 单关下注详情
});

onMounted(() => {
	// 请求余额信息
	// getIndexInfo();
	// 请求注单ID
	getBetOrderId();
	// 请求赔率设置
	// getPublicSetting();
});

// 监听冠军购物车储存数量
watch(
	() => ChampionShopCartStore.championBetData.length,
	(newValue, oldValue) => {
		console.log("冠军购物车触发", newValue);
		// 长度变化则监听
		if (newValue == 1 && !oldValue) {
			ShopCatControlStore.setShopCatShow(true);
		}
		if (ShopCatControlStore.getShopCatShow && newValue > 0) {
			nextTick(() => {
				// getHasScrollbar();
			});
			// 开启线程
			// ChampionShopCartStore.championOpenSse();
		}
	}
);

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

// 关闭弹窗
const onClickClear = () => {
	ShopCatControlStore.setShopCatShow(false);
};

/**
 * @description 单关请求回调执行
 */
const getSingleTicketSuccess = (result: any) => {
	isOrdered.value = true;
	state.singleTicketSuccess = result;
};

// 确认投注订单
const onOrderConfirm = () => {
	ChampionShopCartStore.clearChampionShopCart();
	isOrdered.value = false;
	shopCartChampionPubSub.initializeState();
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
		padding: 10px 0px 15px;

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

	.bottom {
		padding: 10px 15px 15px;
		border-radius: 8px;
		background: var(--Bg4);
		.part1 {
			.auth {
				.checkbox {
					width: fit-content;

					display: flex;
					align-items: center;
					gap: 10px;
					cursor: pointer;
					.icon {
						width: 18px;
						height: 18px;
						color: var(--Bg5);
					}
					.label {
						color: var(--Text1);
						font-family: "PingFang SC";
						font-size: 14px;
						font-weight: 400;
						line-height: 20px;
					}
				}
			}
		}

		.part2 {
			margin: 5px 0;
			padding-top: 15px;

			.el-button {
				margin: 5px 0;
			}

			.confirming {
				& > .el-button:last-child {
					border: 1px solid var(--Theme);
					background: var(--Bg3);
					color: var(--Theme);
				}
			}
		}
	}
}

.shop-plan {
	display: grid;
	gap: 6px;
	.event-list {
		display: grid;
		gap: 6px;
		padding: 0px 15px;
		max-height: 450px;
		overflow-y: auto;
	}
	.footer-container {
		padding: 0px 15px;
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
	animation: reflash 1s infinite linear;
}

@keyframes reflash {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>
