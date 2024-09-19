<template>
	<div class="card-container">
		<!--  头部 -->
		<div class="card—header" :class="[!displayContent ? 'toggle' : '']" @click="toggleDisplay">
			<!-- 联赛信息 -->
			<div class="league-info">
				<!-- <span class="collection" @click="attentionEvent(!isAttention ? false : true)">
					<svg-icon :name="!isAttention ? 'sports-collection' : 'sports-already_collected'" size="16px"></svg-icon>
				</span> -->
				<img class="league_icon" :src="teamData.leagueIconUrl" alt="" />
				<div class="league_name" :style="displayContent ? `max-width:300px` : ''">{{ teamData.leagueName }}</div>
			</div>
			<!-- 盘口表头 -->
			<div class="market-name-info" v-if="displayContent">
				<div class="market-name-list">
					<div class="label" v-for="betType in SportsCommonFn.betTypeMap[1]" :key="betType">{{ betType }}</div>
				</div>
			</div>
			<div class="header-icon">
				<span class="icon"><svg-icon name="sports-arrow" width="8px" height="12px"></svg-icon></span>
			</div>
		</div>
		<template v-if="displayContent">
			<EventItem :IfOffTheBat="IfOffTheBat" v-for="(event, index) in teamData.events" :key="index" :event="event" :displayContent="displayContent" :dataIndex="props.dataIndex" />
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import EventItem from "./components/eventItem/eventItem.vue";
import PubSub from "/@/pubSub/pubSub";
import { FootballCardApi } from "/@/api/sports/footballCard";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import SportsCommonFn from "/@/views/sports/utils/common";
const SportAttentionStore = useSportAttentionStore();

interface teamDataType {
	/** 数据索引 */
	dataIndex: number;
	/** 队伍数据 */
	teamData: any;
	/** 是展开状态？ */
	isExpand?: boolean;
	/** 当前路由名称 */
	IfOffTheBat?: string;
}
const props = withDefaults(defineProps<teamDataType>(), {
	isExpand: true,
	/** 数据索引 */
	dataIndex: 0,
	/** 当前路由名称 */
	IfOffTheBat: "rollingBall",
	/** 队伍数据 */
	teamData: () => {
		return {};
	},
});

const displayContent = ref(true);

const emit = defineEmits(["toggleDisplay"]);
/**
 * @description: 展开折叠处理
 * @return {*}
 */
const toggleDisplay = () => {
	displayContent.value = !displayContent.value;
	const params = {
		index: props.dataIndex,
		isExpand: displayContent.value,
	};
	emit("toggleDisplay", params);
};

watch(
	() => props.isExpand,
	(newValue, oldValue) => {
		displayContent.value = newValue;
	},
	{
		immediate: true,
	}
);
/** 队伍所有的ids */
const eventIds = computed(() => {
	let ids = [];
	if (props.teamData.events.length) {
		const events = props.teamData.events;
		for (let k = 0; k < events.length; k++) {
			const str = events[k].eventId.toString();
			ids.push(str);
		}
	}
	return ids;
});

/** 计算收藏显示什么图标 */
const isAttention = computed(() => {
	let tag = false;
	if (eventIds.value.length) {
		for (let i = 0; i < eventIds.value.length; i++) {
			/*判断是否包含 */
			const bol = SportAttentionStore.getAttentionEventIdList.includes(Number(eventIds.value[i]));
			if (bol) {
				tag = true;
			} else {
				tag = false;
				break;
			}
		}
	}
	return tag;
});

onMounted(() => {
	displayContent.value = props.isExpand;

	// console.log(props.teamData, 45612);
});

/**
 * @description: 队伍是否添加关注
 * @param {*} isActive 是否收藏
 * @return {*}
 */
const attentionEvent = async (isActive: boolean) => {
	if (isActive) {
		/**取消体育关注 */
		await FootballCardApi.unFollow({
			thirdId: eventIds.value,
		});
	} else {
		if (eventIds.value.length) {
			for (let i = 0; i < eventIds.value.length; i++) {
				const str = eventIds.value[i].toString();
				/**添加体育关注 */
				await FootballCardApi.saveFollow({
					thirdId: str,
					type: 1,
				});
			}
		}
		// /**添加体育关注 */
		// await FootballCardApi.saveFollow({
		// 	thirdId: [eventIds.value],
		// 	type: 1,
		// });
	}
	PubSub.publish(PubSub.PubSubEvents.SportEvents.attentionChange.eventName, {});
};
</script>

<style scoped lang="scss">
.card-container {
	width: 1246px;
	border-radius: 8px;
	overflow: hidden;
	.card—header {
		display: flex;
		width: 100%;
		height: 34px;
		background: var(--Bg6);
		box-shadow: 0px 1px 2px 0px rgba(255, 255, 255, 0.25) inset;
		border-radius: 8px 8px 0px 0px;

		.league-info {
			// width: 384px;
			flex: 1;
			display: flex;
			align-items: center;
			gap: 12px;
			padding-left: 24px;
			box-sizing: border-box;
			.collection {
				width: 16px;
				height: 16px;
			}
			.league_icon {
				width: 20px;
				height: 20px;
			}
			.league_name {
				// max-width: 328px;
				color: var(--Text_s);
				font-family: "PingFang SC";
				font-size: 16px;
				font-weight: 400;
				white-space: nowrap; /* 防止文本换行 */
				overflow: hidden; /* 超出部分隐藏 */
				text-overflow: ellipsis; /* 超出部分显示省略号 */
			}
		}
		.market-name-info {
			width: 804px;
			.market-name-list {
				height: 100%;
				display: flex;
				gap: 4px;
				padding-right: 4px;
				.label {
					flex: 1;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					color: var(--Text1);
					text-align: center;
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
				}
			}
		}
		.header-icon {
			width: 58px;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			.icon {
				transform: rotate(-90deg);
			}
		}
	}
}
</style>
