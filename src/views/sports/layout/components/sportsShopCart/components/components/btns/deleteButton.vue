<template>
	<div class="container" @click="onClickClear">
		<svg-icon name="sports-cart-delete_icon" size="18px"></svg-icon>
	</div>
</template>

<script setup lang="ts">
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
const ShopCatControlStore = useShopCatControlStore();
const sportsBetEvent = useSportsBetEventStore();
// 定义 emit 事件
const emit = defineEmits<{
	(e: "onClick"): void;
}>();

// 关闭弹窗
const onClickClear = () => {
	sportsBetEvent.clearShopCart();
};
</script>

<style scoped lang="scss">
.container {
	width: 112px;
	height: 48px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 2px;
	border-radius: 4px;
	background-color: var(--Bg5);
	overflow: hidden;
	cursor: pointer;
}
</style>
