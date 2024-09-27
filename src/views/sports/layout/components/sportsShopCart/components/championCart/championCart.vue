<template>
	<div class="shopCart" v-if="!isOrdered">
		<div class="header-container" @click="changeShopCart">
			<div class="left">
				<span>投注单</span>
				<span class="num_total" v-if="ChampionShopCartStore.outrightBetData.length">{{ ChampionShopCartStore.outrightBetData.length }}</span>
				<span class="arrow"><svg-icon name="sports-arrow_card_header" width="12px" height="8px"></svg-icon></span>
			</div>
			<div class="right">
				<div class="sportsBetEventData" @click.stop="refreshBalance">
					<!-- 余额 -->
					<span class="stake">{{ balanceView }}</span>
					<span class="refresh_icon" :class="{ rotateAn: isRefresh }"><svg-icon name="sports-refresh" size="18px"></svg-icon></span>
				</div>
				<span v-if="ShopCatControlStore.getShopCatShow" class="close_icon" @click.stop="click_clear"><svg-icon name="sports-close" size="30px"></svg-icon></span>
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
							<span class="checkbox" @click="handleAuthChange">
								<span class="icon"><svg-icon :name="isAccept ? 'sports-checkbox' : 'sports-checkbox_active'" size="18px"></svg-icon></span>
								<span class="label">自动接受较优赔率</span>
							</span>
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
import sportsApi from "/@/api/sports/sports";
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
			console.log("触发了冠军购物车的业务？？？？？");

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
}

.card-all {
	display: grid;
	gap: 6px;
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
