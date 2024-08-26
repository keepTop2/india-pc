<!--
 * @Author: WangMingxin
 * @Description:购物车内容区域-定位
-->
<template>
	<div class="sportsShopCart">
		<div class="left" :class="collapse ? 'collapse' : ''"></div>
		<div class="right">
			<div class="placeholder_plan">
				<div class="centent-main">
					<div class="shopCart-position">
						<div class="reset_position" v-if="!ShopCatControlStore.getShopCatClose">
							<ShopCart v-if="shopCartTyp == `league`"></ShopCart>
							<ChampionCart v-if="shopCartTyp == `champion`"></ChampionCart>
						</div>
					</div>
				</div>
				<div class="centent-right"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, nextTick, watchEffect } from "vue";
import { useMenuStore } from "/@/stores/modules/menu";
import { ShopCart, ChampionCart } from "./components/index";

import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useChampionShopCartStore } from "/@/stores/modules/sports/championShopCart";
import { useSportSortStore } from "/@/stores/modules/sports/sportSort";
import { useUserStore } from "/@/stores/modules/user";

const ShopCatControlStore = useShopCatControlStore();
const SportsBetEventStore = useSportsBetEventStore();
const ChampionShopCartStore = useChampionShopCartStore();
const UserStore = useUserStore();
const SportSortStore = useSportSortStore();

/** 获取购物车类型 */
const shopCartTyp = computed(() => {
	return ShopCatControlStore.getShopCartType;
});

// watchEffect(() => {
// 	/** 清楚购物车所有参数*/
// 	if (!UserStore.getUserInfo && !UserStore.getUserInfo?.token) {
// 		SportsBetEventStore.clearShopCart();
// 		SportSortStore.clearHotLeagueList();
// 		SportsBetEventStore.setOddsOptionMassge(0);
// 		ChampionShopCartStore.clearOutrightShopCart();
// 	}
// });

watch(
	() => UserStore.getUserInfo?.token,
	(newValue, oldValue) => {
		if (!newValue) {
			/** 清楚购物车所有参数*/
			SportsBetEventStore.clearShopCart();
			SportSortStore.setIsActiveHot(false);
			SportSortStore.clearHotLeagueList();

			SportsBetEventStore.setOddsOptionMassge(0);
			ChampionShopCartStore.clearOutrightShopCart();
		}
	}
);

const MenuStore = useMenuStore();
/** 左侧菜单占位 */
const collapse = computed(() => {
	const val = MenuStore.getCollapse;
	return val;
});
onMounted(() => {});
onUnmounted(() => {}); //离开页面时移除监听事件
</script>

<style lang="scss" scoped>
.sportsShopCart {
	position: fixed;
	width: 100%;
	height: 3px;
	z-index: 1;
	left: 0px;
	bottom: 0px;
	display: flex;
	justify-content: center;
	// background: red;

	.left {
		width: 260px;
		// background: #ccc;

		&.collapse {
			width: 64px;
			overflow-x: hidden;
		}
	}

	.right {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;

		.placeholder_plan {
			width: 100%;
			height: 2px;
			position: relative;
			display: flex;
			padding: 0 12px;

			.centent-main {
				flex: 1;
				// background: rgb(233, 249, 0);
				position: relative;

				.shopCart-position {
					position: absolute;
					width: 520px;
					// height: 60px;
					left: 50%;
					bottom: 0px;
					z-index: 1000;
					transform: translate(-50%, 0);
					//background: red;
					overflow: hidden;

					.reset_position {
						position: relative;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						width: 520px;
						height: auto;
						// height: 60px;
						// background-color: rgb(43, 112, 173);
					}
				}
			}

			.centent-right {
				width: 390px;
				// background-color: aqua;
			}
		}
	}
}
</style>
