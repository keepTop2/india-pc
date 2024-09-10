<!--
 * @Author: WangMingxin
 * @Description: 体育-购物车- 多个单下注输入框
-->
<template>
	<div class="moreShop" ref="moreShopRef">
		<div class="commodity">
			<!--商品卡片-->
			<ShopCard
				v-for="(item, index) in sportsBetEventData"
				:key="index"
				:shopData="item"
				:hasClose="true"
				:isAccept="isAccept"
				:singleTicket="PriceInfo[item.betMarketInfo?.marketId]"
				@oddsChanges="oddsChanges"
				@marketChange="marketChange"
			/>
		</div>
		<div class="money-plan">
			<!-- 金额输入 -->
			<Crosstalk
				ref="CrosstalkRefs"
				v-for="(item, index) in combosInfos"
				:key="index"
				:balance="balance"
				:comboInfo="item"
				@onInputChange="onInputChange"
				@oddsChanges="oddsChanges"
			/>
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch, nextTick, onUnmounted } from "vue";
import { debounce, throttle, cloneDeep, isEmpty, forEach } from "lodash-es";
import sportsApi from "/@/api/sports/sports";
import Common from "/@/utils/common";
import { Crosstalk } from "./components/index";
import { ShopCard } from "../index";
import weakHint from "/@/hooks/weakHint";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";

import { i18n } from "/@/i18n/index";
import { Notification } from "/@/components/index";
import { useToLogin } from "/@/hooks/toLogin";
const { toLogin } = useToLogin();
const $: any = i18n.global;
const { weakOpen, weakClose } = weakHint();
/** maxWinnable 最高可赢     oddsChanges赔率变动   */
const emit = defineEmits(["maxWinnable", "oddsChanges", "orderConfirmation", "onKeepOrder", "handleScroll"]);
const sportsBetEvent = useSportsBetEventStore();
const props = withDefaults(
	defineProps<{
		/** 选中的商品数据集合 */
		sportsBetEventData?: Array<any>;
		/** 判断购物车数据是否异常 */
		unusual?: boolean;
		// vendorTransId?: string;
		combo?: number;
		/** 接受赔率变动  */
		isAccept?: boolean;
		/**账户余额 */
		balance?: number;
	}>(),
	{
		combo: 0,
		// vendorTransId: "",
		/** 判断购物车数据是否异常 */
		unusual: false,
		balance: 0,
		sportsBetEventData: () => {
			return [];
		},
	}
);
/**外层容器 */
const moreShopRef = ref(null);

const changeDome = throttle(() => {
	emit("handleScroll");
}, 300);
//监听div大小改变；
// const resizeObserver = new ResizeObserver((entries) => {
// 	for (const entry of entries) {
// 		changeDome();
// 	}
// });

/** 所有下注额度组件 */
const CrosstalkRefs = ref([]);

/** 取得串关注单的相关信息 */
const parlayTickets = ref({});

/** 获取参数值是否有错误标志  */
const getValueErrorTag = ref();

/** 赔率信息  */
const combosInfos = ref([]);
/** 赔率信息  */
const PriceInfo = ref({});

watch(
	() => parlayTickets.value,
	(newValue, oldValue) => {
		if (!isEmpty(newValue)) {
			if (parlayTickets.value?.combos.length) {
				combosInfos.value = parlayTickets.value?.combos;
				// console.info("串关", combosInfos.value);
				changeDome();
			}
			if (parlayTickets.value?.priceInfo.length) {
				const priceInfoList = parlayTickets.value?.priceInfo;
				let obj = {};
				for (let i = 0; i < priceInfoList.length; i++) {
					const e = priceInfoList[i];
					obj[priceInfoList[i].marketId] = priceInfoList[i];
				}
				PriceInfo.value = obj;
			}
		}
	}
);

watch(
	() => props.sportsBetEventData,
	(newValue, oldValue) => {
		/** 监听数据变动 随时获取注单信息 */
		GetParlayTicketsThrottle();
		// GetParlayTickets();
	},
	{
		deep: true,
	}
);

watch(
	() => props.sportsBetEventData.length,
	(newValue, oldValue) => {
		if (newValue != oldValue) {
			/**监听数据长度 改变时重置 串关赔率数据 */
			combosInfos.value = [];
			GetParlayTickets();
		}
	},
	{
		deep: true,
	}
);

onMounted(() => {
	GetParlayTickets();
	/**可赢金额归0 */
	emit("maxWinnable", 0);
	nextTick(() => {
		changeDome();
	});

	// resizeObserver.observe(moreShopRef.value as any);
});

onUnmounted(() => {
	try {
		// resizeObserver.unobserve(moreShopRef.value as any);
	} catch (error) {}
});

/**
 * @description: 赔率变动激活
 * @param {*} val
 */
const oddsChanges = (val: boolean) => {
	emit("oddsChanges", val);
};

/**
 * @description: 获取 更新单注的盘口数据
 */
const GetParlayTickets = async () => {
	/**数据异常不在执行 数据查询 */
	// if (props.unusual || props.combo > props.sportsBetEventData.length) {
	if (props.combo > props.sportsBetEventData.length) {
		return false;
	}
	const params = {
		/**  串关注单相关信息 */
		parlayTickets: getBettingInformation(),
	};
	const res = await sportsApi.GetParlayTickets(params).catch((err) => {
		return err;
	});
	const { status, data } = res;
	if (status == 200) {
		/** 串关关联成功时移除关闭的 MarketId */
		sportsBetEvent.setCloseMarketIds([]);
		/**设置不同球内的MarketId */
		sportsBetEvent.setDifferentBetTypeMarketIds([]);
		/**设置禁止投注的MarketId */
		sportsBetEvent.setNobetsMarketIds([]);
		/** 设置非串关MarketId */
		sportsBetEvent.setUnSeriesMarketIds([]);
		parlayTickets.value = data;
		onInputChange();
	} else {
		const { response } = res;
		const { status, data } = response;
		if (status == 400 && !isEmpty(data)) {
			const errCode = ["B005", "B015", "B016", "B033", "B039"];
			if (errCode.indexOf(data.errorCode) != -1) {
				marketClosingErrors(data);
			} else if (data.errorCode == "B036") {
			} else if (data.errorCode == "B014") {
				weakOpen("投注金额超出最大限额");
			} else {
				weakOpen("服务器异常");
			}
		}
	}
};
const GetParlayTicketsThrottle = throttle(GetParlayTickets, 300, { trailing: false });
/**
 * @description: 处理串关轮训注单信息盘口关闭的错误状态
 * @param {*} errInfo
 * @return {*}
 */
const marketClosingErrors = (errInfo) => {
	const errorCode = errInfo?.errorCode;
	if (errInfo.errorCode == "B039") {
		/**取出不不同球类标识 */
		const marketIds: any = [];
		// 获取marketId
		errInfo.details?.getParlayTickets.combos.forEach((combo) => {
			combo.abnormalMarketList.forEach((abnormalMarket) => {
				const { marketId } = abnormalMarket;
				if (!marketIds.includes(marketId.toString())) {
					marketIds.push(marketId.toString());
				}
			});
		});
		/**设置不同球内的MarketId */
		sportsBetEvent.setDifferentBetTypeMarketIds(marketIds);

		// 过滤出stateCode不等于0   //不支持投注market
		const filteredPriceInfo = errInfo.details.getParlayTickets.priceInfo.filter((price) => price.stateCode != 0);
		/**设置禁止投注的MarketId */
		sportsBetEvent.setNobetsMarketIds(filteredPriceInfo);
	} else if (errInfo.errorCode == "B033") {
		const regex = /Parlay Same Event ; MarketIds : (.+)/;
		// 匹配ids
		const match = errInfo.message.match(regex);
		// 组装ids
		const ids = match ? match[1].split(" ") : [];

		/**设置非串关MarketId */
		sportsBetEvent.setUnSeriesMarketIds(ids);
	} else {
		// 需要判断关闭的错误信息
		const regexes = [
			{ errorCode: "B005", regex: /Event Closed or Invalid Market ; Market ID (.+)/ },
			{ errorCode: "B015", regex: /Market ID (.+?): Close price/ },
			{ errorCode: "B016", regex: /Market ID (.+?): Market closed/ },
			// { errorCode: "B033", regex: /Parlay Same Event ; MarketIds : (.+)/ },
		];
		// 判断错误码
		regexes.forEach(({ errorCode, regex }) => {
			if (errInfo.errorCode == errorCode) {
				// 匹配ids
				const match = errInfo.message.match(regex);
				// 组装ids
				const ids = match ? match[1].split(" ") : [];
				/**设置关闭的MarketId */
				sportsBetEvent.setCloseMarketIds(ids);
			}
		});
	}
};

/** 预计可赢额度 */
const maxWin = ref(0);
/** 总下单金额 */
const sunSubtotal = ref(0);
/**
 * @description: 子组件输入值时变动
 * @return {*}
 */

const onInputChange = () => {
	const newArr = [] as any;
	const subtotalArr = [] as any;
	CrosstalkRefs?.value &&
		CrosstalkRefs?.value?.forEach((domeRef) => {
			const total = (domeRef as any).total;
			if (total) {
				newArr.push(total);
				/** 小记额度 */
				const subtotal = (domeRef as any).subtotal;
				subtotalArr.push(subtotal);
			}
		});

	const sum = newArr.reduce((lator: number, current: number) => {
		return Common.add(lator, current);
	}, 0);
	/** 小记总额度计算 */
	const sumSub = subtotalArr.reduce((lator: number, current: number) => {
		return Common.add(lator, current);
	}, 0);

	maxWin.value = sum;

	sunSubtotal.value = sumSub;

	if (maxWin.value) {
		/** 直接计算可赢额度 */
		emit("maxWinnable", Common.formatFloat(sum));
	} else {
		emit("maxWinnable", 0);
	}
};

/**  获取赛事盘口投注信息 */
const getBettingInformation = () => {
	const newArr = [] as any;
	props.sportsBetEventData.forEach((item) => {
		const obj = {
			sportType: item.sportType,
			marketId: item.betMarketInfo.marketId,
			point: item.betMarketInfo.point ? item.betMarketInfo.point : 0,
			key: item.betMarketInfo.key,
		};
		newArr.push(obj);
	});
	return newArr;
};

/**  获取下注额度信息 */
const getBetAmountInformation = () => {
	const newArr = [] as any;
	try {
		getValueErrorTag.value = false;
		CrosstalkRefs?.value &&
			CrosstalkRefs?.value?.forEach((domeRef) => {
				const params = (domeRef as any).getParams();
				if (params) {
					if (params.stake) {
						newArr.push(params);
					}
				} else {
					getValueErrorTag.value = true;
					throw new Error();
				}
			});
	} catch (error) {}
	return newArr;
};
/**  获取盘口赔率相关信息*/
const getPriceInfo = () => {
	const newArr = [] as any;
	parlayTickets.value.priceInfo.forEach((v: any) => {
		const obj = {
			sportType: v.sportType,
			marketId: v.marketId,
			point: v.point,
			key: v.key,
			price: v.currentPrice,
		};
		newArr.push(obj);
	});
	return newArr;
};
/** 下注相关信息 */
const betInfo = ref({});
/**所有下注额度 */
const bettingMony = ref([]);

/** 下单成功返回对象 */
const placeParlayRes = ref({});
/** 订单id  */
const vendorTransId = ref("");
/**
 * @description: 多单-注单的下注
 */
const PlaceParlayBet = async () => {
	const combosList = getBetAmountInformation();
	if (getValueErrorTag.value) {
		// weakOpen("请输入正确金额");
		return false;
	}
	bettingMony.value = combosList;
	if (!combosList || !combosList.length) {
		weakOpen("请输入下注金额");
		return false;
	}

	/** 点击下注时才进形 商品单号获取 */
	await getBetOrderId();
	if (!vendorTransId.value) {
		weakOpen("订单号获取异常");
		return false;
	}
	await GetParlayTickets();
	const params = {
		/**厂商注单号码 */
		vendorTransId: vendorTransId.value,
		/**下注选项 0：不接受盘口变更 (预设) ; 1：接受任何赔率 */
		priceOption: sportsBetEvent.getPriceOption,
		/**注单相关信息 */
		tickets: getPriceInfo(),
		/** 串关赛事相关信息 */
		combos: combosList,
	};
	betInfo.value = params;
	try {
		const res = await sportsApi.PlaceParlayBet(params).catch((err) => {
			return err;
		});
		const { status, data } = res;
		if (status == 200) {
			placeParlayRes.value = data;
			onOrderConfirmation();
		} else {
			const { response } = res;
			const { status, data } = response;
			if (status == 400 && !isEmpty(data)) {
				const errCode = ["B038"];
				if (errCode.indexOf(data.errorCode) != -1) {
					weakOpen("超过最大赢取金额");
				} else {
					weakOpen("服务器异常");
				}
			}
		}
	} catch (e) {
		weakOpen("服务器异常");
	}
};

/**
 * @description: 订单提交后-进入确认订单
 */
const onOrderConfirmation = () => {
	const params = {
		/**所有下注额度 */
		bettingMony: bettingMony.value,
		/** 当前购物车数据 */
		sportsBetEventData: cloneDeep(props.sportsBetEventData),
		/** 取得串关注单的相关信息 */
		parlayTickets: parlayTickets.value,
		/** 下单成功返回对象 */
		placeParlayRes: placeParlayRes.value,
		/** 最高可赢额度 */
		sunSubtotal: sunSubtotal.value,
		/** 系统订单号 */
		vendorTransId: vendorTransId.value,
	};

	emit("orderConfirmation", params);
};

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
 * @description: 盘口改变
 * @return {*}
 */
const marketChange = () => {
	try {
		CrosstalkRefs?.value &&
			CrosstalkRefs?.value?.forEach((domeRef) => {
				const params = (domeRef as any).marketChange();
			});
	} catch (error) {}
};

defineExpose({
	/**多单-注单的下注 */
	PlaceParlayBet,
	/** 总下单金额 */
	sunSubtotal,
});
</script>

<style scoped lang="scss">
.commodity,
.money-plan {
	display: grid;
	gap: 6px;
}

.money-plan {
	margin-top: 6px;
}
</style>
