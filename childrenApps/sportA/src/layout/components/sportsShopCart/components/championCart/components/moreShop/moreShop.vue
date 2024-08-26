<!--
 * @Author: WangMingxin
 * @Description: 体育-购物车- 多个单下注输入框
-->
<template>
	<div class="moreShop">
		<div class="commodity">
			<!--商品卡片-->
			<ShopCard v-for="(item, index) in sportsBetEventData" :key="index" :shopData="item" :hasClose="true" />
		</div>
		<div class="money-plan">
			<!-- 金额输入 -->
			<Crosstalk
				ref="CrosstalkRefs"
				v-for="(item, index) in parlayTickets?.combos"
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
import { computed, onMounted, ref, watch } from "vue";
import { cloneDeep } from "lodash-es";
import sportsApi from "/@/api/menu/sports/sports";
import Common from "/@/utils/common";
import { Crosstalk } from "./components/index";
import { ShopCard } from "../index";
import weakHint from "/@/hooks/weakHint";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";

const { weakOpen, weakClose } = weakHint();
/** maxWinnable 最高可赢     oddsChanges赔率变动   */
const emit = defineEmits(["maxWinnable", "oddsChanges", "orderConfirmation", "onKeepOrder"]);
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
/** 所有下注额度组件 */
const CrosstalkRefs = ref([]);

/** 取得串关注单的相关信息 */
const parlayTickets = ref();
// watch(
// 	() => props.sportsBetEventData,
// 	(newValue, oldValue) => {
// 		/** 监听数据变动 随时获取注单信息 */
// 		GetParlayTickets();
// 	},
// 	{
// 		deep: true,
// 	}
// );
onMounted(() => {
	GetParlayTickets();
	/**可赢金额归0 */
	emit("maxWinnable", 0);
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
	// /**数据异常不在执行 数据查询 */
	// if (props.unusual || props.combo > props.sportsBetEventData.length) {
	// 	return false;
	// }
	// const params = {
	// 	/**  串关注单相关信息 */
	// 	parlayTickets: getBettingInformation(),
	// };
	// const res = await sportsApi.GetParlayTickets(params);
	// const { status, data } = res;
	// parlayTickets.value = data;
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
	CrosstalkRefs?.value &&
		CrosstalkRefs?.value?.forEach((domeRef) => {
			const params = (domeRef as any).params;
			if (params.stake) {
				newArr.push(params);
			}
		});
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

/**
 * @description: 多单-注单的下注
 */
const PlaceParlayBet = async () => {
	await GetParlayTickets();
	// const combosList = getBetAmountInformation();

	// bettingMony.value = combosList;
	// if (!combosList || !combosList.length) {
	// 	weakOpen("请输入下注金额");
	// 	return false;
	// }
	// const params = {
	// 	/**厂商注单号码 */
	// 	vendorTransId: props.vendorTransId,
	// 	/**下注选项 0：不接受盘口变更 (预设) ; 1：接受任何赔率 */
	// 	priceOption: 1,
	// 	/**注单相关信息 */
	// 	tickets: getPriceInfo(),
	// 	/** 串关赛事相关信息 */
	// 	combos: combosList,
	// };
	// betInfo.value = params;
	// try {
	// 	const res = await sportsApi.PlaceParlayBet(params);
	// 	const { status, data } = res;
	// 	if (data.betStatus === 0) {
	// 		placeParlayRes.value = data;
	// 	} else {
	// 	}
	// 	onOrderConfirmation();
	// } catch (e) {
	// 	weakOpen("服务器异常");
	// }
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
		// vendorTransId: props.vendorTransId,
	};
	emit("orderConfirmation", params);
};

defineExpose({
	/**多单-注单的下注 */
	PlaceParlayBet,
	/** 总下单金额 */
	sunSubtotal,
});
</script>

<style scoped lang="scss"></style>
