<template>
	<div class="tabs_content">
		<div class="tab tab_active">滚球</div>
		<div class="tab">未开赛</div>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.tabs_content {
	width: 141px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 3px;
	padding: 3px;
	background: var(--Bg2);

	.tab {
		min-width: 66px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 3px;
		background: var(--butter);
		color: var(--Text1);
		font-family: "PingFang SC";
		font-size: 12px;
		font-weight: 400;
		cursor: pointer;
	}

	.tab_active {
		background: var(--Theme);
		color: var(--Text_a);
	}
}
</style>
