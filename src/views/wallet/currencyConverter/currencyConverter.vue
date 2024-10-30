<template>
	<div>
		<Card :header="true">
			<template #header>
				<div class="header">{{ $t(`wallet['存款']`) }}</div>
			</template>
			<div class="container">
				<Transform />
				<el-button class="transform-button">一键转换</el-button>
			</div>
		</Card>
	</div>
</template>

<script setup lang="ts">
import Card from "/@/views/wallet/components/card.vue";
import Transform from "/@/views/wallet/currencyConverter/components/Transform.vue";
</script>

<style scoped lang="scss">
.header {
	padding-bottom: 6px;
	border-bottom: 1px solid var(--Line_1);
	box-shadow: 0px 1px 0px 0px #343d48;
	color: var(--Text_s);
	font-family: "PingFang SC";
	font-size: 24px;
	font-weight: 500;
}

.w_450 {
	max-width: 450px;
}

.container {
	padding: 20px;
	.transform-button {
		margin-top: 40px;
		width: 100%;
		height: 48px;
		padding: 16px 0px 16px 0px;
		border: none;
		gap: 10px;
		border-radius: 4px;
		background: var(--light-ok-Theme--, #ff284b);
		color: var(--light-ok-text-a, #ffffff);
		font-size: 16px;
	}
}
</style>
