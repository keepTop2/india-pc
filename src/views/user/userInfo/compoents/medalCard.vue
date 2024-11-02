<template>
	<div>
		<div class="title flex_space-between Text_s">
			<span>勋章</span>
			<span class="flex_space-between">
				<span class="canLightNum" v-if="canLightNum > 0">{{ canLightNum }}</span>
				<svg-icon name="arrow_right" size="12px" @click="emit('update:modelValue', true)"></svg-icon>
			</span>
		</div>
		<div class="medalList">
			<div v-for="item in medalList" class="item" @click="handleClick(item)">
				<li v-if="item.lockStatus == 0"></li>
				<div class="bg" v-if="item.lockStatus == 0"></div>
				<img :src="item.lockStatus == 1 ? item.activatedPicUrl : item.inactivatedPicUrl" alt="" :class="item.lockStatus === 0 ? 'animation' : ''" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import router from "/@/router";
import { MedalApi } from "/@/api/medal";
const props = defineProps({
	medalList: [] as any,
	canLightNum: Number,
});
const emit = defineEmits(["updateList", "update:modelValue"]);
const handleClick = (item: any) => {
	if (item.lockStatus === 0) {
		MedalApi.lightUpMedal({
			medalCode: item.medalCode,
		}).then((res) => {
			emit("updateList");
		});
	}
};
</script>

<style scoped lang="scss">
.title {
	height: 34px;
	font-size: 14px;
	padding: 7px 12px;
	background: url("../image/titleBg.png") no-repeat;
	background-size: 100% 100%;
	position: relative;
}
.title::before {
	position: absolute;
	content: "";
	left: 0;
	top: 50%;
	background: var(--Theme);
	transform: translateY(-50%);
	border-radius: 0 10px 10px 0;
	width: 3px;
	height: 16px;
}
.canLightNum {
	background-color: var(--Theme);
	font-size: 10px;
	width: 15px;
	height: 15px;
	display: inline-block;
	line-height: 15px;
	text-align: center;
	border-radius: 50%;
	margin-top: 1px;
}
.medalList {
	display: flex;
	justify-content: space-around;
	padding: 15px 0;
	background: var(--Bg1);

	.item {
		position: relative;

		img {
			width: 47px;
			height: 51px;
			z-index: 100;
			display: inline-block;
		}

		.bg {
			position: absolute;
			top: -9.5px;
			left: -11.5px;
			transform: translate(-50%, 0%);
			width: 70px;
			height: 70px;
			display: flex;
			align-items: center;
			justify-content: center;
			background: url("../image/light_bg.png") no-repeat;
			background-position-x: center;
			background-position-y: bottom;
			background-repeat: no-repeat;
			background-size: 70px 70px;
			/* 添加旋转和缩放动画 */
			animation: rotateIcon 4s linear infinite;
		}
		li {
			position: absolute;
			width: 7.826px;
			height: 7.826px;
			background: var(--Theme);
			border: 1px solid var(--Text1);
			border-radius: 50%;
			top: 0;
			right: 0;
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
