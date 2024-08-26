<template>
	<div class="card-status-container">
		<SvgIcon iconName="close2" size="20" class="icon close-bunch" @click="click_clear" />

		<div class="status">
			<SvgIcon iconName="success" size="30" v-if="betStatus == 0" />
			<SvgIcon iconName="fail" size="30" v-else />
			<span v-if="betStatus == 0" class="success">投注成功</span>
			<span v-else class="fail">投注失败</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";

import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
import { useChampionShopCartStore } from "/@/stores/modules/sports/championShopCart";
const ChampionShopCartStore = useChampionShopCartStore();
const ShopCatControlStore = useShopCatControlStore();
//  betStatus 注单状态
// 0 ：下注成功 ；1 ：下注失败

const props = withDefaults(
	defineProps<{
		/** 注单状态  0 ：下注成功 ；1 ：下注失败  */
		betStatus?: number;
	}>(),
	{
		betStatus: 0,
	}
);

const emits = defineEmits(["changeOrderStatus"]);

const sportsBetEvent = useSportsBetEventStore();
/**
 * @description 头部清空icon 事件
 */
const click_clear = () => {
	ChampionShopCartStore.clearOutrightShopCart();
	ShopCatControlStore.setShopCatShow(false);
	emits("changeOrderStatus", false);
};
</script>

<style scoped lang="scss">
.card-status-container {
	position: relative;

	.header-single {
		width: 100%;
		height: 40px;
		border-bottom: 1px solid #373a40;
		text-align: right;
		margin-bottom: 20px;
	}

	.close-bunch {
		position: absolute;
		right: 0;
		top: 15px;
		cursor: pointer;
		z-index: 999;
	}

	.status {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: 10px;
		position: relative;

		.success {
			@include themeify {
				color: themed("Theme");
			}
		}

		.fail {
			@include themeify {
				color: themed("Warn");
			}
		}
	}

	.single {
		flex-direction: column;
	}
}
</style>
