<!--
 * @Author: WangMingxin
 * @Description: Select 指向图标；
-->
<template>
	<div class="SvgIcon">
		<SvgIcon class="icon" iconName="arrow" :size="28" />
	</div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.SvgIcon {
	:deep() {
		.icon {
			width: 24px;
			height: 24px;
		}
	}
}
</style>
