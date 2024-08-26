<template>
	<div class="container">
		<el-table :data="props.data" border :cell-class-name="'table-cell'" :header-cell-class-name="'table-header-cell'" style="width: 100%">
			<el-table-column prop="type" label="类型" width="169" align="center" :resizable="false">
				<template #default="scope">
					<div>{{ scope.row.type }}</div>
				</template>
			</el-table-column>

			<el-table-column prop="date" label="金额" width="344" align="center" :resizable="false">
				<template #default="scope">
					<div :class="scope.$index % 2 === 0 ? 'Success' : 'Danger'">
						<span class="mr_4">$</span>
						<span>{{ scope.row.date }}</span>
					</div>
				</template>
			</el-table-column>

			<el-table-column prop="name" label="时间" width="264" align="center" :resizable="false">
				<template #default="scope">
					<div>{{ Common.getDate() }}</div>
				</template>
			</el-table-column>

			<el-table-column prop="address" label="状态" width="171" align="center" :resizable="false">
				<template #default="scope">
					<div :class="scope.$index % 2 === 0 ? 'Success' : 'Danger'">{{ scope.row.address }}</div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script setup lang="ts">
import Common from '/@/utils/common';
const props = withDefaults(
	defineProps<{
		data?: {
			date: string;
			name: string;
			type: string;
			address: string;
		}[];
	}>(),
	{}
);
</script>

<style scoped lang="scss">
.container {
	:deep(.el-table) {
		border-radius: 4px 4px 0px 0px;
		background-color: transparent;

		.table-header-cell {
			height: 44px;
			min-height: 44px;
			@include themeify {
				border-right-color: themed('Bg4');
				border-bottom-color: themed('Bg3');
				color: themed('Text1');
			}
			font-family: 'PingFang SC';
			font-size: 14px;
			font-weight: 400;
		}

		.table-cell {
			height: 44px;
			min-height: 44px;
			@include themeify {
				border-color: themed('Bg3');
				color: themed('Text1');
			}
			font-family: 'PingFang SC';
			font-size: 14px;
			font-weight: 400;
		}

		th.el-table__cell {
			@include themeify {
				background-color: themed('Bg3');
			}
		}

		tr {
			background-color: transparent;
		}

		.el-table__row:hover {
			.el-table__cell {
				background-color: transparent;
			}
		}

		.el-table__inner-wrapper::after,
		.el-table__inner-wrapper::before,
		.el-table__border-left-patch {
			@include themeify {
				background-color: themed('Bg3');
			}
		}
	}
	:deep(.el-table--border::after),
	:deep(.el-table--border::before) {
		@include themeify {
			background-color: themed('Bg3');
		}
	}
}

.Success {
	@include themeify {
		color: themed('Theme');
	}
}

.Warning {
	@include themeify {
		color: themed('f1');
	}
}

.Danger {
	@include themeify {
		color: themed('Warn');
	}
}
</style>
