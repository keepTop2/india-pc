<!--
 * @Author: Relax
 * @Description: 体育-足球-卡片
-->
<template>
	<div class="card-container">
		<!--  头部 -->
		<div class="box sticky" :class="[!displayContent ? 'toggle' : '']">
			<div class="box_one" @click="toggleDisplay">
				<!-- 联赛信息 -->
				<div class="top_left">
					<img :src="teamData.leagueIconUrl" alt="" />
					<div class="title">
						<span>{{ teamData.leagueName }}</span>
					</div>
				</div>
				<!-- 投注类型 -->
				<div class="top_right">
					<transition name="fade">
						<div class="top_right_one" v-if="displayContent">
							<div class="text" v-for="betType in betTypes" :key="betType">{{ betType }}</div>
						</div>
					</transition>
				</div>
			</div>

			<!-- <div class="sports_collection"> -->
			<!-- 关注 -->
			<!-- <SvgIcon v-if="isAttention" class="svgIcon collection2" iconName="sports_collection_two " :size="16" @click="attentionEvent(true)" /> -->
			<!-- 取消关注 -->
			<!-- <SvgIcon v-else class="svgIcon" iconName="sports_collection" :size="16" @click="attentionEvent(false)" /> -->
			<!-- </div> -->
		</div>

		<EventItem
			:IfOffTheBat="IfOffTheBat"
			v-for="(event, index) in teamData.events"
			:key="index"
			:event="event"
			:displayContent="displayContent"
			:dataIndex="props.dataIndex"
		></EventItem>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { isExternal } from "util/types";
import EventItem from "./components/eventItem/eventItem.vue";
import Common from "/@/utils/common";
import PubSub from "/@/pubSub/pubSub";
import { FootballCardApi } from "/@/api/menu/sports/footballCard";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
const SportAttentionStore = useSportAttentionStore();
const betTypes = ["全场独赢", "全场让球", "全场大小", "半场独赢", "半场让球", "半场大小"];

interface teamDataType {
	/** 数据索引 */
	dataIndex: number;
	/** 队伍数据 */
	teamData: any;
	/** 是展开状态？ */
	isExpand?: boolean;
	/** 当前路由名称 */
	IfOffTheBat: string;
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

// console.log("props", props.teamData);

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
	margin-bottom: 16px;
}
.box {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 40px;
	flex-shrink: 0;
	border-radius: 8px 8px 0px 0px;

	@include themeify {
		background: themed("Bg6");
	}

	box-shadow: 0px 1px 2px 0px rgba(255, 255, 255, 0.25) inset;
	.box_one {
		flex: 1;
		display: flex;
		align-items: center;
		height: 100%;
		margin-right: 63px;
		// overflow: hidden;
		// position: relative;
		// width: 100%;
		.top_left {
			flex: 1;
			margin: 0 24px;
			display: flex;
			align-items: center;
			overflow: hidden;
			position: relative;
			// width: 100%;
			height: 100%;

			img {
				-webkit-user-drag: none;
				width: 20px;
				height: 20px;
			}

			.title {
				@include themeify {
					color: themed("Text_s");
				}
				min-width: 70px;
				flex: 1;
				position: relative;
				overflow: hidden;
				display: flex;
				height: 100%;
				margin-left: 12px;
				box-sizing: border-box;

				span {
					display: inline-block;
					width: 100%;
					height: 100%;
					font-family: "PingFang SC";
					font-size: 16px;
					font-style: normal;
					font-weight: 400;
					line-height: 40px;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					top: 0;
					position: absolute;
				}
			}
		}

		.top_right,
		.top_right_one {
			display: flex;
			align-items: center;

			.text {
				@include themeify {
					color: themed("Text1");
				}

				white-space: nowrap;
				text-align: center;
				font-family: "PingFang SC";
				font-size: 14px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
				// width: 134px;
				padding: 0 39px;
			}
		}
	}
	.sports_collection {
		margin: 0 25px 0 18px;
		@include themeify {
			color: themed("icon");
		}
		.collection2 {
			@include themeify {
				color: themed("Warn");
			}
		}
	}
}

.sticky {
	position: -webkit-sticky;
	position: sticky;
	top: 0;
	z-index: 1;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.toggle {
	border-radius: 8px;
	transition: border-radius 0.8s ease;
}
</style>
