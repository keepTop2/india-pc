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
					<span class="num_total" v-if="ChampionShopCartStore.outrightBetData.length">{{ ChampionShopCartStore.outrightBetData.length }}</span>
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
			<div class="noData" v-if="!ChampionShopCartStore.outrightBetData.length">
				<span> 请完成您的下注 </span>
			</div>
			<!-- 购物车 -->
			<div class="shop-plan" v-else>
				<div class="card-all">
					<!-- 单注 -->
					<SinglePass
						ref="singlePassRef"
						v-if="ChampionShopCartStore.outrightBetData.length == 1"
						:shopData="ChampionShopCartStore.outrightBetData[0]"
						:unusual="btnDisabled"
						:isAccept="isAccept"
						:balance="balance"
						@oddsChanges="oddsChanges"
						@maxWinnable="setMaxWinnable"
						@orderConfirmation="singleOrderConfirmation"
					/>
					<!-- 串关下注 -->
					<template v-if="ChampionShopCartStore.outrightBetData.length > 1">
						<MoreShop
							ref="moreShopRef"
							:sportsBetEventData="ChampionShopCartStore.outrightBetData"
							:unusual="btnDisabled"
							:combo="0"
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
				<div class="bottom">
					<div class="part1">
						<div class="auth">
							<el-checkbox v-model="isAccept" label="自动接受更好的赔率" @change="handleAuthChange" />
						</div>
						<planButton
							v-model:isAccept="isAccept"
							v-model:vendorTransId="vendorTransId"
							v-model:isChange="isChange"
							:maxWinnable="maxWinnable"
							@onBetting="onBetting"
							@setDisabled="setDisabled"
						></planButton>
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
			v-if="ChampionShopCartStore.outrightBetData.length == 1"
			:shopData="singleOrder?.shopData"
			:betInfo="singleOrder?.betInfo"
			:placeBetRes="singleOrder?.placeBetRes"
			:vendorTransId="singleOrder?.vendorTransId"
			@onOrderEnd="onOrderEnd"
		>
		</SingleOrderStatus>
		<!-- 串关投注返回结果 -->
		<MoreOrderStatus
			v-if="ChampionShopCartStore.outrightBetData.length > 1"
			:bettingMony="moreOrder?.bettingMony"
			:sportsBetEventData="moreOrder?.sportsBetEventData"
			:parlayTickets="moreOrder?.parlayTickets"
			:placeParlayRes="moreOrder?.placeParlayRes"
			:sunSubtotal="moreOrder?.sunSubtotal"
			:vendorTransId="moreOrder?.vendorTransId"
			@onOrderEnd="onOrderEnd"
			@onKeepOrder="onKeepOrder"
		>
		</MoreOrderStatus>
	</template>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from "vue";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { authHintDialog, cardStatus, MoreShop, planButton, SinglePass, SingleOrderStatus, MoreOrderStatus } from "./components/index";
import sportsApi from "/@/api/menu/sports/sports";
import Common from "/@/utils/common";
import weakHint from "/@/hooks/weakHint";
import { useChampionShopCartStore } from "/@/stores/modules/sports/championShopCart";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
import { debounce, throttle, isEmpty } from "lodash-es";
import { useLoading } from "/@/directive/loading/hooks";

import { i18n } from "/@/i18n/index";
import { Notification } from "/@/components/index";
import { useToLogin } from "/@/hooks/toLogin";
import { useUserStore } from "/@/stores/modules/user";

const UserStore = useUserStore();
const { toLogin } = useToLogin();
const $: any = i18n.global;
const { startLoading, stopLoading } = useLoading();
const ShopCatControlStore = useShopCatControlStore();
const ChampionShopCartStore = useChampionShopCartStore();



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
/** 订单id  */
const vendorTransId = ref("");
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

watch(
	() => ChampionShopCartStore.outrightBetData.length,
	(newValue, oldValue) => {
		/**订单度发生变化时 （重置订单状态）*/
		isOrdered.value = false;
	}
);
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
	ChampionShopCartStore.clearOutrightShopCart();
};

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

/*购物车隐藏时 关闭错误弹框*/
watch(
	() => ShopCatControlStore.getShopCatShow,
	(val) => {
		if (val) {
			weakClose && weakClose();
		}
	}
);

/*自动接收更好的赔率复选框*/
const hintVisible = ref(false);
/**
 * @description: 取消勾选 自动接收更高的赔率 触发的事件
 * @param val
 */
const handleAuthChange = (val: Boolean) => {
	if (!val) {
		hintVisible.value = true;
	}
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
const onBetting = debounce(async () => {
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
	/** 点击下注时才进形 商品单号获取 */
	await getBetOrderId();
	if (!vendorTransId.value) {
		stopLoading();
		weakOpen("订单号获取异常");
		return false;
	}
	/** 单关下注逻辑 */
	if (singlePassRef.value) {
		await singlePassRef.value.PlaceOutrightBet();
	}
	if (moreShopRef.value) {
		await moreShopRef.value.PlaceParlayBet();
	}
	stopLoading();
	refreshBalance();
}, 300);

/**
 * @description: 获获取沙巴体育注单ID(获取vendorTransId)
 */
const getBetOrderId = async () => {
	const params = {};
	const res = await sportsApi.getBetOrderId(params).catch((err) => {
		return err;
	});
	if (res == "ERR" || res == "Error") {
		//发布登陆弹窗事件
		Notification({
			title: $.t('gameList["提示"]'),
			content: $.t('common["请登陆后再进行操作"]'),
		});
		toLogin();
	} else {
		console.info(" 获获取沙巴体育注单ID(获取vendorTransId)", res);
		const { code, data } = res;
		if (code == Common.ResCode.SUCCESS) {
			vendorTransId.value = data;
		}
	}
};

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
			/**设置单关赔率选中参数值 */
			isAccept.value = optionIsAccept;
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
	@include themeify {
		background: themed("icon");
	}
}

.shopCart {
	width: 100%;
	min-height: 100%;
	box-sizing: border-box;
	//padding-bottom: 10px;

	@include themeify {
		background: themed("Bg1");
		color: themed("Text_s");
	}

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
					@include themeify {
						color: themed("Text1");
					}
				}

				.num_total {
					width: 21px;
					height: 21px;
					display: flex;
					align-items: center;
					justify-content: center;
					background: themed("Theme");
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

					@include themeify {
						background: themed("Bg3");
						color: themed("Theme");
					}

					.stake {
						text-align: right;
						font-family: "DIN Alternate";
						font-size: 14px;
						font-style: normal;
						font-weight: 700;
						line-height: normal;
						@include themeify {
							color: themed("Text_s") !important;
						}
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

		@include themeify {
			color: themed("Text1");
		}
	}

	.bottom {
		padding: 0px 15px 15px;
		border-radius: 8px;
		margin: 5px 0;
		margin-top: 0;

		@include themeify {
			background: themed("Bg3");
		}

		.part2 {
			margin: 5px 0;
			padding-top: 15px;

			.el-button {
				margin: 5px 0;
			}

			.confirming {
				& > .el-button:last-child {
					@include themeify {
						border: 1px solid themed("Theme");
						background: themed("Bg3");
						color: themed("Theme");
					}
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
	@include themeify {
		--el-checkbox-checked-text-color: themed("Text1");
		--el-checkbox-bg-color: themed("Bg3");
		--el-checkbox-checked-bg-color: themed("Bg3");
	}

	:deep() {
		.el-checkbox__inner {
			@include themeify {
				border-color: themed(Theme);
			}

			&::after {
				border-color: themed(Theme);
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
