<!--
 * @Author: WangMingxin
 * @Description: 体育赛事详细;
-->
<template>
	<div class="competition">
		<spinner-wrap :model-value="loading" :top="200">
			<HeaderDetail
				v-if="!isEmpty(state.targetEvent)"
				@filter="filterData"
				:sportInfo="state.targetEvent"
				:loading="loading"
				@refresh="refresh"
				:expandAndCollapse="expandAndCollapse"
				@toggleAll="toggleAllDisplay"
			></HeaderDetail>
			<div class="competition_two">
				<div class="box_team" v-if="state.targetEvent?.markets !== ''">
					<div v-for="(item, index) in markets" :key="index">
						<div class="team" v-if="state.filtrateBetType === 0 || state.filtrateBetType === item.betType">
							<div class="record" @click="toggleDisplay(index)">
								<div class="record_one"></div>
								<div class="record_two">{{ item.betTypeName }}</div>
							</div>
							<div class="team_one">
								<template v-for="(citem, cIndex) in item.markets" :key="cIndex">
									<MarketColumn
										:displayContent="!showMarkets[index]"
										cardType="none"
										:sportInfo="state.targetEvent"
										:market="citem"
										:betType="citem.betType"
										@oddsChange="oddsChange"
									></MarketColumn>
								</template>
							</div>
						</div>
					</div>
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
import { MarketColumn, HeaderDetail } from "./components/index";
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
import { sportsEventDetailPush } from "/@/views/sports/utils//sportsMap/sportsSSERequestMap";
import sportsApi from "/@/api/sports/sports";
import workerManage from "/@/webWorker/workerManage";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import { useUserStore } from "/@/stores/modules/user";
const UserStore = useUserStore();
const { initSportPubsub, unSubSport, clearState, sportsLogin, clearSportsOddsChange } = useSportPubSubEvents();
const SportsInfoStore = useSportsInfoStore();
const SportAttentionStore = useSportAttentionStore();
const sportsInfoStore = useSportsInfoStore();
const sportsBetEvent = useSportsBetEventStore();
const route = useRoute();

const loading = ref(false);
/** 单数据序列数据 ； */
// const state.targetEvent = ref({});
const sportSource = ref();
const recode = reactive({
	event: {},
	events: [],
	markets: [],
});
const state = reactive({
	/**
	 * @description Sports视图数据
	 */
	viewSportData: {
		/**
		 * @description 外层Sports组件视图数据
		 */
		sports: [] as Sports[],
		leagues: [],
		events: [],
		markets: [],
		outrights: [],
		results: [],
		/**
		 * @description 各个子路由视图数据
		 */
		childrenViewData: {},
	} as SportViewData,
	targetEvents: [], // 添加这个字段来保存目标事件数据数组
	/**单个eventId 对应的 体育对象 */
	targetEvent: {} as any,
	finalObject: {} as any,
	filtrateBetType: 0 as number,
});

onBeforeMount(() => {
	clearState();
});
onMounted(() => {
	//发布初始化数据事件
	pubSub.publish(pubSub.PubSubEvents.SportEvents.initChildrenView.eventName, {});
	//获取关注列表
	getAttention();
	//初始化体育
	initSport();
});
// onBeforeMount(() => {
// 	//发布初始化数据事件
// 	pubSub.publish(pubSub.PubSubEvents.SportEvents.initChildrenView.eventName, {});
// 	//获取关注列表
// 	getAttention();
// 	//初始化体育
// 	initSport();
// });
/** 只注重过程不在意结果的数据 响应获取  */
watchEffect(() => {
	/** 最新数据响应接入  */
	state.targetEvents = viewSportPubSubEventData.getSportData(4);
	// console.info("最新数据响应接入", state.targetEvents);
	if (state.targetEvents?.length) {
		//单个数据详细值临时获取方式
		state.targetEvent = state?.targetEvents[0]?.events[0];
	}
});

//获取盘口数据
const markets = computed(() => {
	return sortMarks(state.targetEvent);
});

/**
 * @description 赔率发生变化后 3秒动画 清理掉oddsChange状态
 */

const oddsChange = (obj: any) => {};
const filterData = (filterItem: number) => {
	state.filtrateBetType = filterItem;
};
/**
 * @description 获取关注列表
 */
const getAttention = async () => {
	if (!isEmpty(UserStore.getUserInfo)) {
		const res = await sportsApi.getAttentionList();
		const list = res.data;
		SportAttentionStore.setAttentionList(list);
	}
};
const initSport = async () => {
	//体育登录
	sportsLogin().then(async () => {
		initSportPubsub();
		await openEventDetailPush();
		loading.value = false;
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
	// closeSportsSSE();
});
const closeSSE = () => {
	try {
		//关掉体育视图线程
		workerManage.stopWorker(workerManage.WorkerMap.sportViewProcessWorker.workerName);
	} catch (error) {}
};
const openSSE = () => {
	closeSSE();
	//开启体育线程
	workerManage.startWorker(workerManage.WorkerMap.sportViewProcessWorker.workerName);
};
const closeSportsSSE = () => {
	// closeSSE();
	// 卸载体育
	unSubSport();
	clearState();
};

/**
 * @description 开启赛事详情推送
 */
const openEventDetailPush = async () => {
	openSSE();
	const { leagueId, eventId } = route.query;
	console.info("开启赛事详情推送", leagueId, eventId);
	//线程名称 体育视图处理线程
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.workerName = WorkerName.sportViewProcessWorker;
	//线程指令 体育eventSource 指令
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.commandType = SportViewProcessWorkerCommandType.sportEventSource;
	const params = {
		apiUrl: SportsCommonFn.getSportPushApiUrl(),
		token: sportsInfoStore.getSportsToken,
		language: SportsCommonFn.getSportLanguage(),
	};
	//清空参数
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = {} as OpenSportEventSourceParams;
	//参数赋值
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, sportsEventDetailPush.openEvents(eventId), params);
	//发送SSE指令到线程管理器
	pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);
	//清空参数
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = {} as OpenSportEventSourceParams;
	//参数赋值
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, sportsEventDetailPush.openMarkets(eventId), params);
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
					background: var(--Theme-, #3bc116);
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
