<template>
	<div class="activityContent">
		<div class="activityContentHeader" :style="{ background: `url(${Common.getThemeImgPath('activityContentHeader.png')}) no-repeat`, backgroundSize: '100% 100%' }">
			<div class="flex-center">
				<img :src="Common.getThemeImgPath('activityContentHeaderLeft.svg')" alt="" />
				<span>{{ $t(`activity['活动规则']`) }}</span>
				<img :src="Common.getThemeImgPath('activityContentHeaderRight.svg')" alt="" />
			</div>
		</div>
		<div class="activityContentCenter" :style="{ background: `url(${Common.getThemeImgPath('activityContentCenter.png')}) no-repeat`, backgroundSize: '100% 100%' }">
			<div class="ruleDetails">
				<div v-html="rule"></div>
			</div>
		</div>
		<div class="activityContentFooter" :style="{ background: `url(${Common.getThemeImgPath('activityContentFooter.png')}) no-repeat `, backgroundSize: '100% 100%' }"></div>
	</div>
</template>

<script setup lang="ts">
import Common from "/@/utils/common";
import "./common.scss";
const props = defineProps({
	rule: {
		type: String,
	},
});
</script>

<style scoped lang="scss">
.ruleDetails {
	:deep(img) {
		max-width: 100%;
	}
}
</style>
