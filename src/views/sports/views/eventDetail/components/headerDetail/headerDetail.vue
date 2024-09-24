<template>
	<div class="detail-container">
		<div class="top">
			<div class="back" @click="handleGoBack">
				<svg-icon class="icon" name="arrow_left" size="13" />
				<span>返回</span>
			</div>
			<div class="title">{{ sportInfo.leagueName }}</div>
			<div class="handle">
				<div class="item curp" @click="toggleCollect">
					<span>{{ show ? "显示" : "隐藏" }}</span>
					<svg-icon :name="show ? 'eyes' : 'eyes_on'" size="16px"></svg-icon>
				</div>
				<svg-icon class="saveFollow" :name="isAttention ? 'sports-already_collected' : 'sports-collection'" @click="attentionEvent(true)" size="20" />
				<svg-icon name="sports-shuaxin" :class="{ cycling: loading }" size="20" @click="$emit('refresh')" />
			</div>
		</div>
		<div class="content" :class="!show ? 'showContent' : 'hideContent'">
			<SportEventDetail :sportInfo="sportInfo" :size="'large'" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { FootballCardApi } from "/@/api/sports/footballCard";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import { useSportHotStore } from "/@/stores/modules/sports/sportHot";
import PubSub from "/@/pubSub/pubSub";
import sportEventDetail from "/@/views/sports/layout/components/sportRight/components/sprotVideo/sportEventDetail.vue";

const SportAttentionStore = useSportAttentionStore();
const SportHotStore = useSportHotStore();
const router = useRouter();

const emits = defineEmits(["back", "isHidden", "isCollect", "refresh", "filter", "toggleAll"]);

interface CapotCardType {
	sportInfo: any;
	loading?: boolean;
}

const props = withDefaults(defineProps<CapotCardType>(), {
	sportInfo: () => ({}),
	loading: false,
});

const show = ref(false);

/**
 * @description 切换显示/隐藏比分栏
 */
const toggleCollect = () => {
	show.value = !show.value;
	emits("isCollect", show.value);
};

const isAttention = computed(() => SportAttentionStore.attentionEventIdList.includes(props.sportInfo.eventId));

/**
 * @description 处理关注/取消关注事件
 * @param {boolean} isActive - 是否为关注操作
 */
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

/**
 * @description 处理返回操作
 */
const handleGoBack = () => {
	router.back();
	SportHotStore.updateToHotEvent();
};
</script>

<style scoped lang="scss">
.detail-container {
	width: 100%;
	margin-bottom: 20px;
	border-radius: 0 0 8px 8px;
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
			cursor: pointer;
		}

		.saveFollow {
			color: var(--Warn);
		}
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
		align-items: center;
		cursor: pointer;

		.icon {
			margin-right: 4px;
		}
	}
}

.content {
	width: 100%;
	flex: 1;
	height: 276px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s linear;
	overflow: hidden;
	z-index: 1;

	> .main {
		width: 892px;
	}

	&.showContent {
		height: 276px;
	}

	&.hideContent {
		height: 0;
		opacity: 0;
	}
}
</style>
