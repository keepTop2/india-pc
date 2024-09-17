<template>
	<div class="sportsShopCart">
		<template v-if="!ShopCatControlStore.getShopCatClose">
			<ShopCart v-if="shopCartTyp == `league`"></ShopCart>
			<ChampionCart v-if="shopCartTyp == `champion`"></ChampionCart>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, nextTick, watchEffect } from "vue";
import { useMenuStore } from "/@/stores/modules/menu";
import { ShopCart, ChampionCart } from "./components/index";

import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useChampionShopCartStore } from "/@/stores/modules/sports/championShopCart";
import { useUserStore } from "/@/stores/modules/user";

const ShopCatControlStore = useShopCatControlStore();
const SportsBetEventStore = useSportsBetEventStore();
const ChampionShopCartStore = useChampionShopCartStore();
const UserStore = useUserStore();

/** 获取购物车类型 */
const shopCartTyp = computed(() => {
	return ShopCatControlStore.getShopCartType;
});

watch(
	() => UserStore.getUserInfo?.token,
	(newValue, oldValue) => {
		if (!newValue) {
			/** 清楚购物车所有参数*/
			SportsBetEventStore.clearShopCart();
			SportsBetEventStore.setOddsOptionMassge(0);
			ChampionShopCartStore.clearOutrightShopCart();
		}
	}
);

const MenuStore = useMenuStore();

onMounted(() => {});
onUnmounted(() => {}); //离开页面时移除监听事件
</script>

<style lang="scss" scoped>
.sportsShopCart {
	position: absolute;
	bottom: 0px;
	left: 50%;
	transform: translate(-50%, 0px);
}
</style>
