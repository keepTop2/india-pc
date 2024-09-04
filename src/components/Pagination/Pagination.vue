<template>
	<div class="mt_24">
		<el-pagination v-model:current-page="props.currentPage" v-model:page-size="props.pageSize" layout="slot" :total="total">
			<template #default>
				<div class="pagination">
					<span class="total">
						<i18n-t keypath="pagination['总计']" :tag="'span'">
							<template v-slot:value>
								<span class="value">{{ total }}</span>
							</template>
						</i18n-t>
					</span>

					<div class="container">
						<div class="left" @click="prevClick">
							<SvgIcon style="transform: rotate(90deg)" class="icon" iconName="arrow" :size="24" />
						</div>
						<div class="value">{{ props.currentPage }}/{{ totalPages }}</div>
						<div class="right" @click="nextClick">
							<SvgIcon style="transform: rotate(-90deg)" class="icon" iconName="arrow" :size="24" />
						</div>
					</div>
				</div>
			</template>
		</el-pagination>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const emit = defineEmits(["currentChange", "prevClick", "nextClick"]);

const props = withDefaults(
	defineProps<{
		currentPage?: number;
		pageSize?: number;
		total?: number;
	}>(),
	{ total: 0, pageSize: 10 }
);

const totalPages = ref(Math.ceil(props.total / props.pageSize));
watch([() => props.total, () => props.pageSize], () => {
	totalPages.value = Math.ceil(props.total / props.pageSize);
});

const prevClick = () => {
	emit("prevClick");
};
const nextClick = () => {
	emit("nextClick", totalPages.value);
};
</script>

<style scoped lang="scss">
.pagination {
	display: flex;
	align-items: center;
	.total {
		color: var(--Text2_1);

		font-family: "PingFang SC";
		font-size: 14px;
		font-weight: 400;

		.value {
			margin: 0px 4px;
			color: var(--Text_s);
		}
	}

	.container {
		display: flex;
		margin-left: 16px;
		.left,
		.right {
			width: 36px;
			height: 36px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 4px;
			background: var(--Bg1);
			cursor: pointer;
		}

		.value {
			width: 70px;
			height: 36px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0px 4px;
			border-radius: 4px;
			background: var(--Bg2);
			color: var(--Text1);
			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 400;
		}
	}
}

:deep(.el-pagination) {
	justify-content: end;
}
</style>
