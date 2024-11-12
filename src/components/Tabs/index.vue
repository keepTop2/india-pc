<template>
	<div class="tabs">
		<div class="tabs-header">
			<button v-for="tab in tabs" :key="tab.name" :class="{ active: tab.name === activeTab }" @click="selectTab(tab.name)">
				{{ tab.label }}
			</button>
		</div>
		<div class="tabs-content-box">
			<div class="tabs-content">
				<slot :activeTab="activeTab"></slot>
			</div>
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
}

.tabs-header {
	display: flex;
	flex-direction: column;
	/* Adjust width as needed */
	border-radius: 8px;
	overflow: hidden;
	overflow-y: auto;
	height: 80vh;
	min-height: 500px;
}
.tabs-header::-webkit-scrollbar {
	display: none;
}

.tabs-header button {
	min-height: 36px;
	margin: 0 12px 8px;
	border: none;
	background: none;
	cursor: pointer;
	background: var(--Bg-1);
	color: var(--Text-1);
	width: 174px;
	text-align: center; /* Align text to the left */
}

.tabs-header button.active {
	font-weight: bold;
	border-radius: 4px;
	background: var(--Theme);
	color: var(--Text-s);
}

.tabs-content-box {
	flex: 1;
	height: 80vh;
	margin-right: 5px;
	overflow-y: auto; /* Add scrollbar if content overflows */
}
.tabs-content {
	background-color: var(--Bg-3);
	border-radius: 8px;
	margin-right: 5px;
}
.tabs-content-box::-webkit-scrollbar {
	width: 6px;
}
.tabs-content-box::-webkit-scrollbar-track {
	background-color: transparent;
}
.tabs-content-box::-webkit-scrollbar-thumb {
	background: var(--Bg-1);
	border-radius: 5px;
}
</style>
