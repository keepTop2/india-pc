<!--
 * @Author: WangMingxin
 * @Description: 体育赛事详细;
-->
<template>
	<div class="competition">
		<spinner-wrap :model-value="loading" :top="200">
			<HeaderDetail
				v-if="!isEmpty(eventDetail)"
				@filter="filterData"
				:sportInfo="eventDetail"
				:loading="loading"
				@refresh="refresh"
				:expandAndCollapse="expandAndCollapse"
				@toggleAll="toggleAllDisplay"
			></HeaderDetail>
			<div class="competition_two">
				<div class="box_team" v-if="eventDetail?.markets !== ''">
					<MarketItem :markets="markets" />
				</div>
				<div class="nonedata" v-else>
					<NoneData></NoneData>
				</div>
			</div>
		</spinner-wrap>
	</div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch, watchEffect } from "vue";
import { isEmpty } from "lodash-es";
import { SpinnerWrap } from "/@/components/Spinner";
import pubSub from "/@/pubSub/pubSub";
import { Sports, SportViewData } from "/@/views/sports/models/interface";
import { useRoute } from "vue-router";
import MarketColumn from "./components/marketColumn/marketColumn.vue";
import HeaderDetail from "./components/headerDetail/headerDetail.vue";
import { SportViewModels } from "/@/views/sports/models/sportViewModels";
import useSportPubSubEvents from "/@/views/sports/hooks/useSportPubSubEvents";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import { openSingleSportEventSource } from "/@/views/sports/utils/sseServe";
import { formattingSportArrayData, sortMarks } from "/@/views/sports/utils/formattingViewData";
import SportsCommonFn from "/@/views/sports/utils/common";
import { useSportsInfoStore } from "/@/stores/modules/sports/sportsInfo";
import { WebToPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { OpenSportEventSourceParams } from "/@/views/sports/models/sportEventSourceModel";
import { convertUtcToUtc5AndFormatMD, convertUtcToUtc5AndFormat } from "/@/webWorker/module/utils/formattingChildrenViewData";
import { SportViewProcessWorkerCommandType, WorkerName } from "/@/enum/workerTransferEnum";
import { sportsEventDetailPush } from "/@/views/sports/utils/sportsMap/sportsSSERequestMap";
import sportsApi from "/@/api/sports/sports";
import workerManage from "/@/webWorker/workerManage";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import { useUserStore } from "/@/stores/modules/user";
import MarketItem from "./marketItem/marketItem.vue";
const UserStore = useUserStore();
const { initSportPubsub, unSubSport, clearState, sportsLogin, clearSportsOddsChange } = useSportPubSubEvents();
const SportsInfoStore = useSportsInfoStore();
const SportAttentionStore = useSportAttentionStore();
const sportsInfoStore = useSportsInfoStore();
const sportsBetEvent = useSportsBetEventStore();
const route = useRoute();

const loading = ref(false);
const { sportType } = route.params;

//根据sportType从state中获取events列表 用于展示该联赛下的所有赛事
const eventsList = computed(() => {
	// console.log(viewSportPubSubEventData.viewSportData, "==viewSportPubSubEventData.viewSportData.childrenViewData");
	return viewSportPubSubEventData.viewSportData.childrenViewData[Number(sportType)]?.[0]?.events;
});

//根据路由eventId 匹配对应的 event数据 展示详细数据
const eventDetail = computed(() => {
	const { leagueId, eventId } = route.query;
	const events = eventsList.value;
	// console.log(events, "====events");
	return events?.filter((item) => item.eventId == eventId)[0];
});

//获取盘口数据
const markets = computed(() => {
	// console.log("eventDetail", eventDetail.value);
	let marketData: any = [];
	if (eventDetail.value) {
		const markets = eventDetail.value?.markets;
		for (const key in markets) {
			const market = markets[key];
			const { betTypeName, marketId, betType } = market;
			// 在 marketData 中查找是否已存在相同 betTypeName 的数据
			const existingMarketData = marketData.find((data) => data.betTypeName === betTypeName);
			if (existingMarketData) {
				// 如果已存在，则将当前市场对象添加到现有数据的 markets 数组中
				existingMarketData.markets[key] = market;
			} else {
				// 如果不存在，则创建新的数据对象并将当前市场对象添加到其 markets 数组中
				const newData: any = {
					betTypeName: betTypeName,
					marketId: marketId,
					betType: betType,
					markets: {
						[key]: market,
					},
				};
				marketData.push(newData);
			}
		}
	}
	marketData.sort((a, b) => {
		if (a.betType === b.betType) {
			return a.marketId - b.marketId;
		}
		return a.betType - b.betType;
	});
	// console.log(marketData);

	return marketData;
});

const state = reactive({
	filtrateBetType: 0 as number,
});

onBeforeMount(() => {
	//初始化体育
	initSport();
});

/**
 * @description 赔率发生变化后 3秒动画 清理掉oddsChange状态
 */

const oddsChange = (obj: any) => {};
const filterData = (filterItem: number) => {
	state.filtrateBetType = filterItem;
};
const initSport = async () => {
	//开启体育线程
	// workerManage.startWorker(workerManage.WorkerMap.sportViewProcessWorker.workerName);
	//体育登录
	sportsLogin().then((res) => {
		if (res) {
			initSportPubsub();
			openEventDetailPush();
			// if (UserStore.token) {
			// 	// 开始轮询登录接口
			// 	startPolling();
			// }
		}
	});
};

const emit = defineEmits(["expandAndCollapse"]);
const showMarkets = ref<Array<boolean>>([]);

watchEffect(() => {
	if (markets.value) {
		showMarkets.value = Array(markets.value.length).fill(false);
	}
});
// watch(
// 	markets,
// 	(newValue) => {
// 		if (newValue) {
// 			showMarkets.value = Array(newValue.length).fill(false);
// 		}
// 	},
// 	{ once: true }
// );

const expandAndCollapse = ref(false);
/**
 * @description 折叠 展开
 */
const toggleAllDisplay = () => {
	expandAndCollapse.value = !expandAndCollapse.value;
	showMarkets.value = markets.value.map(() => !expandAndCollapse.value);
};

const toggleDisplay = (index: number) => {
	showMarkets.value[index] = !showMarkets.value[index];

	// 检查是否所有项都折叠或展开
	if (showMarkets.value.some((item) => !item)) {
		expandAndCollapse.value = true;
	} else {
		expandAndCollapse.value = false;
	}

	emit("expandAndCollapse", expandAndCollapse.value);
};

const refresh = () => {
	loading.value = true;
	initSport();
};

// 注册一个钩子，在组件实例被卸载之前调用。
onBeforeUnmount(() => {
	closeSportsSSE();
});

const closeSportsSSE = () => {
	//关掉体育视图线程
	workerManage.stopWorker(workerManage.WorkerMap.sportViewProcessWorker.workerName);
	// 卸载体育
	unSubSport();
	clearState();
};
const openSSE = () => {
	//开启体育线程
	workerManage.startWorker(workerManage.WorkerMap.sportViewProcessWorker.workerName);
};
/**
 * @description 开启赛事详情推送
 */
const openEventDetailPush = async () => {
	const { leagueId, eventId } = route.query;

	//线程名称 体育视图处理线程
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.workerName = WorkerName.sportViewProcessWorker;
	//线程指令 体育eventSource 指令
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.commandType = SportViewProcessWorkerCommandType.sportEventSource;

	const params = {
		apiUrl: SportsCommonFn.getSportPushApiUrl(),
		token: sportsInfoStore.getSportsToken,
		language: SportsCommonFn.getSportLanguage(),
	};
	/**
	 * @description 先获取盘口数据，再获取events 防止匹配数据错乱
	 */
	//清空参数
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = {} as OpenSportEventSourceParams;
	//参数赋值
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, sportsEventDetailPush.openMarkets(eventId), params);
	//发送SSE指令到线程管理器
	pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);

	//清空参数
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = {} as OpenSportEventSourceParams;
	//参数赋值
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, sportsEventDetailPush.openEvents(leagueId), params);
	//发送SSE指令到线程管理器
	pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);
};
</script>
<style scoped lang="scss">
.oddsUp {
	color: var(--Theme) !important;
}
.oddsDown {
	color: var(--Success) !important;
}
.competition {
	display: flex;
	flex-direction: column;
	min-height: 400px;
	overflow-y: auto;
	height: calc(100vh - 155px);
}
.competition::-webkit-scrollbar {
	display: none;
}
.header-plan {
	height: 300px;
	background: #4d515c;
	overflow: scroll;
}
.competition_two {
	.box_team {
		.team {
			width: 100%;
			margin: 6px 0 8px 0;
			border-radius: 8px 8px 0px 0px;
			background: var(--Bg1-1, #24262b);
			box-shadow: 0px 1px 0px 0px var(--Bg1-1, #24262b) inset;
			.record {
				display: flex;
				align-items: center;
				padding: 12px 0;
				.record_one {
					width: 4px;
					height: 22px;
					border-radius: 0px 4px 4px 0px;
					background: var(--Theme, #3bc116);
					margin-right: 12px;
				}
				.record_two {
					color: var(--Text1-1, #98a7b5);
					font-family: "PingFang SC";
					font-size: 16px;
					font-style: normal;
					font-weight: 400;
					line-height: normal;
				}
			}
		}
	}
	.nonedata {
		margin-top: 20%;
	}
}
</style>
