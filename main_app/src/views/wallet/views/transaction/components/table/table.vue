<template>
	<div class="container">
		<el-table :data="tableData" border :cell-class-name="'table-cell'" :header-cell-class-name="'table-header-cell'" style="width: 100%">
			<el-table-column prop="type" label="类型" width="343" align="center" :resizable="false">
				<template #default="scope">
					<div>{{ scope.row.type }}</div>
				</template>
			</el-table-column>

			<el-table-column prop="date" label="金额" width="169" align="center" :resizable="false">
				<template #default="scope">
					<div :class="scope.$index % 2 === 0 ? 'Success' : 'Danger'">
						<span class="mr_4">$</span>
						<span>{{ scope.row.date }}</span>
					</div>
				</template>
			</el-table-column>

			<el-table-column prop="name" label="时间" width="264" align="center" :resizable="false">
				<template #default="scope">
					<div>{{ scope.row.name }}</div>
				</template>
			</el-table-column>

			<el-table-column prop="address" label="状态" width="172" align="center" :resizable="false">
				<template #default="scope">
					<div class="status" @click="onCheck(scope.row)">
						<span :class="scope.$index % 2 === 0 ? 'Success' : 'Danger'">{{ scope.row.address }}</span>
						<SvgIcon style="transform: rotate(-90deg)" iconName="arrow" :size="16" />
					</div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script setup lang="ts">
const emit = defineEmits(['check']);

const tableData = [
	{
		date: '100.00',
		name: '2024-04-06',
		type: '充值',
		address: '成功',
	},
	{
		date: '100.00',
		name: '2024-04-06',
		type: '充值',
		address: '失败',
	},
	{
		date: '100.00',
		name: '2024-04-06',
		type: '充值',
		address: '成功',
	},
	{
		date: '100.00',
		name: '2024-04-06',
		type: '充值',
		address: '失败',
	},
];

const onCheck = (row: any) => {
	emit('check', row);
};
</script>

<style scoped lang="scss">
.container {
	padding: 20px;
	border-radius: 8px;
	@include themeify {
		background: themed('Bg1');
	}

	.status {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		cursor: pointer;
	}

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
			height: 70px;
			min-height: 70px;
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
