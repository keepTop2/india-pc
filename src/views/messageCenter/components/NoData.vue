<template>
	<div class="nodata">
		<img src="/src/assets/common/nodata.png" alt="" />
		<div>{{ info }}</div>
	</div>
</template>

<script setup lang="ts">
defineProps({
	info: {
		type: String,
		default: "哎呀！暂无消息记录！",
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
	img {
		width: 142px;
		height: 120px;
	}

	div {
		color: var(--light-ok-Text-2-1, #656e78);
		text-align: center;
		font-family: "PingFang SC";
		font-size: 14px;
	}
}
</style>
