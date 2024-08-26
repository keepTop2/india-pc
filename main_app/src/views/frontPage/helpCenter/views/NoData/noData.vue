<template>
	<div class="content">
		<img :src="noData" alt="" />
		<p>暂无数据</p>
	</div>
</template>

<script setup lang="ts">
import noData from '/@/assets/my/financialDetails/noData.png';
</script>

<style lang="scss" scoped>
.content {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	height: 100%;
	img {
		width: 205px;
		height: 142px;
	}
}
</style>
