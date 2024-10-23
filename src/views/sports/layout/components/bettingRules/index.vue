<template>
	<div class="modal-overlay"></div>
	<div class="max-width">
		<div class="title mt_15 mb_15 ml_18">
			<svg-icon name="logo" width="132px" height="16px" />
			<span class="fs_14 Text1 ml_20"> 竞猜规则 </span>
		</div>
		<Tabs :tabs="tabs" :activeTab="activeTab" @update:activeTab="updateActiveTab">
			<Tab :name="item.name" :activeTab="activeTab" v-for="item in tabs">
				<component :is="item.component" />
			</Tab>
		</Tabs>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import bettingRules from "./bettingRules";

type BettingRuleKey = keyof typeof bettingRules;
type BettingRuleComponent = (typeof bettingRules)[BettingRuleKey];
let tabs = Object.keys(bettingRules).map((key) => {
	return {
		name: key,
		label: key,
		component: bettingRules[key as BettingRuleKey] as BettingRuleComponent,
	};
});
const activeTab = ref(tabs[0].name);
const updateActiveTab = (tabName: string) => {
	activeTab.value = tabName;
};
</script>

<style scoped>
@import url("./bettingRules.scss");
.title {
	color: var(--Text_s);
	font-size: 20px;
}
</style>
