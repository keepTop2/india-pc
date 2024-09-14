<template>
	<div class="modal-overlay"></div>
	<div class="max-width">
		<div class="title mt_15 mb_15 ml_18">
			<svg-icon name="logo" width="132px" height="16px" />
			<span class="fs_14 Text1 ml_20"> 竞猜规则 </span>
		</div>
		<Tabs :tabs="tabs" :activeTab="activeTab" @update:activeTab="updateActiveTab" class="Text1">
			<Tab :name="item.name" :activeTab="activeTab" v-for="item in tabs">
				<component :is="item.component" />
			</Tab>
		</Tabs>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import helpCenter from "./helpCenter";
import { i18n } from "/@/i18n/index";
import { useRoute } from "vue-router";
type helpCenterKey = keyof typeof helpCenter;
type helpCenterComponent = (typeof helpCenter)[helpCenterKey];
const $: any = i18n.global;
let tabs = Object.keys(helpCenter).map((key) => {
	return {
		name: $.t(`helpCenter['${key}']['${key}']`),
		label: $.t(`helpCenter['${key}']['${key}']`),
		component: helpCenter[key as helpCenterKey] as helpCenterComponent,
	};
});
const activeTab = ref(tabs[0].name);
const updateActiveTab = (tabName: string) => {
	activeTab.value = tabName;
};
onMounted(() => {
	const { query } = useRoute();
	if (query.type) {
		updateActiveTab($.t(`helpCenter['${query.type}']['${query.type}']`));
	}
});
</script>

<style scoped>
@import url("./helpCenter.scss");
.title {
	color: var(--Text_s);
	font-size: 20px;
}
</style>
