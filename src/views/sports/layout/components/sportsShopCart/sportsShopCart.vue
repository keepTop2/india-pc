<template>
	<div class="sportsShopCart">
		<template v-if="!ShopCatControlStore.getShopCatClose">
			<ShopCart v-if="shopCartTyp == `league`"></ShopCart>
			<ChampionCart v-if="shopCartTyp == `champion`"></ChampionCart>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { ShopCart, ChampionCart } from "./components/index";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
const ShopCatControlStore = useShopCatControlStore();
const sportsBetEvent = useSportsBetEventStore();

/** 获取购物车类型 */
const shopCartTyp = computed(() => {
	return ShopCatControlStore.getShopCartType;
});
</script>

<style lang="scss" scoped>
.sportsShopCart {
	position: absolute;
	bottom: 0px;
	left: 50%;
	transform: translate(-50%, 0px);
}
</style>
