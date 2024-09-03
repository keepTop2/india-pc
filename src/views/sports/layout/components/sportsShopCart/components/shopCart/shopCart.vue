<!--
 * @Author: WangMingxin
 * @Description: 体育- 联赛 - 购物车
-->
<template>
	<div class="shopCart" v-if="!isOrdered">
		<div class="header-container">
			<div class="handler" @click="changeShopCart">
				<div class="left">
					<span>投注单</span>
					<span class="num_total" v-if="sportsBetEvent.sportsBetEventData.length">{{ sportsBetEvent.sportsBetEventData.length }}</span>
					<SvgIcon iconName="arrowBottom_fill" width="12" height="8" :class="!ShopCatControlStore.getShopCatShow && 'rotate'" class="icon" />
				</div>
				<div class="right">
					<div class="sportsBetEventData" @click.stop="refreshBalance">
						<!-- 余额 -->
						<span class="stake">{{ balanceView }}</span>
						<SvgIcon iconName="refresh_theme" size="18" :class="{ rotateAn: isRefresh }" />
					</div>
					<SvgIcon v-if="ShopCatControlStore.getShopCatShow" iconName="close2" size="20" @click.stop="click_clear" />
				</div>
			</div>
		</div>
		<div v-if="ShopCatControlStore.getShopCatShow" class="container-main">
			<div class="noData" v-if="!sportsBetEvent.sportsBetEventData.length">
				<span> 请完成您的下注 </span>
			</div>
			<!-- 购物车 -->
			<div class="shop-plan" v-else>
				<div class="card-all" ref="cardAllRef" @scroll="handleScroll">
					<!-- 单注 -->
					<SinglePass
						ref="singlePassRef"
						v-if="sportsBetEvent.sportsBetEventData.length == 1"
						:shopData="sportsBetEvent.sportsBetEventData[0]"
						:unusual="btnDisabled"
						:isAccept="isAccept"
						:balance="balance"
						@oddsChanges="oddsChanges"
						@maxWinnable="setMaxWinnable"
						@orderConfirmation="singleOrderConfirmation"
					/>
					<!-- 串关下注 -->
					<template v-if="sportsBetEvent.sportsBetEventData.length > 1">
						<MoreShop
							ref="moreShopRef"
							:sportsBetEventData="sportsBetEvent?.sportsBetEventData"
							:unusual="btnDisabled"
							:combo="sportsBetEvent.combo"
							:isAccept="isAccept"
							:balance="balance"
							@oddsChanges="oddsChanges"
							@maxWinnable="setMaxWinnable"
							@orderConfirmation="moreOrderConfirmation"
							@onKeepOrder="onKeepOrder"
						>
						</MoreShop>
					</template>
				</div>
				<!-- 到底部的箭头 -->
				<img class="left_arrow" :src="left_arrow" alt="" v-show="showArrow" @click="scrollToBottom" />

				<div class="bottom">
					<div class="part1">
						<template v-if="sportsBetEvent.sportsBetEventData.length <= 1">
							<div class="auth">
								<el-checkbox v-if="oddsOption == 1" v-model="oddsOptionIsAccept" label="自动接受较优赔率" @change="onOddsOptionIsAccept(2)" />
								<el-checkbox v-if="oddsOption == 2" v-model="oddsOptionIsAccept" label="自动接受较优赔率" @change="onOddsOptionIsAccept(1)" />
							</div>
						</template>

						<template v-if="sportsBetEvent.sportsBetEventData.length > 1">
							<div class="auth">
								<el-checkbox v-if="priceOption == 1" v-model="priceOptionIsAccept" label="自动接受较优赔率" @change="onPriceOptionIsAccept(1)" />
							</div>
						</template>
						<planButton v-model:isAccept="isAccept" v-model:isChange="isChange" :maxWinnable="maxWinnable" @onBetting="onBetting" @setDisabled="setDisabled"></planButton>
					</div>
				</div>
			</div>
		</div>
	</div>
	<auth-hint-dialog v-model="hintVisible" />

	<!-- 下单结束 -->
	<template v-if="isOrdered">
		<!-- 单关投注返回结果 -->
		<SingleOrderStatus
			v-if="sportsBetEvent.sportsBetEventData.length == 1"
			:shopData="singleOrder?.shopData"
			:betInfo="singleOrder?.betInfo"
			:placeBetRes="singleOrder?.placeBetRes"
			:vendorTransId="singleOrder?.vendorTransId"
			@onOrderEnd="onOrderEnd"
		>
		</SingleOrderStatus>
		<!-- 串关投注返回结果 -->
		<MoreOrderStatus
			v-if="sportsBetEvent.sportsBetEventData.length > 1"
			:bettingMony="moreOrder?.bettingMony"
			:sportsBetEventData="moreOrder?.sportsBetEventData"
			:parlayTickets="moreOrder?.parlayTickets"
			:placeParlayRes="moreOrder?.placeParlayRes"
			:sunSubtotal="moreOrder?.sunSubtotal"
			:vendorTransId="moreOrder?.vendorTransId"
			@onOrderEnd="onOrderEnd"
			@onKeepOrder="onKeepOrder"
			@handleScroll="handleScroll"
		>
		</MoreOrderStatus>
	</template>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref, watch, watchEffect, nextTick, onUpdated } from "vue";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { authHintDialog, cardStatus, MoreShop, planButton, SinglePass, SingleOrderStatus, MoreOrderStatus } from "./components/index";
import sportsApi from "/@/api/menu/sports/sports";
import Common from "/@/utils/common";
import weakHint from "/@/hooks/weakHint";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
import { debounce, throttle, isEmpty } from "lodash-es";
import { useLoading } from "/@/directive/loading/hooks";
import left_arrow from "/@/assets/zh/default/menu/sports/left_arrow.gif";

import { useUserStore } from "/@/stores/modules/user";
const UserStore = useUserStore();
const { startLoading, stopLoading } = useLoading();
const ShopCatControlStore = useShopCatControlStore();

const { weakOpen, weakClose } = weakHint();

onMounted(() => {
	watch(
		() => UserStore.getUserInfo,
		(newValue, oldValue) => {
			/**判断用户信息为空是不进行加载Api */
			if (!isEmpty(newValue)) {
				getIndexInfo();
				getPublicSetting();
			}
		},
		{
			immediate: true,
		}
	);
});

const sportsBetEvent = useSportsBetEventStore();

/** 是否接受赔率变动  */
const isAccept = ref(false);
/** 单关接受赔率变动  */
const oddsOptionIsAccept = ref(false);
/** 串关接受赔率变动  */
const priceOptionIsAccept = ref(false);

/** 个人余额 */
const balance = ref();

/** 个人余额（显示） */
const balanceView = ref();
/**单下注 */
const singlePassRef = ref();
/** 多单下单 */
const moreShopRef = ref();
/*赔率是否发生了变化*/
const isChange = ref(false);
/*最高可赢*/
const maxWinnable: any = ref(0);
/*刷新余额状态*/
const isRefresh = ref(false);
/**  是否下单结束 */
const isOrdered = ref(false);
/** 按钮是否禁用中 */
const btnDisabled = ref(false);

/** 单关下注返回值 */
const singleOrder: any = ref({});
/** 串关下注返回值 */
const moreOrder: any = ref({});

/** 单关接受赔率变化状态 */
const oddsOption = computed(() => {
	return sportsBetEvent.getOddsOption;
});
/**串关赔率状态 */
const priceOption = computed(() => {
	return sportsBetEvent.getPriceOption;
});

watch(
	() => sportsBetEvent.sportsBetEventData.length,
	(newValue, oldValue) => {
		/**订单度发生变化时 （重置订单状态）*/
		isOrdered.value = false;
		nextTick(() => {
			handleScroll();
		});
		/** 长度小于0时 清除改动记录 */
		if (!newValue) {
			isChange.value = false;
		}
	}
);

const showArrow = ref(true);
const cardAllRef = ref(null);
/**
 * @description:判断下拉箭头是否显示
 */
const handleScroll = () => {
	const cardAll = cardAllRef.value;
	if (cardAll) {
		const childrenDome = cardAll.querySelector(".moreShop");
		// console.info(childrenDome.clientHeight, cardAll?.scrollHeight);
		/** 基础滚动高度计算 */
		const shouldShowArrow = childrenDome?.clientHeight > cardAll?.clientHeight || cardAll?.scrollHeight > cardAll?.clientHeight;
		/**未滚动到底部的高速  */
		const scrollH = cardAll?.scrollTop < cardAll?.scrollHeight - cardAll?.clientHeight;
		if (shouldShowArrow && scrollH) {
			showArrow.value = true;
		} else {
			showArrow.value = false;
		}
	}
};
/**
 * @description:点击箭头到底部
 */
const scrollToBottom = () => {
	const cardAll = cardAllRef.value;
	if (cardAll) {
		cardAll.scrollTop = cardAll.scrollHeight;
	}
};

/**
 * @description:单关-订单返回提交
 * @param {*} val
 * @return {*}
 */
const singleOrderConfirmation = (val: any) => {
	singleOrder.value = val;
	isOrdered.value = true;
};
/**
 * @description:串关-订单返回提交
 * @param {*} val
 * @return {*}
 */
const moreOrderConfirmation = (val: any) => {
	moreOrder.value = val;
	isOrdered.value = true;
};

/**
 * @description:下单完结(流程结束)
 * @return {*}
 */
const onOrderEnd = () => {
	isOrdered.value = false;
	sportsBetEvent.clearShopCart();
};
/**
 * @description: 改变订单状态；
 * @param {*} status
 * @return {*}
 */
const changeOrderStatus = (status: boolean) => {};

/**
 * @description:订单返回提交
 * @param {*} val
 * @return {*}
 */
const onKeepOrder = (val?: any) => {
	isOrdered.value = false;
};

/**
 * @description: 赔率变动
 * @return {*}
 */
const oddsChanges = () => {
	isChange.value = true;
};

/**
 * @description: 设置最大可赢额度
 * @param {*} val
 * @return {*}
 */
const setMaxWinnable = (val: number) => {
	maxWinnable.value = val;
};

/**
 * @description: 获取会员首页信息(获取 余额 )
 */
const getIndexInfo = debounce(async () => {
	const params = {};
	try {
		const res = await sportsApi.getIndexInfo(params);
		const { code, data } = res;
		isRefresh.value = false;
		if (code == Common.ResCode.SUCCESS) {
			/**  余额>9999999, 转k   */
			if (Number(data.balance) <= 9999999) {
				balanceView.value = data.balance;
			} else {
				balanceView.value = Common.formatAmount(Number(data.balance));
			}

			balance.value = Number(data.balance);
		}
	} catch (err) {
		isRefresh.value = false;
	}
}, 300);

/**
 * @description: 数据显示格式化（大于10位数时-显示带k）
 * @param {*} number
 * @return {*}
 */
const formatNumber = (number: number) => {
	if (number > 1e6) {
		return (number / 1e3).toFixed(2).toLocaleString() + "k";
	}
	return number.toFixed(2).toLocaleString();
};

onUpdated(() => {
	nextTick(() => {
		handleScroll();
	});
});

/*购物车隐藏时 关闭错误弹框*/
watch(
	() => ShopCatControlStore.getShopCatShow,
	(val) => {
		if (val) {
			nextTick(() => {
				weakClose && weakClose();
				handleScroll();
			});
		}
	}
);

/*自动接收更好的赔率复选框*/
const hintVisible = ref(false);

/**
 * @description: 单关关赔率变动赋值
 * @param {*} val
 * @return {*}
 */
const onOddsOptionIsAccept = (val: number) => {
	if (val == 2) {
		oddsOptionIsAccept.value = false;
		isAccept.value = false;
		if (sportsBetEvent.getOddsOptionMassge == 0) {
			hintVisible.value = true;
			sportsBetEvent.setOddsOptionMassge();
		}
	} else if (val == 1) {
		isAccept.value = true;
		oddsOptionIsAccept.value = true;
	}
	// sportsBetEvent.setOddsOption(val);
	sportsBetEvent.setOddsOption(1);
	saveSetting(oddsOptionIsAccept.value);
};
/**
 * @description: 串关赔率变动赋值
 * @param {*} val
 * @return {*}
 */
const onPriceOptionIsAccept = (val: number) => {
	// console.info("串关赔率变动赋值", priceOptionIsAccept.value);
	isAccept.value = !isAccept.value;
	sportsBetEvent.setPriceOption(1);
	saveSetting(isAccept.value);
};

/**
 * @description: 头部清空icon
 */
const click_clear = () => {
	ShopCatControlStore.setShopCatShow(false);
};

/**
 * @description: 刷新余额
 */
const refreshBalance = () => {
	isRefresh.value = true;
	getIndexInfo();
};

/**
 * @description: 进行投注事件激活
 */
const onBetting = throttle(
	async () => {
		// 单
		if (singlePassRef.value) {
			/**下注金额 */
			const stake = singlePassRef.value.stake || 0;
			if (!stake) {
				weakOpen("投注金额不能为空");
				return;
			}
			if (Number(stake) > Number(balance.value)) {
				return configDeposit();
			}
		}
		// 串
		if (moreShopRef.value) {
			/**下注金额 */
			const stake = moreShopRef.value.sunSubtotal || 0;
			if (!stake) {
				weakOpen("投注金额不能为空");
				return;
			}
			if (Number(stake) > Number(balance.value)) {
				return configDeposit();
			}
		}
		isChange.value = false;
		startLoading();
		if (singlePassRef.value) {
			await singlePassRef.value.PlaceBet();
		}
		if (moreShopRef.value) {
			await moreShopRef.value.PlaceParlayBet();
		}
		stopLoading();
		refreshBalance();
	},
	3000,
	{ trailing: false }
);

/**
 * @description: 配置存款(提示)；
 * @return {*}
 */
const configDeposit = () => {
	weakOpen("余额不足请充值");
};

/**
 * @description: 更改购物车显示状态
 * @return {*}
 */
const changeShopCart = () => {
	if (ShopCatControlStore.getShopCatShow) {
		ShopCatControlStore.setShopCatShow(false);
	} else {
		ShopCatControlStore.setShopCatShow(true);
	}
};
/**
 * @description:设置按钮是否是disabled状态
 * @return {*}
 */
const setDisabled = (val: boolean) => {
	btnDisabled.value = val;
};

/**
 * @description:  请求接受赔率状态信息
 * @return {*}
 */
const getPublicSetting = async () => {
	const { stopLoading } = useLoading();
	const sportsBetEvent = useSportsBetEventStore();
	const params = {
		type: "sport_odds",
	};
	const res = await sportsApi.getPublicSetting(params).catch((err) => err);
	if (res.code == Common.ResCode.SUCCESS) {
		stopLoading();
		if (res.data.length > 0) {
			const data = res.data[0];
			const optionIsAccept = data.value == "0" ? false : true;
			oddsOptionIsAccept.value = optionIsAccept;
			priceOptionIsAccept.value = optionIsAccept;
			/**设置单关赔率选中参数值 */
			if (optionIsAccept) {
				sportsBetEvent.setOddsOption(1);
			} else {
				sportsBetEvent.setOddsOption(2);
			}
		}
	}
};
/**
 * @description: 设置接受赔率状态信息
 * @param {*} optionIsAccept
 * @return {*}
 */
const saveSetting = async (optionIsAccept: boolean) => {
	const params = {
		type: "sport_odds",
		value: optionIsAccept ? 1 : 0,
	};
	const res = await sportsApi.saveSetting(params).catch((err) => err);
	if (res.code == Common.ResCode.SUCCESS) {
		getPublicSetting();
	}
};
</script>

<style scoped lang="scss">
.exceed {
	background: var(--icon);
}

.shopCart {
	width: 100%;
	min-height: 100%;
	box-sizing: border-box;
	//padding-bottom: 10px;

	background: var(--Bg1);
	color: var(--Text_s);
	.header-container {
		padding: 6px 15px 0 15px;

		& > div {
			padding: 9px 0;
		}

		.handler {
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid #373a40;

			.left {
				display: flex;
				align-items: center;
				gap: 5px;
				flex: 1;
				height: 100%;

				& > span:nth-of-type(2) {
					color: var(--Text1);
				}

				.num_total {
					width: 21px;
					height: 21px;
					display: flex;
					align-items: center;
					justify-content: center;
					background: var(--Theme);
					// color: themed('Text_a') !important;
					color: #fff !important;
					border-radius: 50%;
				}

				.icon {
					transition: 0.3s ease;
				}
			}

			.right {
				display: flex;
				align-items: center;
				gap: 8px;
				cursor: pointer;

				.sportsBetEventData {
					display: flex;
					align-items: center;
					padding: 5px 10px;
					border-radius: 99px;
					gap: 10px;

					background: var(--Bg3);
					color: var(--Theme);

					.stake {
						text-align: right;
						font-family: "DIN Alternate";
						font-size: 14px;
						font-style: normal;
						font-weight: 700;
						line-height: normal;
						color: var(--Text_s) !important;
					}
				}
			}
		}
	}

	.container-main {
		overflow-y: hidden;
		padding: 0 15px;
		margin-bottom: 10px;
	}

	.noData {
		padding: 18px 0;
		text-align: center;
		font-size: 14px;
		color: var(--Text1);
	}

	.bottom {
		padding: 0px 15px 15px;
		border-radius: 8px;
		margin: 5px 0;
		margin-top: 0;
		background: var(--Bg3);

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
.card-all {
	overflow: auto;
	max-height: 420px;
	position: relative;
	&::-webkit-scrollbar {
		display: none;
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

.el-checkbox {
	--el-checkbox-checked-text-color: var(--Text1);
	--el-checkbox-bg-color: var(--Bg3);
	--el-checkbox-checked-bg-color: var(--Bg3);
	/deep/ {
		.el-checkbox__inner {
			border-color: var(--Theme);

			&::after {
				border-color: var(--Theme);
				border-width: 2px;
			}
		}
	}
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
