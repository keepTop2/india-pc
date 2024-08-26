<!--
 * @Author: WangMingxin
 * @Description: 体育赛事详细;
-->
<template>
	<div class="competition">
		<detail @filter="filterData" :teamData="state.finalObject"></detail>
		<div class="competition_two">
			<div class="box_team">
				<div v-for="(item, index) in state.finalObject.markets" :key="index">
					<div class="team" v-if="state.filtrateBetType === 0 || state.filtrateBetType === item.betType">
						<div class="record">
							<div class="record_one"></div>
							<div class="record_two">{{ item.betTypeName }}</div>
						</div>
						<div class="team_one">
							<MarketColumn
								v-if="item.betType == 5 || item.betType == 15"
								cardType="capot"
								:sportInfo="state.finalObject"
								:betType="item.betType"
								@oddsChange="oddsChange"
							></MarketColumn>
							<MarketColumn
								v-else-if="item.betType == 1 || item.betType == 7"
								cardType="handicap"
								:sportInfo="state.finalObject"
								:betType="item.betType"
								@oddsChange="oddsChange"
							></MarketColumn>
							<MarketColumn
								v-else-if="item.betType == 3 || item.betType == 8"
								cardType="magnitude"
								:sportInfo="state.finalObject"
								:betType="item.betType"
								@oddsChange="oddsChange"
							></MarketColumn>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch, watchEffect } from "vue";
import pubSub from "/@/pubSub/pubSub";
import { Sports, SportViewData } from "/@/models/interface";
import { useRoute } from "vue-router";
import { MarketColumn } from "./index";
import Detail from "./components/detail.vue";
import { SportViewModels } from "/@/models/sportViewModels";
import useSportPubSubEvents from "/@/hooks/sport/useSportPubSubEvents";
import viewSportPubSubEventData from "/@/hooks/sport/viewSportPubSubEventData";
const { clearSportsOddsChange } = useSportPubSubEvents();
// 如果是指足球的波膽，請參考
// bettype = 4	(足球)波胆

const route = useRoute();

/**选中的赛选类型；*/
const sportsActive = ref("rollingBall");

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
	// setInitsportsActive();
	// initSportPubsub();
	//发布初始化数据事件
	pubSub.publish(pubSub.PubSubEvents.SportEvents.initChildrenView.eventName, {});
});

onBeforeUnmount(() => {
	unSubSport();
});

/**
 * @description: 监听路由响应
 */
watch(
	() => route.query,
	(newValue, oldValue) => {
		if (newValue.sportsActive) {
			state.targetEvents = [];
			sportsActive.value = newValue?.sportsActive as string;
		}
	}
);

/** 只注重过程不在意结果的数据 响应获取  */
watchEffect(() => {
	/** 最新数据响应接入  */
	state.targetEvents = viewSportPubSubEventData.getSportData(1);
	//单个数据详细值临时获取方式
	state.targetEvent = state.targetEvents[route?.query?.dataIndex as string];
	for (const event of state.targetEvent.events) {
		if (event.eventId == route?.query?.eventId) {
			state.finalObject = event;
			break;
		}
	}
	console.log(state.finalObject, "===============================1");
});

/**设置初始化分类选中值; */
const setInitsportsActive = () => {
	sportsActive.value = route.query.sportsActive as string;
};

//体育订阅事件
const initSportPubsub = () => {
	//订阅体育Sports视图数据更新事件
	pubSub.subscribe(pubSub.PubSubEvents.SportEvents.sportsToChildren.eventName, sportsToChildrenProcess);
};

//取消订阅体育事件
const unSubSport = () => {
	//取消订阅体育子线程处理好数据事件
	pubSub.unsubscribe(pubSub.PubSubEvents.SportEvents.sportsToChildren.eventName, sportsToChildrenProcess);
};

const sportsToChildrenProcess = (data: SportViewModels) => {
	state.viewSportData = Object.assign({}, state.viewSportData, data.viewSportData);
	state.targetEvents = state.viewSportData.childrenViewData[1]; // 保存所有对象
	//单个数据详细值临时获取方式
	state.targetEvent = state.targetEvents[route?.query?.dataIndex as string];
	for (const event of state.targetEvent.events) {
		if (event.eventId == route?.query?.eventId) {
			state.finalObject = event;
			break;
		}
	}
};

/**
 * @description 赔率发生变化后 3秒动画 清理掉oddsChange状态
 */
const emit = defineEmits(["oddsChange"]);
const oddsChange = (obj: any) => {
	emit("oddsChange", obj);
};

const filterData = (filterItem: number) => {
	// 根据选定的筛选条件进行过滤等操作
	state.filtrateBetType = filterItem;
};
</script>
<style scoped lang="scss">
.oddsUp {
	@include themeify {
		color: themed("Warn") !important;
	}
}

.oddsDown {
	@include themeify {
		color: themed("Theme") !important;
	}
}

.competition {
	display: flex;
	flex-direction: column;
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
			.team_one {
			}
		}
	}
}
</style>
