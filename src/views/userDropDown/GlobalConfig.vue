<template>
	<div class="drop-right">
		<div class="safe">
			<div class="right-title">{{ $t(`userDropDown['安全设置']`) }}</div>
			<div class="right-content">
				<div class="text center">{{ $t(`userDropDown['修改密码']`) }}</div>
				<el-button class="btn" type="success" @click="modalVisible = true">{{ $t(`userDropDown['编辑']`) }}</el-button>
			</div>
		</div>
		<div class="device">
			<div class="right-title">{{ $t(`userDropDown['登录设备']`) }}</div>
			<div class="right-content">
				<div class="table-style">
					<el-table :data="tableData" border :cell-class-name="'table-cell'" :header-cell-class-name="'table-header-cell'">
						<el-table-column :label="$t(`userDropDown['设备']`)" align="center">
							<template #default="scope">
								<div class="col1">
									<span>{{ scope.row.loginDevice }}</span>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="loginAddress" :label="$t(`userDropDown['地点']`)" align="center" />
						<el-table-column prop="loginIp" :label="'IP' + $t(`userDropDown['地址']`)" align="center" />
						<el-table-column prop="loginTime" :label="$t(`userDropDown['最后登录时间']`)" align="center">
							<template #default="{ row }">
								<span>{{ formatTimestamp(row.loginTime) }}</span>
							</template>
						</el-table-column>
						<el-table-column :label="$t(`userDropDown['状态']`)" align="center">
							<template #default="{ row }">
								<div class="handle">
									<span v-if="row.status === 1">正在使用</span>
									<span v-else class="delete" @click="click_delDevice(row)">删除设备</span>
								</div>
							</template>
						</el-table-column>
						<template #empty>{{ $t(`common['暂无数据']`) }}</template>
					</el-table>
				</div>
			</div>
		</div>
	</div>
	<Modal v-model:visible="modalVisible" @close="modalVisible = false" />
</template>
<script setup lang="ts">
import Modal from "/@/views/userDropDown/components/Modal.vue";
import { reactive, ref } from "vue";
import { userApi } from "/@/api/user/user";
import { ElMessage } from "element-plus";

enum loginStatus {
	"未使用",
	"正在使用",
}

const modalVisible = ref(false);
const queryUserLoginDevice_params = reactive({
	pageNumber: 1,
	pageSize: 10,
});

const tableData = ref([]);

/**
 * @description 删除设备
 */
const click_delDevice = async (data) => {
	let params = {
		id: data.id,
		dataDesensitization: true,
	};
	const res = await userApi.deleteDevice(params);
	ElMessage.success("删除成功");
	await queryUserLoginDevice();
};

/**
 * @description 查询设别列表
 */
async function queryUserLoginDevice() {
	let res = await userApi.queryUserLoginDevice(queryUserLoginDevice_params);
	tableData.value = res.data.records;
}

/**
 * @description 时间戳转日期 YYYY-MM-DD
 * @param timestamp
 */
function formatTimestamp(timestamp: string) {
	const date = new Date(timestamp);
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月份是从0开始的，所以要加1
	const day = date.getDate().toString().padStart(2, "0");
	return `${year}-${month}-${day}`;
}

queryUserLoginDevice();
</script>
<style scoped lang="scss">
@import "index";

.drop-right {
	@include drop-right;

	.safe {
		height: 173px;
		@include card;

		.right-content {
			box-sizing: border-box;
			padding: 20px;
			width: 100%;
			height: 110px;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.text {
				font-size: 14px;
			}
		}
	}

	.device {
		margin-top: 20px;
		@include card;

		.right-content {
			box-sizing: border-box;
			padding: 20px;
		}
	}
}

.col1 {
	span {
		margin-left: 10px;
	}
}

.handle {
	display: flex;
	justify-content: center;

	span {
		cursor: pointer;
		user-select: none;
		@include themeify {
			color: themed("Theme") !important;
		}
	}

	.delete {
		@include themeify {
			color: themed("f1") !important;
		}
	}
}

.table-style {
	:deep(.el-table) {
		border-radius: 4px 4px 0px 0px;
		background-color: transparent;

		.table-header-cell {
			height: 44px;
			min-height: 44px;

			@include themeify {
				border-right-color: themed("Bg4");
				border-bottom-color: themed("Bg3");
				color: themed("Text1");
			}

			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 400;
		}

		.table-cell {
			height: 44px;
			min-height: 44px;

			@include themeify {
				border-color: themed("Bg3");
				color: themed("Text1");
			}

			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 400;
		}

		th.el-table__cell {
			@include themeify {
				background-color: themed("Bg3");
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
				background-color: themed("Bg3");
			}
		}
	}

	:deep(.el-table--border::after),
	:deep(.el-table--border::before) {
		@include themeify {
			background-color: themed("Bg3");
		}
	}
}
</style>
