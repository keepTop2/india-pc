<template>
	<div class="sports-container">
		<div class="content">
			<div class="sportsShopCart">
				<template v-if="!ShopCatControlStore.getShopCatClose">
					<!-- 赛事购物车 -->
					<ShopCart v-if="shopCartTyp == `league`"></ShopCart>
					<!-- 冠军购物车 -->
					<ChampionCart v-if="shopCartTyp == `champion`"></ChampionCart>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ShopCart, ChampionCart } from "./components/index";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
const ShopCatControlStore = useShopCatControlStore();

/** 获取购物车类型 */
const shopCartTyp = computed(() => {
	return ShopCatControlStore.getShopCartType;
});
</script>

<style lang="scss" scoped>
.sports-container {
	position: fixed;
	bottom: 0;
	z-index: 2;

	.content {
		position: relative;
		.sportsShopCart {
			position: absolute;
			left: 205px;
			bottom: 0px;
			display: flex;
			justify-content: center;
		}
	}
}
</style>
