<template>
	<div class="box_select">
		<div class="select_left">
			<div class="title">
				<span>({{ teamData.length }})</span>
			</div>
			<!-- <SieveOfCases :options="teamData" /> -->
		</div>
		<div class="select_right">
			<span class="icon"><svg-icon name="sports-arrow_big" size="20px"></svg-icon></span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { SieveOfCases } from "./index";

interface teamDataType {
	/** 队伍数据 */
	teamData: any;
}
const props = withDefaults(defineProps<teamDataType>(), {
	/** 队伍数据 */
	teamData: () => {
		return {};
	},
});
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
			color: var(--Icon_1);
		}
	}
}
</style>
