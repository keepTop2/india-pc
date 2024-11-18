<template>
	<Containers :data="renderLotteryDetail" class="lottery-shishicai">
		<!-- 标签栏 -->
		<div class="tabs">
			<!-- 循环渲染每个标签，基于当前选中的标签动态添加类名 -->
			<div :class="['tabs-item', tabsActived === index ? 'actived' : '']" @click="handleTabChange(index)" v-for="(item, index) in tabs" :key="item.id">
				{{ item.label }}
			</div>
		</div>

		<!-- 内容部分 -->
		<component :is="renderComponent" :lottery-detail="lotteryDetail" />
	</Containers>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import iconPc from "./images/iconPc.png";
import Containers from "/@/views/lottery/components/Containers/index.vue";
import { usePageInit } from "/@/views/lottery/hooks/usePageInit";
import { useTab } from "/@/views/lottery/hooks/useTab";
import { useRoute } from "vue-router";

const route = useRoute();
const BayLottery = defineAsyncComponent(() => import("./components/bayLottery.vue"));
const Result = defineAsyncComponent(() => import("./components/result.vue"));
// 标签栏的配置数据
const { tabs, tabsActived, handleTabChange } = useTab(BayLottery, Result);
const { lotteryDetail } = usePageInit(); // 这个 hook 是重点。主要就是 onMounted onBeforeUnmount watch 里面需要做的事情

// 这里其实就是在 lotteryDetail 的基础上加了个彩种的图片。因为涉及单个业务彩种，因此不在 hook 里面处理
const lotteryIcons = {
	HTSSQ: new URL("/src/assets/zh-CN/lottery/HTSSQ.jpeg", import.meta.url).href,
	"5FSSQ": new URL("/src/assets/zh-CN/lottery/5FSSQ.jpeg", import.meta.url).href,
	"3FSSQ": new URL("/src/assets/zh-CN/lottery/3FSSQ.jpeg", import.meta.url).href,
};
const gameCode = route.query.gameCode as "HTSSQ" | "5FSSQ" | "3FSSQ";
const renderLotteryDetail = computed(() => {
	return { ...lotteryDetail.value, maxWin: route.query.maxWin || 0, iconPc: lotteryIcons[gameCode] };
});

const renderComponent = computed(() => {
	const item = tabs[tabsActived.value || 0];
	return item.component;
});
</script>
