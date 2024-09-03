<template>
	<div class="max-width">
		<div class="title mt_10 mb_10">帮助中心</div>
		<Tabs :tabs="tabs" :activeTab="activeTab" @update:activeTab="updateActiveTab">
			<Tab name="tab1" :activeTab="activeTab">
				<p v-for="item in 1000">
					This is content for Tab 1.This is content for Tab 1.This is content for Tab 1.This is content for Tab 1.This is content for Tab 1.This is content for Tab 1.This is
					content for Tab 1.This is content for Tab 1.This is content for Tab 1.This is content for Tab 1.
				</p>
			</Tab>
			<Tab name="tab2" :activeTab="activeTab">
				<p>This is content for Tab 2.</p>
			</Tab>
			<Tab name="tab3" :activeTab="activeTab">
				<p>This is content for Tab 3.</p>
			</Tab>
		</Tabs>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
const activeTab = ref("tab1");
const tabs = ref([
	{ name: "tab1", label: "Tab 1" },
	{ name: "tab2", label: "Tab 2" },
	{ name: "tab3", label: "Tab 3" },
]);

const updateActiveTab = (tabName: string) => {
	activeTab.value = tabName;
};
</script>

<style scoped>
.title {
	color: var(--Text_s);
	font-size: 20px;
}
</style>
