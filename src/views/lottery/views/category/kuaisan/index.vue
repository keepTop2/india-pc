<template>
	<Containers class="lottery-shishicai">
		<!-- 标签栏 -->
		<div class="tabs">
			<!-- 循环渲染每个标签，基于当前选中的标签动态添加类名 -->
			<div :class="['tabs-item', tabsActived === index ? 'actived' : '']" @click="handleTabChange(index)" v-for="(item, index) in tabs" :key="item.id">
				{{ item.label }}
			</div>
		</div>

		<!-- 内容部分 -->
		<component :is="renderComponent" />
	</Containers>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import Containers from "/@/views/lottery/components/Containers/index.vue";
import { usePageInit } from "/@/views/lottery/hooks/usePageInit";
import { useTab } from "/@/views/lottery/hooks/useTab";

const BayLottery = defineAsyncComponent(() => import("./components/bayLottery.vue"));
const Result = defineAsyncComponent(() => import("./components/result.vue"));

// 标签栏的配置数据
const { tabs, tabsActived, handleTabChange } = useTab(BayLottery, Result);
usePageInit(); // 这个 hook 是重点。主要就是 onMounted onBeforeUnmount watch 里面需要做的事情

const renderComponent = computed(() => {
	const item = tabs[tabsActived.value || 0];
	return item.component;
});
</script>
