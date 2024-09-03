<!--
 * @Author: Relax
 * @Description: 联赛数据统计筛选
-->
<template>
	<div>
		<div class="box_select">
			<div class="select_left">
				<SvgIcon class="icon" iconName="arrow" :size="18" />
				<div>
					{{ teamName }} <span>({{ teamData.length }})</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
interface teamDataType {
	teamName: string;
	/** 队伍数据 */
	teamData: any;
}
const props = withDefaults(defineProps<teamDataType>(), {
	teamName: "",
	/** 队伍数据 */
	teamData: () => {
		return {};
	},
});
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
}
</style>
