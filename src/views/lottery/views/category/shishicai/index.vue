<template>
	<div class="lottery-shishicai">
		<!-- 头部 -->
		<LotteryHeader />
	</div>
</template>

<script setup lang="ts">
import useLotteryHeader from "/@/views/lottery/components/LotteryHeader/Index";

const { LotteryHeader, startTime, pauseTime, resetTime } = useLotteryHeader({ seconds: 68, immediate: false });
</script>

<style lang="scss" scoped>
.lottery-shishicai {
	width: 1308px;
	margin: 0 auto;
	margin-top: 24px;
	background-color: var(--Bg1);
	border-radius: 12px;
}
</style>
