<template>
	<div class="box_select" @click="onToggleAllStates">
		<div class="select_left">
			<div class="title">
				<span>{{ teamName || routeNameMap.get(route.name as string) }}({{ teamData.length }})</span>
			</div>
		</div>
		<div class="select_right">
			<span><svg-icon class="icon" :class="{ 'icon-expanded': expandedCount == teamData.length }" name="sports-arrow_big" size="20px"></svg-icon></span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { watch } from "vue";
import { i18n } from "/@/i18n/index";
const $: any = i18n.global;
const route = useRoute(); // 获取当前路由实例

const routeNameMap = new Map([
	["todayContestRollingBall", $.t(`sports["滚球盘"]`)],
	["todayContestNotStarted", $.t(`sports["未开赛"]`)],
	["morningTradingList", $.t(`sports["早盘"]`)],
]);

interface teamDataType {
	/** 队伍数据 */
	teamData: any;
	expandedCount: number;
	teamName?: string;
}
const props = withDefaults(defineProps<teamDataType>(), {
	/** 队伍数据 */
	teamData: () => {
		return {};
	},
	// /右侧icon展开收起状态
	expandedCount: 0,
});

const emit = defineEmits(["onToggleAllStates"]);

const onToggleAllStates = () => {
	emit("onToggleAllStates");
};

watch(
	() => props.expandedCount,
	() => {
		console.log(props.expandedCount, "props.expandedCount");
	}
);
</script>

<style lang="scss" scoped>
.box_select {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	// margin-top: 4px;
	// margin-bottom: 4px;
	padding: 4px 19px 4px 28px;
	border-radius: 8px;
	background-color: var(--Bg-1);
	cursor: pointer;

	.select_left {
		display: flex;
		align-items: center;
		gap: 20px;
		.title {
			color: var(--Theme);
			font-family: "PingFang SC";
			font-size: 14px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
		}
	}

	.select_right {
		margin-left: 32px;

		.icon {
			color: var(--Icon-1);
			transition: transform 0.3s ease;
			display: inline-block;
			&.icon-expanded {
				transform: rotate(180deg);
			}
		}
	}
}
</style>
