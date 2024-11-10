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
		<component :is="tabComponents.get(tabsActived)" :lottery-detail="lotteryDetail" />
	</Containers>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
// 引入各组件和工具方法
import useAccordion from "/@/views/lottery/components/Tools/Accordion/Index";
import useBall from "/@/views/lottery/components/Tools/Ball/Index";
import useBetForm from "/@/views/lottery/components/BetForm/Index";
import Containers from "/@/views/lottery/components/Containers/index.vue";
import { queryGameListParams, queryGamePlayOddsListParams } from "./components/playsConfig";
import showToast from "/@/hooks/useToast";
import { i18n } from "/@/i18n/index";
import { lotteryApi } from "/@/api/lottery";
import { useTab } from "/@/views/lottery/hooks/useLottery";

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
	title: "快三",
	desc: "五分钟一期",
	seconds: 100,
	betStatusName: "投注中",
	issuesNo: "20230812-084",
	recentlyAwarded: 5403.23,
};

// 标签栏的配置数据
const { tabs, tabsActived, handleTabChange } = useTab();

const lotteryDetail = ref({}); // 单个彩种的详情，如名字、多少分钟一期
const integratePlaysConfigList = ref({}); // 单个彩种的动态的玩法与赔率信息（玩法写死，但是需要返回的数据整合）
const route = useRoute();

onMounted(async () => {
	// 获取 单个彩种的详情
	const res = await lotteryApi.queryGameList(queryGameListParams);
	lotteryDetail.value = res.data[0];
	console.log("lotteryDetail", lotteryDetail);
});
</script>

<style lang="scss" scoped></style>
