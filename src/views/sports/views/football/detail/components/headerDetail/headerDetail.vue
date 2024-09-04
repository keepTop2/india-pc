<!--
 * @Author: Relax
 * @Description: 赛事详细比分栏
-->
<template>
	<div class="detail-container">
		<div class="top">
			<div class="back" @click="handleGoBack">
				<SvgIcon class="icon" iconName="arrowLeft" :size="13" />
				<span> 返回 </span>
			</div>
			<div class="title">{{ sportInfo.leagueName }}</div>
			<div class="handle">
				<div class="item" @click="isCollect()">
					<span>{{ show ? "显示" : "隐藏" }}</span>
					<img :src="show ? visible : hidden" alt="img" />
				</div>
				<!-- 收藏 -->
				<SvgIcon v-if="isAttention" class="saveFollow" iconName="sports_collection_three" @click="attentionEvent(true)" :size="20" />
				<!-- 未收藏 -->
				<SvgIcon v-else class="unFollow" iconName="sports_collection_three" @click="attentionEvent(false)" :size="20" />
				<!-- 刷新 -->
				<SvgIcon iconName="refresh_sports" :class="{ cycling: loading }" :size="20" @click="$emit('refresh')" />
			</div>
		</div>
		<template v-if="!show">
			<!-- 内容区域 -->
			<div class="content">
				<SportEventDetail :sportInfo="sportInfo" :size="'large'" />
			</div>
			<div class="playing-methods">
				<el-button class="active"> 全部</el-button>
				<SvgIcon :class="['icon-svg', { expand: !expandAndCollapse }]" iconName="doubleArrowUp_sports" @click="onExpandAndCollapse" :size="18" />
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed, watch } from "vue";
import hidden from "/@/assets/zh/default/competition/hidden.png";
import visible from "/@/assets/zh/default/competition/visible.png";
import { FootballCardApi } from "/@/api/sports/footballCard";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import PubSub from "/@/pubSub/pubSub";
import { useSportHotStore } from "/@/stores/modules/sports/sportHot";
import { useRouter } from "vue-router";
import SportEventDetail from "/@/views//sports/layout/components/sportRight/components/sprotVideo/sportEventDetail.vue";

const SportAttentionStore = useSportAttentionStore();
const SportHotStore = useSportHotStore();
const router = useRouter();

import sportsApi from "/@/api/sports/sports";

const emits = defineEmits(["back", "isHidden", "isCollect", "refresh", "filter", "expandAndCollapse", "toggleAll"]);

// 定义props类型
interface CapotCardType {
	/** 队伍数据 */
	sportInfo: any;
	loading?: boolean;
	expandAndCollapse?: boolean;
}

// 展示以及收缩玩法列表
const expandAndCollapse = ref(true);

const onExpandAndCollapse = () => {
	expandAndCollapse.value = !expandAndCollapse.value;
	emits("expandAndCollapse");
	emits("toggleAll");
};

// 定义props并设置默认值
const props = withDefaults(defineProps<CapotCardType>(), {
	sportInfo: () => {
		return {};
	},
	loading: false,
	expandAndCollapse: true,
});

watch(
	() => props.expandAndCollapse,
	(newValue) => {
		expandAndCollapse.value = newValue;
	}
);

watch(
	() => props.sportInfo,
	(newValue, oldValue) => {
		const event = newValue;
		if (event?.streamingOption && event?.channelCode) {
			GetStreaming();
		}
	}
);

onMounted(() => {
	GetStreaming();
});

/** 视频流地址 */
const videoStreamingUrl = ref({});
/**
 * @description:获取视频url
 * @return {*}
 */
const GetStreaming = async () => {
	const { streamingOption, channelCode, sportType } = props.sportInfo;
	// encodeURI(channelCode),
	const params = {
		streamingOption,
		channelCode: encodeURI(channelCode),
		sportType,
	};
	const res = await sportsApi.GetStreaming(params).catch((err) => {
		return err;
	});
	const { status, data } = res;
	if (status == 200) {
		videoStreamingUrl.value = res.data;
	}
};

/**
 * @description 点击切换 显示||隐藏 比分栏
 */
const show = ref(false);
const isCollect = () => {
	show.value = !show.value;
};

const isAttention = computed(() => {
	return SportAttentionStore.attentionEventIdList.includes(props.sportInfo.eventId);
});

// 点击关注按钮
const attentionEvent = async (isActive: boolean) => {
	if (isActive) {
		await FootballCardApi.unFollow({
			thirdId: [props.sportInfo.eventId],
		});
	} else {
		await FootballCardApi.saveFollow({
			thirdId: props.sportInfo.eventId,
			type: 2,
		});
	}
	PubSub.publish(PubSub.PubSubEvents.SportEvents.attentionChange.eventName, {});
};

const handleGoBack = () => {
	router.back();
	SportHotStore.updateToHotEvent();
};
</script>

<style scoped lang="scss">
.detail-container {
	width: 100%;
	margin-bottom: 20px;
	border-radius: 0px 0px 8px 8px;

	color: var(--Text1);

	.title {
		font-size: 16px;

		color: var(--Text_s);
	}

	.handle {
		display: flex;
		align-items: center;
		gap: 24px;

		.item {
			display: flex;
			align-items: center;
			font-size: 14px;
			gap: 8px;

			color: var(--Text1);

			img {
				cursor: pointer;
			}
		}

		.unFollow {
			color: var(--icon);
		}

		.saveFollow {
			color: var(--Warn);
		}
	}
}

.playing-methods {
	// height: 52px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 10px;
	padding: 12px;
	border-radius: 0px 0px 8px 8px;
	background: var(--Bg1-1, #24262b);

	.el-button {
		width: fit-content;
		margin: 0;
		height: 28px;
		border-radius: 99px;
		background: transparent;
		border: 1px solid var(--Icon, #67707b);
		padding: 0 20px;

		color: var(--Text1);
	}

	.active {
		border-color: transparent;

		color: var(--Text_a);
		background: var(--Theme);
	}
	.icon-svg {
		color: var(--icon);
	}

	.expand {
		color: var(--icon);
		transform: rotate(-180deg);
	}
}

.top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 12px 0 6px;
	height: 52px;

	.back {
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;

		.icon {
			margin-right: 4px;
		}
	}
}

.content {
	// // background-image: url(/@/assets/zh/default/competition/detailBg.png);;
	background-repeat: no-repeat;
	background-size: 100% 100%;
	width: 100%;
	min-height: 276px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;

	> .main {
		width: 892px;
	}
}
</style>
