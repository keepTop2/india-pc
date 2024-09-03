<!--
 * @Author: Relax
 * @Description: 联赛数据统计筛选
-->
<template>
	<div>
		<div class="box_select">
			<div class="select_left">
				<!-- <SvgIcon class="icon" iconName="arrow" :size="18" /> -->
				<div>
					{{ getDisplayText() }} <span>({{ teamData.length }})</span>
				</div>
			</div>
			<div class="select_right" v-if="sportsActive !== 'champion'">
				<SieveOfCases :options="teamData" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { SieveOfCases } from "./index";

interface teamDataType {
	sportsActive: string;
	/** 队伍数据 */
	teamData: any;
}
const props = withDefaults(defineProps<teamDataType>(), {
	sportsActive: "",
	/** 队伍数据 */
	teamData: () => {
		return {};
	},
});

const getDisplayText = () => {
	switch (props.sportsActive) {
		case "rollingBall":
			return "滚球盘";
		case "todayContest":
			return "未开赛";
		case "morningTrading":
			return "早盘";
		case "champion":
			return "冠军";
		default:
			return "";
	}
};
</script>

<style lang="scss" scoped>
.box_select {
	margin-bottom: 16px;
	display: flex;
	align-items: center;
	padding: 5px 24px;

	.select_left {
		display: flex;
		align-items: center;
		color: var(--text-s, #fff);
		font-family: "PingFang SC";
		font-size: 16px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
		.icon {
			margin-right: 10px;
			@include themeify {
				color: themed("icon");
			}
		}
	}

	.select_right {
		margin-left: 32px;
	}
}
</style>
