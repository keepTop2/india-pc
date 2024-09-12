<template>
	<div class="box_select">
		<div class="select_left">
			<div class="title">
				{{ getDisplayText() }} <span>({{ teamData.length }})</span>
			</div>
			<SieveOfCases v-if="sportsActive !== 'champion'" :options="teamData" />
		</div>
		<div class="select_right">
			<span class="icon"><svg-icon name="sports-arrow_big" size="20px"></svg-icon></span>
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
@import "/@/views/sports/views/styles/selectCard.scss";
</style>
