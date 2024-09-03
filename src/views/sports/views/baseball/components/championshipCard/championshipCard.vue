<!--
 * @Author: Relax
 * @Description: 体育-足球-冠军卡片
-->
<template>
	<div class="card-container">
		<!--  头部 -->
		<div class="box sticky">
			<div class="box_one" :class="[!displayContent ? 'toggle' : '']">
				<!-- 联赛信息 -->
				<div class="top_left" @click="toggleDisplay">
					<!-- <img :src="championData.leagueIconUrl" alt="" /> -->
					<div class="title">{{ championData.leagueName }}</div>
				</div>
				<!-- 收藏 -->
				<div class="top_right">
					<!-- 关注 -->
					<SvgIcon v-if="isAttention" class="sports_collection2" iconName="sports_collection_two" :size="16" @click="attentionEvent(true)" />
					<!-- 取消关注 -->
					<SvgIcon v-else class="sports_collection" iconName="sports_collection" :size="16" @click="attentionEvent(false)" />
				</div>
			</div>
			<div class="box_two">
				<!-- <div class="record">
        <div class="record_one"></div>
        <div class="record_two">最佳射手</div>
      </div> -->
				<div class="box_team">
					<MarketColumn :displayContent="displayContent" :sportInfo="championData" @oddsChange="oddsChange"></MarketColumn>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { MarketColumn } from "./index";
import { FootballCardApi } from "/@/api/menu/sports/footballCard";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import PubSub from "/@/pubSub/pubSub";
const SportAttentionStore = useSportAttentionStore();
interface teamDataType {
	/** 数据索引 */
	dataIndex: number;
	/** 队伍数据 */
	championData: any;
	/** 是展开状态？ */
	isExpand?: boolean;
}
const props = withDefaults(defineProps<teamDataType>(), {
	/** 是展开状态？ */
	isExpand: true,
	/** 数据索引 */
	dataIndex: 0,
	/** 队伍数据 */
	championData: () => {
		return {};
	},
});

const emit = defineEmits(["oddsChange", "toggleDisplay"]);

/**
 * @description 动画结束删除oddsChange字段状态
 */
const oddsChange = (obj: any) => {
	emit("oddsChange", obj);
};

const isAttention = computed(() => {
	return SportAttentionStore.attentionLeagueIdList.includes(props.championData.leagueId);
});

// 点击关注按钮
const attentionEvent = async (isActive: boolean) => {
	if (isActive) {
		await FootballCardApi.unFollow({
			thirdId: [props.championData.leagueId],
		});
	} else {
		await FootballCardApi.saveFollow({
			thirdId: props.championData.leagueId,
			type: 1,
		});
	}
	PubSub.publish(PubSub.PubSubEvents.SportEvents.attentionChange.eventName, {});
};

const displayContent = ref(true);

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

onMounted(() => {
	displayContent.value = props.isExpand;
	// console.log(props.teamData, 45612);
});
</script>

<style scoped lang="scss">
.card-container {
	margin-bottom: 16px;
}
.box_one {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 40px;
	flex-shrink: 0;
	border-radius: 8px 8px 0px 0px;

	background: var(--Bg6);

	box-shadow: 0px 1px 2px 0px rgba(255, 255, 255, 0.25) inset;

	.top_left {
		margin: 9px 24px;
		display: flex;
		align-items: center;
		flex: 1;
		img {
			width: 16px;
			height: 20px;
		}

		.title {
			color: var(--Text_s);

			margin-left: 12px;
			font-family: "PingFang SC";
			font-size: 16px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}

	.top_right {
		display: flex;
		align-items: center;

		.text {
			color: var(--Text1);

			text-align: center;
			font-family: "PingFang SC";
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			width: 134px;
		}

		.sports_collection {
			margin: 0 25px 0 18px;

			color: var(--icon);
		}
		.sports_collection2 {
			margin: 0 25px 0 18px;
			color: var(--Warn);
		}
	}
}

// .box_two {
// 	display: flex;
// 	flex-direction: column;
// 	justify-content: center;
// 	align-items: flex-start;

// 	.record {
// 		display: flex;
// 		align-items: center;
// 		margin: 15px 0 20px 0;

// 		.record_one {
// 			width: 4px;
// 			height: 22px;
// 			border-radius: 0px 4px 4px 0px;
// 			background: var(--Theme-, #3bc116);
// 			margin-right: 10px;
// 		}

// 		.record_two {
// 			color: var(--Text1-1, #98a7b5);
// 			font-family: "PingFang SC";
// 			font-size: 16px;
// 			font-style: normal;
// 			font-weight: 400;
// 			line-height: normal;
// 		}
// 	}
// }

.box_two {
	border-radius: 0px 0px 8px 8px;
	width: 100%;
	background: var(--Bg1-1, #24262b);
}

.toggle {
	border-radius: 8px;
	transition: border-radius 0.8s ease;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
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
