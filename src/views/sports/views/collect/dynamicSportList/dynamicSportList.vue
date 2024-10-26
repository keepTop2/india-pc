<template>
	<div v-if="teamData?.length">
		<SelectCard :teamName="teamName" :teamData="teamData" :expandedCount="expandedPanels.size" @onToggleAllStates="onToggleAllStates(teamData)" />
		<div class="box" v-for="(data, index) in teamData" :key="index">
			<component
				:is="listComponent"
				:teamData="data"
				:dataIndex="index"
				@oddsChange="oddsChange"
				:isExpanded="!expandedPanels.has(index)"
				@toggleDisplay="toggleDisplay"
			></component>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, ref, defineAsyncComponent } from "vue";
import useExpandPanels from "/@/views/sports/hooks/useExpandPanels";
// 展开收起总控
const SelectCard = defineAsyncComponent(() => import("/@/views/sports/components/selectCard/selectCard.vue"));

const emit = defineEmits(["oddsChange"]);

const props = defineProps({
	teamName: String,
	teamData: Array,
	listComponent: Object,
	isExpand: Boolean,
});

/**
 * @description 控制收起/展开面板
 * onToggleAllStates 总控制器
 * toggleDisplay 子面板控制器
 * expandedPanels 所有收起状态的子面板索引
 */
const { expandedPanels, onToggleAllStates, toggleDisplay } = useExpandPanels();
const oddsChange = (event: any) => {
	emit("oddsChange", event);
};
</script>
