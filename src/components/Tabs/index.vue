<template>
	<div class="tabs">
		<div class="tabs-header">
			<button v-for="tab in tabs" :key="tab.name" :class="{ active: tab.name === activeTab }" @click="selectTab(tab.name)">
				{{ tab.label }}
			</button>
		</div>
		<div class="tabs-content">
			<slot :activeTab="activeTab"></slot>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";

interface Tab {
	name: string;
	label: string;
}

const props = defineProps<{
	tabs: Tab[];
	activeTab: string; // 当前选中的标签页名称
}>();

const emit = defineEmits<{
	(e: "update:activeTab", tabName: string): void; // 自定义事件来更新选中的标签页
}>();

const selectTab = (tabName: string) => {
	emit("update:activeTab", tabName); // 触发事件更新选中的标签页
};
</script>

<style scoped>
.tabs {
	display: flex;
	border-radius: 4px;
	align-items: flex-start;
	padding: 0 20px;
}

.tabs-header {
	display: flex;
	flex-direction: column;
	width: 200px; /* Adjust width as needed */
	background: var(--Bg1);
	margin-right: 10px;
	border-radius: 8px;
	padding: 13px;
}

.tabs-header button {
	flex: 1;
	padding: 10px;
	border: none;
	background: none;
	cursor: pointer;
	text-align: left; /* Align text to the left */
}

.tabs-header button.active {
	font-weight: bold;
	border-radius: 4px;
	background: var(--Bg3);
}

.tabs-content {
	flex: 1;
	padding: 10px;
	background: var(--Bg1);
	height: 80vh;
	border-radius: 8px;
	overflow-y: auto; /* Add scrollbar if content overflows */
}
.tabs-content::-webkit-scrollbar {
	display: none;
}
</style>
