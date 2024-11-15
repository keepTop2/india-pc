<template>
	<div class="activityWrapper" :style="{ background: `url(${Common.getThemeImgPath('activityWrapperBg.png')})`, backgroundSize: '100% 100%' }">
		<div class="activityHeader">
			{{ title }}
			<span class="closeIcon curp" @click="useModalStore().closeModal"><img src="./image/close_icon.png" alt="" /></span>
		</div>
		<div class="activityMain">
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useModalStore } from "/@/stores/modules/modalStore";
import Common from "/@/utils/common";
import "./common.scss";
const props = defineProps({
	title: {
		type: String,
	},
});
</script>

<style scoped lang="scss">
.activityWrapper {
	background-size: 100% 100%;
	overflow: hidden;
	border-radius: 12px;
	.activityHeader {
		background: url("../activityType/image/header_bg.png") center no-repeat;
		background-size: 100% 34px;
		height: 54px;
		width: 366px;
		margin: 10px auto 10px;
		text-align: center;
		line-height: 54px;
		font-size: 16px;
		font-weight: 600;
		color: var(--Text-a);
		position: relative;
		.closeIcon {
			position: absolute;
			right: -30px;
			top: -1px;
			img {
				width: 30px;
				height: 30px;
			}
		}
	}
}
</style>
