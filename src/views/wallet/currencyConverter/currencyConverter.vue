<template>
	<div>
		<Card :header="true">
			<template #header>
				<div class="header">{{ $t(`wallet['存款']`) }}</div>
			</template>
			<div class="container">
				<Transform />
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
}
</style>
