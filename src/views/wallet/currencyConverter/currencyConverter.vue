<template>
	<div>
		<Card :header="dialogType ? false : true" :class="{ half_round_corner: dialogType }">
			<template #header>
				<div class="header">{{ $t(`wallet['平台币转换']`) }}</div>
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

const props = withDefaults(
	defineProps<{
		dialogType?: boolean;
	}>(),
	{
		dialogType: false, // 设置默认值为 false
	}
);
</script>

<style scoped lang="scss">
.half_round_corner {
	border-radius: 0px 0px 12px 12px;
}
.header {
	padding-bottom: 6px;
	border-bottom: 1px solid var(--Line-1);
	box-shadow: 0px 1px 0px 0px #343d48;
	color: var(--Text-s);
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
