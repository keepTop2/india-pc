<template>
	<div class="nodata">
		<img src="/src/assets/common/nodata.png" alt="" />
		<div>{{ info || t(`user['哎呀！暂无消息记录！']`) }}</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
defineProps({
	info: {
		type: String,
	},
});
</script>

<style scoped lang="scss">
.nodata {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	gap: 10px;
	background: var(--Bg-1-1, #24262b);
	margin-top: 14px;
	border-radius: 12px;
	img {
		width: 142px;
		height: 120px;
	}

	div {
		color: var(--Text-2-1, #656e78);
		text-align: center;
		font-family: "PingFang SC";
		font-size: 14px;
	}
}
</style>
