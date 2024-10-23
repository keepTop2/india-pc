<template>
	<div class="container" @click="onClickClose">
		<svg-icon name="sports-cart-add_icon" size="10px"></svg-icon>
		<span>串</span>
	</div>
</template>

<script setup lang="ts">
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
const ShopCatControlStore = useShopCatControlStore();
// 定义 emit 事件
const emit = defineEmits<{
	(e: "onClick"): void;
}>();

// 关闭弹窗
const onClickClose = () => {
	ShopCatControlStore.setShopCatShow(false);
	emit("onClick"); // 暴露事件出去
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
