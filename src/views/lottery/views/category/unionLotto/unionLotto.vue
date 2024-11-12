<template>
	<Containers :data="lotteryInfo" class="lottery-union">
		<!-- 标签栏 -->
		<div class="tabs">
			<!-- 循环渲染每个标签，基于当前选中的标签动态添加类名 -->
			<!-- <div :class="['tabs-item', tabsActived === item.value ? 'actived' : '']" @click="handleTabChange(item.value)" v-for="item in tabs" :key="item.value">
				{{ item.label }}
			</div> -->
		</div>

		<!-- 内容部分 -->
		<!-- <component :is="tabComponents.get(tabsActived)" :lottery-detail="lotteryDetail" /> -->
	</Containers>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref } from "vue";
import { beginPageDataParams } from "./components/playsConfig";
import { lotteryApi } from "/@/api/lottery";
import Containers from "/@/views/lottery/components/Containers/index.vue";
// import { useUpdateThirdPartyTokenTimer } from "/@/views/lottery/hooks/useFetchThirdPartyTimer";
import { useTab } from "/@/views/lottery/hooks/useTab";
import { useLoginGame } from "/@/views/lottery/stores/loginGameStore";

const BuyLottery = defineAsyncComponent(() => import("./components/BuyLottery.vue"));
const Result = defineAsyncComponent(() => import("./components/result.vue"));

// const tabComponents = new Map([
// 	[1, BuyLottery],
// 	[2, Result],
// ]);

// 彩票基本信息
const lotteryInfo = {
	icon: "https://example.com/ssq-icon.png",
	title: "双色球",
	desc: "每周二、四、日开奖",
	seconds: 86400, // 距离下次开奖的秒数
	betStatusName: "投注中",
	issuesNo: "2023094", // 期号
	recentlyAwarded: 10000000, // 最近一期头奖金额
};

// const { tabs, tabsActived, handleTabChange } = useTab();
const lotteryDetail = ref({});
const { loginGame } = useLoginGame();
// const { turnOnTimer, turnOffTimer } = useUpdateThirdPartyTokenTimer(loginGame);

// onMounted(async () => {
// 	loginGame();
// 	turnOnTimer();

// 	const res = await lotteryApi.beginPageData(beginPageDataParams);
// 	lotteryDetail.value = res.data?.[0] || {};
// });

// onBeforeUnmount(turnOffTimer);
</script>

<style lang="scss" scoped>
.lottery-union {
}
</style>
