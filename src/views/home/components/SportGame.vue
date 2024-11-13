<template>
	<div class="mt_40 pr_10 pl_10">
		<div class="cardHeader">
			<div>
				<span class="flex-center">
					<svg-icon name="sports-event_game" width="24px" height="24px" />
					<span class="Text_s fs_20">我们的游戏</span>
				</span>
			</div>
			<div class="more Text1 fs_18 curp" @click="gotoVenue" v-if="gameList.length > 3">更多</div>
		</div>

		<div class="card-list">
			<template :key="item.leagueId" v-for="item in eventList">
				<SportGameCard :events="item" />
			</template>
		</div>

		<!-- 购物车，特定条件下显示 -->
		<div class="sport-car" :class="{ 'hide-sport-car': !sportsBetEvent.sportsBetEventData?.length }">
			<SportsShopCart v-if="popularLeague.visible" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onDeactivated, onUnmounted } from "vue";
import SportsApi from "/@/api/sports/sports";
import { HomeApi } from "/@/api/home";
import pubsub from "/@/pubSub/pubSub";
import { SportViewProcessWorkerApi, WorkerName } from "/@/enum/webworkerEnum/workerTransferEnum";
import SportsCommonFn from "/@/views/sports/utils/common";
import { OpenSportEventSourceParams } from "/@/views/sports/models/sportEventSourceModel";
import { SportPushApi, WebToPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";
import { useSportsInfoStore } from "/@/stores/modules/sports/sportsInfo";
import workerManage from "/@/webWorker/workerManage";
import useSportPubSubEvents from "/@/views/sports/hooks/useSportPubSubEvents";
import { useUserStore } from "/@/stores/modules/user";
import { WebWorkerControllerE } from "/@/enum/webworkerEnum/webworkerControllerE";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import SportsShopCart from "/@/views/sports/layout/components/sportsShopCart/sportsShopCart.vue";
import { usePopularLeague } from "/@/stores/modules/sports/popularLeague";
import SportGameCard from "./SportGameCard.vue";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
const sportsBetEvent = useSportsBetEventStore();
const sportsInfoStore = useSportsInfoStore();
const { startPolling, stopPolling, initSportPubsub, unSubSport, sportsLogin, clearState } = useSportPubSubEvents();
const UserStore = useUserStore();
const popularLeague = usePopularLeague();
const gameList = ref([]);

const SportAttentionStore = useSportAttentionStore();

//获取推荐赛事列表
const eventIDList = ref("");
const getSportEventsRecommend = () => {
	HomeApi.querySportEventsRecommend().then((res) => {
		eventIDList.value = res.data?.map((item) => item.eventsId).join();
	});
};

// 获取用户关注的体育列表
const getAttention = async (isLogin = true) => {
	if (UserStore.getLogin) {
		const res = await SportsApi.getAttentionList();
		if (res.data) {
			SportAttentionStore.setAttentionList(res.data);
		}
	}
};

/**
 * @description 发送指令到体育视图处理线程 开启SSE推送
 */
const openSportPush = async () => {
	if (!eventIDList.value) return;
	//线程名称 体育视图处理线程
	pubsub.PubSubEvents.WorkerEvents.viewToWorker.params!.workerName = WorkerName.sportViewProcessWorker;
	pubsub.PubSubEvents.WorkerEvents.viewToWorker.params!.controllerName = WebWorkerControllerE.SportEventSourceController;
	pubsub.PubSubEvents.WorkerEvents.viewToWorker.params!.apiName = SportViewProcessWorkerApi.sportEventSource;
	//线程指令 体育eventSource 指令
	pubsub.PubSubEvents.WorkerEvents.viewToWorker.params!.commandType = SportViewProcessWorkerApi.sportEventSource;
	const params = {
		apiUrl: SportsCommonFn.getSportPushApiUrl(),
		token: sportsInfoStore.getSportsToken,
		language: SportsCommonFn.getSportLanguage(),
	};
	// console.warn("第二步 准备发送指令到线程管理器");
	//如果当前激活的tab是 滚球
	// startLoading();
	//清空参数
	pubsub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = {} as OpenSportEventSourceParams;
	//参数赋值
	pubsub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign(
		{},
		{
			sportPushApi: SportPushApi.GetEvents_push,
			webToPushApi: WebToPushApi.eventsRollingBall,
			params: {
				query: `$filter=eventId in (${eventIDList.value})`,
			},
			isMultiple: false,
		},
		params
	);
	//发送SSE指令到线程管理器
	pubsub.publish(pubsub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubsub.PubSubEvents.WorkerEvents.viewToWorker.params);
	// stopLoading();
};

//初始化体育
const initSport = async () => {
	//开启体育线程
	workerManage.startWorker(workerManage.WorkerMap.sportViewProcessWorker.workerName);
	await sportsLogin({
		device: 1,
		venueCode: "",
		gameCode: "",
	}).then((res) => {
		if (res) {
			initSportPubsub();
			openSportPush();
			if (UserStore.token) {
				// 开始轮询登录接口
				startPolling();
				// getAttention();
				//切换关注状态后触发获取关注列表
				pubsub.subscribe(pubsub.PubSubEvents.SportEvents.attentionChange.eventName, async () => {
					// await getAttention();
				});
			}
		}
	});
};

onMounted(async () => {
	getAttention();
	await getSportEventsRecommend();
	initSport();
	// 订阅关注变化事件;
	pubsub.subscribe(pubsub.PubSubEvents.SportEvents.attentionChange.eventName, getAttention);
});

//卸载体育
const unSport = () => {
	//取消订阅体育事件
	unSubSport();
	clearState();
	workerManage.stopWorker(workerManage.WorkerMap.sportViewProcessWorker.workerName);
};

onUnmounted(() => {
	// 关闭登录接口轮询
	stopPolling();
	// 清除体育数据缓存
	// clearStoreInfo();
	// 卸载体育
	unSport();
	pubsub.unsubscribe(pubsub.PubSubEvents.SportEvents.attentionChange.eventName, getAttention);
	//关闭ws连接
	// destroyWS();
});
const eventList = ref<any[]>([]);
//监听处理好的体育联赛数据列表 从中获取后台配置好的赛事展示在首页。
watch(
	() => viewSportPubSubEventData.getSportData(),
	(newData, oldData) => {
		console.log(newData, oldData, "oldData==");

		// console.log(JSON.stringify(newData));
		/**
		 * @description 根据 sportType 获取对应的数据
		 * @param {Sports} sportType
		 */
		const football = newData[1] || [];
		const basketball = newData[2] || [];
		const leagues = [...football, ...basketball];
		const newEvents = newData.flatMap((item) => item.events);
		leagues.forEach((item) => {
			newEvents.push(...item.events);
		});
		eventList.value = newEvents;
	}
);

const gotoVenue = () => {};
</script>

<style scoped lang="scss">
.cardHeader {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12px;
}
.card-list {
	width: 100%;
	display: flex;
	align-items: center;
	column-gap: 18px;
	height: 464px;
}
.hide-sport-car {
	opacity: 0;
	z-index: -1;
	.card-list-item {
		width: calc((100% - 36px) / 3);
		height: 100%;
		background-color: var(--Bg-1);
		border-radius: 12px;
		padding: 16px 12px;
		header {
			display: flex;
			column-gap: 4px;
			width: 100%;
			height: 22px;
			align-items: center;
			.icon {
				height: 20px;
			}
			.icon,
			.collection {
				flex: 1;
			}
			.name {
				width: 100%;
				color: var(--Text-1);
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.collection {
				height: 20px;
				width: 20px;
				background: linear-gradient(to bottom, #f4f5f5, #c8cacd);
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		.sport-time {
			height: 20px;
			line-height: 20px;
			margin-top: 8px;
			color: var(--Text-1);
			margin-bottom: 24px;
		}
		.sport-team-info {
			display: flex;
			flex-direction: column;
			width: 100%;
			row-gap: 14px;
			.team {
				height: 38px;
				width: 100%;
				display: flex;
				align-items: center;
				img {
					width: 30px;
					height: 30px;
					flex: 1;
				}
				.name {
					width: 100%;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					font-size: 20px;
					color: var(--Text-a);
				}
				.sroce {
					height: 100%;
					width: 48px;
					border-radius: 8px;
					background-color: var(--Line-2);
					display: flex;
					justify-content: center;
					align-items: center;
					> span {
						color: var(--Text-a);
						font-family: "DIN Alternate";
						font-size: 18px;
						font-weight: 700;
					}
				}
			}
		}
		.line {
			width: 100%;
			height: 1px;
			background-color: var(--Line-1);
			margin: 14px 0;
		}
		footer {
			text-align: center;
			margin-top: 20px;
			color: var(--Text-1);
			font-size: 16px;
		}
	}
}
</style>
