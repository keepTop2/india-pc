<template>
	<Containers :data="mockData" class="lottery-shishicai">
		<!-- 标签栏 -->
		<div class="tabs">
			<!-- 循环渲染每个标签，基于当前选中的标签动态添加类名 -->
			<div :class="['tabs-item', tabsActived === item.value ? 'actived' : '']" @click="handleTabChange(item.value)" v-for="item in tabs" :key="item.value">
				{{ item.label }}
			</div>
		</div>

		<!-- 内容部分 -->
		<component :is="tabComponents.get(tabsActived)" />
	</Containers>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";
// 引入各组件和工具方法
import Containers from "/@/views/lottery/components/Containers/index.vue";
import { i18n } from "/@/i18n/index";
const $: any = i18n.global;

const BayLottery = defineAsyncComponent(() => import("./components/bayLottery.vue"));
const Result = defineAsyncComponent(() => import("./components/result.vue"));

const tabComponents = new Map([
	[1, BayLottery],
	[2, Result],
]);

// 模拟数据，用于显示在页面头部
const mockData = {
	icon: "https://ctopalistat3.zengchenglm.com/pc/images/db_DB5FC2cea4e2f859029cdbda33fffda6ea1f2.png",
	title: "时时彩",
	desc: "五分钟一期",
	seconds: 100,
	betStatusName: "投注中",
	issuesNo: "20230812-084",
	recentlyAwarded: 5403.23,
};

// 标签栏的配置数据
const tabs = [
	{ label: "购买彩票", value: 1 },
	{ label: "开奖结果", value: 2 },
];

// 标签栏切换的处理方法
const tabsActived = ref<number>(2);
const handleTabChange = (id: number) => {
	tabsActived.value = id;
};
</script>

<style lang="scss" scoped></style>
