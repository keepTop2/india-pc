<template>
	<div class="activityContent">
		<div class="activityContentHeader" :style="{ background: `url(${Common.getThemeImgPath('activityContentHeader.png')}) no-repeat`, backgroundSize: '100% 100%' }">
			<div class="flex-center">
				<img :src="Common.getThemeImgPath('activityContentHeaderLeft.svg')" alt="" />
				<span>{{ $t(`activity['活动内容']`) }}</span>
				<img :src="Common.getThemeImgPath('activityContentHeaderRight.svg')" alt="" />
			</div>
		</div>
		<div class="activityContentCenter" :style="{ background: `url(${Common.getThemeImgPath('activityContentCenter.png')}) no-repeat`, backgroundSize: '100% 100%' }">
			<div class="activityContentImg">
				<img src="./image/activityContentImg.png" alt="" />
			</div>
			<div class="contentCell">
				<div class="cellLabel">{{ $t(`activity['活动对象']`) }}</div>
				<div class="cellValue">{{ activityData.userTypeText }}</div>
			</div>
			<div class="contentCell">
				<div class="cellLabel">{{ $t(`activity['活动时间']`) }}</div>
				<div class="cellValue" v-if="activityData.activityDeadline !== 1">
					{{ Common.parseTime(activityData.activityStartTime) }}～{{ Common.parseTime(activityData.activityEndTime) }}
				</div>
				<div class="cellValue" v-else>{{ $t(`activity['长期活动']`) }}</div>
			</div>
			<div class="contentCell">
				<div class="cellLabel">{{ $t(`activity['活动描述']`) }}</div>
				<div class="cellValue">
					{{ activityData.activityDescI18nCode }}
				</div>
			</div>
		</div>
		<div class="activityContentFooter" :style="{ background: `url(${Common.getThemeImgPath('activityContentFooter.png')}) no-repeat `, backgroundSize: '100% 100%' }"></div>
	</div>
</template>

<script setup lang="ts">
import Common from "/@/utils/common";
const props = defineProps({
	activityData: {
		type: {} as any,
	},
});
</script>

<style scoped></style>
