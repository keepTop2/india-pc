<template>
	<div class="wrapper3">
		<div class="flex_space-between Text_s p_24">
			<svg-icon name="common-arrow_left" width="13px" height="24px" class="curp" @click="emit('update:modelValue', 1)"></svg-icon>
			<span class="fs_18">勋章详情</span>
			<svg-icon name="common-close" size="30px" class="curp" @click="useModalStore().closeModal()"></svg-icon>
		</div>
		<div class="center">
			<img src="./image/light_bg.png" alt="" class="bg" />
			<img src="./image/light.png" alt="" class="bg2" />
			<div>
				<img :src="currentMedal.lockStatus == 1 ? currentMedal.activatedPicUrl : currentMedal.inactivatedPicUrl" alt="" class="icon" />
			</div>
		</div>
		<div class="Desc">
			<div class="mb_14">{{ currentMedal.unlockTime ? currentMedal.unlockTime + "获得" : "" }}</div>
			<div v-html="currentMedal.medalDescI18"></div>
		</div>
		<div class="p_24">
			<div class="cell flex_space-between">
				<span>奖励</span>
				<span class="Text_s">{{ useUserStore().getUserInfo.platCurrencySymbol }} {{ currentMedal.rewardAmount }}</span>
			</div>
			<div class="line"></div>
			<div class="cell flex_space-between">
				<span>流水倍数</span>
				<span class="Text_s">{{ currentMedal.typingMultiple }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useUserStore } from "/@/stores/modules/user";
import { useModalStore } from "/@/stores/modules/modalStore";
const props = defineProps({
	currentMedal: {} as any,
});
const emit = defineEmits(["update:modelValue"]);
</script>

<style scoped lang="scss">
.wrapper3 {
	width: 480px;
	height: 720px;
	overflow-y: auto;
	border-radius: 12px;
	background: url("./image/wrapper3.png") no-repeat;
	background-size: 100% auto;
	position: relative;
	.center {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding-top: 100px;
		.bg {
			position: absolute;
			top: 0;
			width: 100%;
			z-index: -1;
		}
		.bg2 {
			position: absolute;
			width: 294px;
			height: 295px;
			z-index: -1;
		}
		.icon {
			width: 175px;
			height: 190px;
		}
	}
	.Desc {
		margin-top: 80px;
		text-align: center;
		color: var(--Text-s);
		font-size: 14px;
	}
	.cell {
		padding: 12px 24px;
		color: var(--Text-1);
	}
}
</style>
