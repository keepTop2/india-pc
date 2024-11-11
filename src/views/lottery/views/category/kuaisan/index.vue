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
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref } from "vue";
import { queryGameListParams } from "./components/playsConfig";
import { lotteryApi } from "/@/api/lottery";
import Containers from "/@/views/lottery/components/Containers/index.vue";
import { useUpdateThirdPartyTokenTimer } from "/@/views/lottery/hooks/useFetchThirdPartyTimer";
import { useTab } from "/@/views/lottery/hooks/useTab";
import { useLoginGame } from "/@/views/lottery/stores/loginGameStore";

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
const { loginGame } = useLoginGame();
const { turnOnTimer, turnOffTimer } = useUpdateThirdPartyTokenTimer(loginGame);

onMounted(async () => {
	// 登录第三方拿 token
	loginGame();

	// 定时去刷新第三方返回的 token
	turnOnTimer();

	// 获取 单个彩种的详情
	const res = await lotteryApi.queryGameList(queryGameListParams);
	lotteryDetail.value = res.data[0];
});

onBeforeUnmount(turnOffTimer);
</script>

<style lang="scss" scoped></style>
