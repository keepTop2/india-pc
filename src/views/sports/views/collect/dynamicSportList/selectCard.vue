<!--
 * @Author: Relax
 * @Description: 联赛数据统计筛选
-->
<template>
	<div class="box_select" @click="toggleExpand">
		<div class="select_left">
			<div class="title">
				{{ teamName }} <span>({{ teamData.length }})</span>
			</div>
		</div>
		<div class="select_left">
			<svg-icon class="icon" :name="isExpanded ? 'sports-arrow_big' : 'sports-arrow_big_down'" :size="18" color="#67707B" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface TeamDataType {
	teamName: string;
	/** 队伍数据 */
	teamData: any[];
}

const props = withDefaults(defineProps<TeamDataType>(), {
	teamName: "",
	teamData: () => [],
});
console.log(props.teamData, "===teamData");
const isExpanded = ref(true);

const emit = defineEmits(["toggle"]);

const toggleExpand = () => {
	isExpanded.value = !isExpanded.value;
	emit("toggle");
};
</script>

<style lang="scss" scoped>
@import "/@/views/sports/views/styles/selectCard.scss";
</style>
