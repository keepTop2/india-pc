<template>
	<div class="handler">
		<span class="flex-center curp">
			<svg-icon
				:name="isShowVideoWrapper ? 'sports-tv_icon_on' : 'sports-tv_icon'"
				size="24px"
				@click="() => handleActions(ActionsEnum.TV)"
				:style="{
					visibility: !computedShowFullScreen ? 'visible' : 'hidden',
				}"
			></svg-icon
		></span>

		<!-- 右侧 比分板 视频源 动画直播  -->
		<div class="tools">
			<div v-for="tool in computedTools" :key="tool.iconName" class="tooltip-container">
				<!-- <Score v-if="tool.type === 'img'" :eventDetail="eventDetail" :class="tool.className" @click="tool.actions" /> -->
				<svg-icon :name="'sports-' + tool.iconName" :size="23" @click="tool.actions"> </svg-icon>
				<!-- <SvgIcon v-else :class="tool.className" :iconName="tool.iconName" :size="23" @click="tool.actions" /> -->
				<!-- <span class="tooltip-text">{{ tool.tooltipText }}</span> -->
			</div>
		</div>

		<div class="utils curp">
			<!-- <SvgIcon v-if="computedShowFullScreen" iconName="full_screen" :size="16" @click="() => handleActions(ActionsEnum.FullScreen)" /> -->
			<!-- <SvgIcon iconName="refresh_sports" class="refresh" :class="{ cycling: loading }" :size="18" @click="() => handleActions(ActionsEnum.Refresh)" /> -->
			<svg-icon name="sports-quanping" :size="18" @click="() => handleActions(ActionsEnum.FullScreen)" v-if="controlType == SportControlEnum.Info"></svg-icon>
			<svg-icon name="sports-shuaxin" :size="18" @click="() => handleActions(ActionsEnum.Refresh)" :class="{ cycling: loading }"></svg-icon>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Score from "./score.vue";
import pubSub from "/@/pubSub/pubSub";
import { storeToRefs } from "pinia";
import { SportControlEnum, SportTypeEnum } from "/@/views/sports/enum/sportEnum/sportEnum";
import { useSportHotStore } from "/@/stores/modules/sports/sportHot";

const SportHotStore = useSportHotStore();
const { useControlList, controlType, currentEventInfo } = storeToRefs(SportHotStore);
import { useLink } from "/@/views/sports/hooks/useLink";
const { gotoEventDetail } = useLink();
const emit = defineEmits(["refresh", "closeVideoWrapper"]);

enum ActionsEnum {
	/**
	 * 比分板
	 */
	Score = SportControlEnum.Info,
	/**
	 * 视频源
	 */
	Video = SportControlEnum.Video,
	/**
	 * 动画
	 */
	Animation = SportControlEnum.Animation,
	/**
	 * 刷新
	 */
	Refresh = "refresh",
	/**
	 * 全屏
	 */
	FullScreen = "fullScreen",
	/**
	 * Live
	 */
	TV = "tv",
}

const props = withDefaults(
	defineProps<{
		/** 体育Event对象 */
		eventDetail: any;
		loading?: boolean;
		isShowVideoWrapper: Boolean;
	}>(),
	{
		eventDetail: () => {
			return {};
		},
		loading: false,
	}
);

/**
 * 点击操作
 */
const handleActions = (type: ActionsEnum) => {
	switch (type) {
		// 折叠
		case ActionsEnum.TV: {
			emit("closeVideoWrapper");
			break;
		}
		// 刷新
		case ActionsEnum.Refresh: {
			emit("refresh");
			break;
		}

		// 全屏
		case ActionsEnum.FullScreen: {
			const params = {
				eventId: currentEventInfo.value?.eventId,
				leagueId: currentEventInfo.value?.leagueId,
				dataIndex: 0,
				marketCount: currentEventInfo.value?.marketCount,
			};

			SportHotStore.setCurrentEvent(currentEventInfo.value);
			gotoEventDetail(params, SportTypeEnum.FootBall);
			// pubSub.publish(pubSub.PubSubEvents.SportEvents.onFullScreenOrExit.eventName, { isFullScreen: true });
			break;
		}

		// 动画直播/视频直播/比分板
		case ActionsEnum.Score:
		case ActionsEnum.Video:
		case ActionsEnum.Animation: {
			SportHotStore.updateControlType(type as any as SportControlEnum);
			break;
		}

		default: {
			break;
		}
	}
};

/**
 * 判断按钮是否显示
 */
const computedShowFullScreen = computed(() => {
	return useControlList.value.some((item) => [SportControlEnum.Video, SportControlEnum.Animation].includes(item.type));
});

/**
 * 工具tool
 */

const computedTools = computed(() => {
	return [
		{
			iconName: "bifenban",
			actions: () => handleActions(ActionsEnum.Score),
			show: useControlList.value.some((item) => item.type === SportControlEnum.Info),
		},
		{
			iconName: "live",
			actions: () => handleActions(ActionsEnum.Video),
			show: useControlList.value.some((item) => item.type === SportControlEnum.Video),
		},
		{
			iconName: "donghua",
			actions: () => handleActions(ActionsEnum.Animation),
			show: useControlList.value.some((item) => item.type === SportControlEnum.Animation),
		},
	].filter((item) => item.show);
});
</script>

<style lang="scss" scoped>
.handler {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 24px;
	height: 40px;
	background: var(--Bg1);

	.tools_icon {
		color: var(--icon);

		&.active {
			color: var(--Theme);
		}
	}

	.tools_icon:hover {
		color: var(--Theme);
	}

	.refresh {
		color: var(--icon);
	}

	.tools {
		display: flex;
		align-items: center;
		gap: 24px;

		.tooltip-container {
			position: relative;
			display: flex;
			cursor: pointer;

			::v-deep .score {
				background: var(--icon);
			}

			::v-deep .score {
				&:hover {
					background: var(--Theme);
				}
			}

			.tooltip-text {
				visibility: hidden;
				text-align: center;
				position: absolute;
				z-index: 1;
				bottom: -110%;
				/* 调整这个值以适应您的图标大小 */
				left: 50%;
				transform: translateX(-50%);
				opacity: 0;
				transition: opacity 0.3s;
				white-space: nowrap;

				padding: 2px 4px;
				text-align: center;
				font-family: "PingFang SC";
				font-size: 12px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
				border-radius: 4px;

				color: var(--Text1);
				background: var(--Line);
			}

			&:hover .tooltip-text {
				visibility: visible;
				opacity: 1;
			}
		}
	}

	.utils {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	img {
		cursor: pointer;
	}
}
</style>
