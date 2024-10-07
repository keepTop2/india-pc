<template>
	<Skeleton>
		<!-- 骨架屏的占位内容 -->
		<template #skeleton>
			<SkeletonList />
		</template>
		<!-- 默认内容：动态加载选中的组件 -->
		<template #default>
			<component v-show="leagues && selectedComponent" :is="selectedComponent" :listData="leagues" :matchedLeague="matchedLeague" />
		</template>
	</Skeleton>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, defineAsyncComponent, onBeforeUnmount } from "vue"; // 引入Vue相关API
import { useRoute } from "vue-router"; // 引入路由API
import pubsub from "/@/pubSub/pubSub"; // 引入pub/sub模式的实现
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData"; // 引入体育数据处理函数
import SkeletonList from "/@/views/sports/layout/components/SkeletonList/SkeletonList.vue"; // 引入骨架屏组件

const route = useRoute(); // 获取当前路由实例

// 懒加载不同球类的组件
const sportsMap: Record<number, ReturnType<typeof defineAsyncComponent>> = {
	1: defineAsyncComponent(() => import(/* webpackChunkName: "football" */ "/@/views/sports/tournamentViews/football/football.vue")), // 足球
	2: defineAsyncComponent(() => import(/* webpackChunkName: "basketball" */ "/@/views/sports/tournamentViews/basketball/basketball.vue")), // 篮球
	3: defineAsyncComponent(() => import(/* webpackChunkName: "americanSoccer" */ "/@/views/sports/tournamentViews/americanSoccer/americanSoccer.vue")), // 美国足球
	4: defineAsyncComponent(() => import(/* webpackChunkName: "iceHockey" */ "/@/views/sports/tournamentViews/iceHockey/iceHockey.vue")), // 冰球
	5: defineAsyncComponent(() => import(/* webpackChunkName: "tennis" */ "/@/views/sports/tournamentViews/tennis/tennis.vue")), // 网球
	6: defineAsyncComponent(() => import(/* webpackChunkName: "volleyball" */ "/@/views/sports/tournamentViews/volleyball/volleyball.vue")), // 排球
	7: defineAsyncComponent(() => import(/* webpackChunkName: "billiards" */ "/@/views/sports/tournamentViews/billiards/billiards.vue")), // 台球
	8: defineAsyncComponent(() => import(/* webpackChunkName: "baseball" */ "/@/views/sports/tournamentViews/baseball/baseball.vue")), // 棒球
	9: defineAsyncComponent(() => import(/* webpackChunkName: "badminton" */ "/@/views/sports/tournamentViews/badminton/badminton.vue")), // 羽毛球
	43: defineAsyncComponent(() => import(/* webpackChunkName: "eSports" */ "/@/views/sports/tournamentViews/eSports/eSports.vue")), // 电子竞技
};

// 计算属性：获取已处理好的联赛数据
const leagues = computed(() => {
	const data = viewSportPubSubEventData.getSportData(); // 获取体育数据
	if (data.length > 0) {
		pubsub.publish("SkeletonLoading", false); // 数据加载完成，关闭骨架屏
	}
	return data; // 返回联赛数据
});

// 用于存储匹配的联赛数据
const matchedLeague = ref<any[]>([]); // 初始化为一个空数组

// 根据路由的 sportType 查询对应的组件
const selectedComponent = computed(() => {
	const sportType = Number(route.query.sportType); // 获取当前 sportType
	return sportsMap[sportType] || null; // 返回对应的组件，若无则返回 null
});

// 监听 route.query.sportType 的变化，清空匹配的联赛数据
watch(
	() => route.query.sportType,
	() => {
		matchedLeague.value = []; // 当 sportType 变化时清空匹配的联赛数据
	}
);

// 选择过滤联赛的函数
const selectFilterLeague = (value: number) => {
	if (value > 0) {
		const result = leagues.value?.find((league: any) => league.leagueId === value); // 查找匹配的联赛
		matchedLeague.value = result ? [result] : []; // 存储匹配的联赛数据，或设置为空数组
	} else {
		matchedLeague.value = []; // 若值小于等于0，清空匹配的联赛数据
	}
};

// 组件挂载后订阅选择联赛的事件
onMounted(() => {
	pubsub.subscribe("selectFilterLeague", selectFilterLeague); // 订阅过滤联赛的事件
});

// 组件卸载前取消订阅
onBeforeUnmount(() => {
	pubsub.unsubscribe("selectFilterLeague", selectFilterLeague); // 取消订阅过滤联赛的事件
});
</script>

<style scoped></style>
