<!--
 * @Author: Relax
 * @Description: 帮助中心-左侧导航
-->
<template>
	<div class="container">
		<div class="bg">
			<span>{{ $t(`bettingRules['竞猜规则']`) }}</span>
		</div>
		<div class="profile">
			<div class="left-navigation">
				<!-- 左侧导航菜单 -->
				<el-menu class="el-menu-vertical-demo" :default-active="$route.path">
					<el-menu-item
						v-for="childRoute in menuList"
						:key="childRoute.path"
						:index="childRoute.path"
						:class="{ 'is-active': $route.path === childRoute.path }"
						@click="$router.push(childRoute.path)"
					>
						<span class="title">{{ childRoute.meta.title }}</span>
					</el-menu-item>
				</el-menu>
			</div>

			<div class="right-navigation">
				<router-view />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
import { usePopularLeague } from "/@/stores/modules/sports/popularLeague";
const ShopCatControlStore = useShopCatControlStore();

const SportAttentionStore = useSportAttentionStore();
SportAttentionStore.hintHotLeague();

const popularLeague = usePopularLeague();
/*隐藏热门联赛*/
popularLeague.hidePopularLeague();

const router = useRouter();
const route = useRoute();

const menuList = computed(() => {
	let findRoute = route.matched.find((item) => item.name === "sportsBettingRules");
	console.log("=>(bettingRules.vue:42) findRoute", findRoute);
	return findRoute?.children || [];
});

// 处理浏览器返回键事件
const handleBackButton = (event: PopStateEvent) => {
	event.preventDefault();
	router.replace({ name: "home" });
};

// 在页面组件挂载后添加事件监听器
onMounted(() => {
	ShopCatControlStore.setShopCatClose(true);
	window.addEventListener("popstate", handleBackButton);
	window.scrollTo(0, 0);
});

// 在页面组件卸载前移除事件监听器
onBeforeUnmount(() => {
	window.removeEventListener("popstate", handleBackButton);
	ShopCatControlStore.setShopCatClose(false);
});
</script>

<style lang="scss" scoped>
@import url("./bettingRules.scss");
</style>
