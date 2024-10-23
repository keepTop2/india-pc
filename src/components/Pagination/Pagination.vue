<template>
	<div class="pagination-wrapper">
		<el-config-provider :locale="zhCn">
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="currentPage"
				popper-class="paginationPop"
				:page-size="pageSize"
				layout=" prev, pager, next,sizes, jumper"
				:total="total"
			>
			</el-pagination>
		</el-config-provider>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";

const props = defineProps<{
	currentPage: number;
	pageSize: number;
	total: number;
}>();

const emit = defineEmits(["update:currentPage", "prevClick", "nextClick", "sizeChange"]);

const currentPage = computed({
	get: () => props.currentPage,
	set: (value) => {
		console.log(value, "----value");
		emit("update:currentPage", value);
	},
});

const totalPages = computed(() => Math.ceil(props.total / props.pageSize));

const handleCurrentChange = (page: number) => {
	currentPage.value = page;
};

const handleSizeChange = (pageSize: number) => {
	emit("sizeChange", pageSize);
};

watch([() => props.total, () => props.pageSize], () => {
	if (currentPage.value > totalPages.value) {
		currentPage.value = totalPages.value;
	}
});
</script>

<style lang="scss">
.el-select__popper.el-popper.paginationPop {
	border: 0 !important;
}
.el-select__popper.el-popper {
	border: 0 !important;
}
.paginationPop {
	background-color: var(--Bg2);
	color: var(--Theme);
	border: 0 !important;

	.is-hovering {
		background-color: var(--light-ok-Butter);
		color: var(--Theme);
	}
	.el-select-dropdown__item.is-selected {
		color: var(--Theme);
	}
}
.pagination-wrapper {
	display: flex;
	justify-content: flex-end;
	.el-pagination {
		display: flex;
		align-items: center;
		.el-pager li.is-active {
			color: var(--Theme);
		}
		.el-pager {
			margin: 0 10px;
		}
		.el-pagination__jump {
			color: var(--Text2);
			.el-input {
				--el-input-text-color: var(--Text1);
			}
		}
		.el-select__placeholder {
			color: var(--Text1);
		}
		.el-select__wrapper {
			background-color: var(--Bg2);
			color: var(--light-ok-Text-1);
			box-shadow: none;
		}
		.el-input__wrapper {
			background-color: var(--Bg2);
			color: var(--Text1);
			box-shadow: none;
		}
		.btn-prev,
		.btn-next {
			background-color: var(--light-ok-Butter);
			color: var(--light-ok-Text-1);
			border: none;
			padding: 0 10px;
			height: 32px;
			line-height: 32px;
			border-radius: 4px;

			&:hover {
				color: var(--Theme);
			}

			&.disabled {
				color: var(--el-pagination-button-disabled-color);
				background-color: var(--el-pagination-button-disabled-bg-color);
			}
		}
		.el-pager li {
			background-color: var(--light-ok-Butter);
			color: var(--light-ok-Text-1);
			border: none;
			margin: 0 2px;
			min-width: 32px;
			height: 32px;
			line-height: 32px;
			border-radius: 4px;

			&.active {
				background-color: var(--el-color-primary);
				color: var(--el-color-white);
			}

			&:hover {
				color: var(--Theme);
			}
		}
	}

	.pagination-info {
		display: flex;
		align-items: center;
		margin-left: 20px;
		font-size: 14px;
		color: var(--el-text-color-regular);

		.total-value,
		.page-value {
			font-weight: bold;
			margin: 0 4px;
		}

		.separator {
			margin: 0 10px;
			color: var(--el-border-color-lighter);
		}
	}
}
</style>
