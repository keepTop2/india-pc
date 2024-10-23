<template>
	<div class="box_select">
		<div class="select_left">
			<div class="title">
				<span>{{ routeNameMap.get(route.name) }}({{ teamData.length }})</span>
			</div>
		</div>
		<div class="select_right" @click="handleClick">
			<span class="icon" :class="{ 'icon-expanded': expandedCount == teamData.length }">
				<svg-icon name="sports-arrow_big" size="20px"></svg-icon>
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute(); // 获取当前路由实例
const routeNameMap = new Map([["championList", "冠军盘"]]);

interface TeamDataType {
	/** 队伍数据 */
	teamData: any[];
	expandedCount: number;
	sportsActive: string;
}

const emit = defineEmits(["handleClick"]);

const props = withDefaults(defineProps<TeamDataType>(), {
	/** 队伍数据 */
	teamData: () => [],
	expandedCount: 0,
	sportsActive: "",
});

const handleClick = () => {
	emit("handleClick");
};
</script>

<style lang="scss" scoped>
.box_select {
	width: 100%;
	height: 34px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 4px;
	margin-bottom: 4px;
	padding: 4px 19px 4px 28px;
	border-radius: 8px;
	background-color: var(--Bg1);
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
		cursor: pointer;

		.icon {
			color: var(--Icon_1);
			transition: transform 0.3s ease;
			display: inline-block;
			&.icon-expanded {
				transform: rotate(180deg);
			}
		}
	}
}
</style>
