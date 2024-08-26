<template>
	<div class="container">
		<div class="query">
			<Select :options="typeOptions" v-model="typeData" />
			<Select :options="stateOptions" v-model="stateData" />
			<Select :options="timeOptions" v-model="timeData" />
		</div>

		<div class="table-box">
			<el-table :data="tableData" border :cell-class-name="'table-cell'" :header-cell-class-name="'table-header-cell'" style="width: 100%">
				<el-table-column prop="orderId" label="订单号" align="center" :resizable="false" width="180">
					<template #default="scope">
						<div class="orderId">
							{{ scope.row.orderId }}
							<img :src="copyImg" alt="" @click="copy(scope.row.orderId)" />
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="gameName" label="游戏平台" align="center" :resizable="false">
					<template #default="scope">
						<div>{{ scope.row.gameName }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="thirdGameCode" label="游戏名称" align="center" :resizable="false">
					<template #default="scope">
						<div>{{ scope.row.thirdGameCode }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="betAmount" label="投注金额" align="center" :resizable="false">
					<template #default="scope">
						<div>{{ scope.row.betAmount }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="betTime" label="投注时间" align="center" :resizable="false">
					<template #default="scope">
						<div>{{ scope.row.betTime }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="orderClassifyText" label="状态" align="center" :resizable="false">
					<template #default="scope">
						<div>{{ scope.row.orderClassifyText }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="winLossAmount" label="输/赢" align="center" :resizable="false">
					<template #default="scope">
						<div class="green">{{ scope.row.winLossAmount }}</div>
					</template>
				</el-table-column>
			</el-table>
			<Pagination :currentPage="data.pageNumber" :pageSize="data.pageSize" :total="total" @prevClick="prevClick" @nextClick="nextClick" />
		</div>
	</div>
</template>

<script setup lang="ts">
import Select from "./components/Select.vue";
import { reactive, ref } from "vue";
import { CasionApi } from "/@/api/menu/casion/casion";
import Pagination from "/@/views/wallet/views/transaction/components/pagination/pagination.vue";
import copyImg from "/@/assets/zh/default/wallet/copy.png";

const typeOptions = reactive([
	{ label: "全部", value: "1" },
	{ label: "赌场", value: "2" },
	{ label: "体育", value: "3" },
	{ label: "真人", value: "4" },
]);
const typeData = ref("1");

const stateOptions = reactive([
	{ label: "全部状态", value: "1" },
	{ label: "已结算", value: "2" },
	{ label: "未结算", value: "3" },
]);
const stateData = ref("1");

const timeOptions = reactive([{ label: "时间不限", value: "1" }]);
const timeData = ref("1");

// 表格
const tableData = ref([]);
// 拷贝
const copy = (text: string) => {
	navigator.clipboard
		.writeText(text)
		.then(() => console.log("Text copied to clipboard"))
		.catch((err) => console.error("Failed to copy text: ", err));
};
const data = reactive({
	pageNumber: 1,
	pageSize: 10,
});
const total = ref(0);
const getBettingRecordList = async () => {
	let res = await CasionApi.getBettingRecordList(data);
	tableData.value = res.data.records;
	total.value = res.data.total;
};
getBettingRecordList();
// 上一页
const prevClick = () => {
	if (data.pageNumber <= 1) {
		return;
	}
	data.pageNumber--;
};

// 下一页
const nextClick = (totalPages: number) => {
	if (data.pageNumber >= totalPages) {
		return;
	}
	data.pageNumber++;
};
</script>

<style scoped lang="scss">
.container {
	.query {
		display: flex;
		gap: 4px;
	}

	.table-box {
		margin-top: 8px;
		padding: 20px;
		border-radius: 8px;
		@include themeify {
			background: themed("Bg1");
		}
	}

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
			height: 70px;
			min-height: 70px;
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

.orderId {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 10px;
	width: 100%;
}

.red {
	@include themeify {
		color: themed("Warn") !important;
	}
}

.green {
	@include themeify {
		color: themed("Theme");
	}
}
</style>
