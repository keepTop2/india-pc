<!--
 * @Author: Relax
 * @Description: 体育-冰上曲棍球-卡片
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
			<!-- 收藏 -->
			<!-- <SvgIcon class="sports_collection" iconName="sports_collection" :size="20" /> -->
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
const betTypes = ["独赢", "让球", "大小", "单/双"];

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
	console.log(123);
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

onMounted(() => {
	displayContent.value = props.isExpand;
	// console.log(props.teamData, 45612);
});
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
		margin-right: 58px;

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
		.top_right {
			.top_right_one {
				display: grid;
				grid-template-columns: repeat(4, 197px);
				gap: 4px;

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
					padding: 0 39px;
				}
			}
		}
	}
	.sports_collection {
		margin: 0 25px 0 18px;
		@include themeify {
			color: themed("icon");
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
