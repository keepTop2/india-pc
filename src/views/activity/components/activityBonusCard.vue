<template>
	<div class="activityContent" v-if="activityData.participationMode == 0">
		<div class="bonus_card">
			<div class="bonus_card_title">红利赠送</div>
			<div class="bonus_card_content">
				<div>
					<div class="fs_12">存款金额</div>
					<div class="amount fs_14">{{ activityData.depositAmount || "0.00" }} {{ activityData.depositCurrencyCode }}</div>
				</div>
				<div class="line"></div>
				<div>
					<div class="fs_12">需打流水</div>
					<div class="amount fs_14">{{ activityData.runningWater || "0.00" }} {{ activityData.runningWaterCurrencyCode }}</div>
				</div>
			</div>
			<div class="bonus_card_footer">
				可得彩金: <span class="color_Theme">{{ activityData.activityAmount || "0.00" }}{{ activityData.activityAmountCurrencyCode }}</span>
			</div>
			<div class="apply_btn">
				<div class="curp" :class="activityData.status == 10000 ? 'active' : ''" @click="emit('apply')">{{ activityData.status == 30047 ? "您已申请" : "立即申请" }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	activityData: {
		type: {} as any,
	},
});
const emit = defineEmits(["apply"]);
</script>

<style scoped></style>
