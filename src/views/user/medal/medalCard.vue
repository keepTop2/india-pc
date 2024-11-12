<template>
	<div>
		<div class="medalList">
			<div v-for="item in medalList" class="item curp" @click="handleClick(item)">
				<div class="bg2"></div>
				<li v-if="item.lockStatus == 0"></li>
				<div class="bg" v-if="item.lockStatus == 0"></div>
				<img :src="item.lockStatus == 1 ? item.activatedPicUrl : item.inactivatedPicUrl" alt="" :class="item.lockStatus === 0 ? 'animation' : ''" />
				<div class="name">{{ item.medalNameI18 }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { MedalApi } from "/@/api/medal";

const props = defineProps({
	medalList: [] as any,
});
const emit = defineEmits(["gotoDetails", "updateList"]);

const handleClick = (item: any) => {
	if (item.lockStatus === 0) {
		MedalApi.lightUpMedal({
			medalCode: item.medalCode,
		}).then((res) => {
			emit("updateList");
		});
	} else {
		emit("gotoDetails", item);
	}
};
</script>

<style scoped lang="scss">
.medalList {
	display: flex;
	padding: 0 0 15px 0;
	flex-wrap: wrap;
	gap: 15px;
	.item {
		position: relative;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		height: 117px;
		width: calc(25% - 11.5px);

		.bg2 {
			height: 96px;
			width: 100%;
			position: absolute;
			bottom: 0;
			background: var(--Bg-1);
			z-index: -1;
			border-radius: 12px;
		}
		.name {
			width: 100%;
			text-align: center;
			font-size: 12px;
			color: var(--Text-2);
		}
		img {
			width: 70px;
			height: 76px;
			z-index: 100;
			display: inline-block;
		}

		.bg {
			position: absolute;
			top: -6px;
			left: 0;
			transform: translate(-50%, -50%);
			width: 98px;
			height: 98px;
			display: flex;
			align-items: center;
			justify-content: center;
			background: url("../userInfo/image/light_bg.png") no-repeat;
			background-position-x: center;
			background-position-y: bottom;
			background-repeat: no-repeat;
			background-size: 98px 98px;
			/* 添加旋转和缩放动画 */
			animation: rotateIcon 4s linear infinite;
		}
		li {
			position: absolute;
			width: 10px;
			height: 10px;
			background: var(--Theme);
			border: 1px solid var(--Text-1);
			border-radius: 50%;
			top: 0;
			right: 10px;
		}
		.animation {
			animation: scaleIcon 1.5s ease-in-out infinite;
		}
	}
}
@keyframes rotateIcon {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(180deg);
	}
}
/* 缩放动画 */
@keyframes scaleIcon {
	0%,
	100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.13);
	}
}
</style>
