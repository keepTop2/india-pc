<!--
 * @Author: Relax
 * @Description: 联赛数据统计筛选
-->
<template>
	<div class="box_select">
		<div class="select_left">
			<SvgIcon class="icon" iconName="arrow" :size="18" />
			<div>
				{{ teamName }} <span>({{ teamData.length }})</span>
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
@import "/@/views/sports/views/styles/selectCard.scss";
</style>
