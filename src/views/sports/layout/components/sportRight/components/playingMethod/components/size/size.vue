<template>
	<!-- 全场大小 -->
	<div class="field-size">
		<div class="title-sub">
			{{ title }}
		</div>
		<div class="grid-box">
			<div class="item" v-for="(item, index) in fieldSizeList" :class="item.class" :key="index">
				{{ item.name }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	title: string;
	fieldSizeList: {
		name: string;
		class: string;
	}[];
}>();
</script>

<style scoped lang="scss">
.field-size {
	background: var(--Bg4);

	.grid-box {
		display: grid;
		grid-template-columns: 62px 1fr 1fr;
		gap: 2px;
		padding: 2px;

		.item {
			height: 44px;
			text-align: center;
			border-radius: 4px;
			line-height: 44px;
			font-size: 14px;
		}

		.title {
			height: 30px !important;
			line-height: 30px !important;
			color: var(--Text1);
		}

		.label {
			color: var(--Text1);
			background-color: var(--Bg1);
		}

		.value {
			color: var(--Text_s);
			background-color: var(--Bg3);
		}
	}

	.title-sub {
		font-size: 16px;
		display: flex;
		align-items: center;
		gap: 8px;
		padding-top: 9px;
		margin-bottom: 7px;
		color: var(--Text_s);

		&::before {
			content: "";
			display: inline-block;
			border-radius: 0px 4px 4px 0px;
			width: 4px;
			height: 22px;
			background-color: var(--Theme);
		}
	}
}
</style>
