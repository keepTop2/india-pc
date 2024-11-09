<template>
	<div>
		<div class="header">
			<div class="title fs_24 Text_s mb_3">投注记录</div>
			<div class="line"></div>
			<div class="form flex_space-between mt_20 fs_12">
				<div class="flex-center">
					<div class="time formItem pl_14 pr_14" @click="showDatePicker = true" style="position: relative">
						<div class="flex_space-between curp">
							<span>{{ dayjs(range.start).format("YYYY/MM/DD") }} - {{ dayjs(range.end).format("YYYY/MM/DD") }}</span>
							<svg-icon name="arrow_down" width="12px" height="8px"></svg-icon>
						</div>
						<DatePicker :range="range" v-model="showDatePicker" :minDate="minDate" :maxDate="maxDate" @updateRange="updateRange" />
					</div>
					<div class="formItem">
						<Dropdown :options="welfareCenterRewardTypeOptions" v-model="params.venueType"></Dropdown>
					</div>
					<div class="formItem">
						<Dropdown :options="activityReceiveStatusOptions" v-model="params.receiveStatus"></Dropdown>
					</div>
				</div>
				<div class="flex-center">
					<div class="btn curp" @click="handleQuery">
						<svg-icon name="search_on" size="14px"></svg-icon>
						查询
					</div>
				</div>
			</div>
		</div>
		<div v-if="hasData" class="content">
			<div>
				<div class="flex_space-between Text_s fs_14 mb_12">
					<div>
						<span>
							<span>共计: </span>
							{{ tableData.length || 0 }} 笔投入
						</span>
						<span class="ml_20">
							<span>投注金额：</span>
							{{ tzAmount || 0 }} {{ "CNY" || pageData.mainCurrency }}
						</span>
						<span class="ml_20">
							<span>输赢金额：</span>
							<span :class="[String(winOrLoseAmount).indexOf('-') > -1 ? 'lose_color' : 'win_color']"
								>{{ String(winOrLoseAmount).indexOf("-") > -1 ? winOrLoseAmount : "+" + winOrLoseAmount || 0 }} {{ "CNY" || pageData.platCurrencyCode }}</span
							>
						</span>
					</div>
					<!-- <div class="flex-center">
						<img src="./image/fudai.png" alt="" width="20px" />
						您有4个待领取福利
					</div> -->
				</div>
				<el-table :class="[tableColumns[0] && tableColumns[0].type == 'select' ? 'table-style-expand' : 'table-style-common']" :data="tableData" style="width: 100%" border>
					<template v-for="(item, index) in tableColumns" :key="index">
						<el-table-column type="expand" :label="item.label" width="164px" :prop="item.props" v-if="item.type == 'select'">
							<template #default="props">
								<div class="dropDown_line">
									<div class="firLine">
										<div style="width: 50%" class="fir_item">{{ props.row.eventInfo }}</div>
										<div style="width: 25%" class="fir_item">投注内容</div>
										<div style="width: 25%" class="fir_item">赔率</div>
										<div style="width: 50%" class="fir_item">{{ props.row.teamInfo }}</div>
										<div style="width: 25%" class="fir_item">{{ props.row.betContent }}</div>
										<div style="width: 25%" class="fir_item">@{{ props.row.odds }}</div>
									</div>
									<div class="winlogo">
										<img :src="props.row.orderClassify == '1' ? winlogo : props.row.orderClassify == '0' ? helogo : loselogo" alt="" />
									</div>
								</div>
							</template>
						</el-table-column>
						<!-- 订单号 -->
						<el-table-column v-else-if="item.label == '订单号'" width="250" :label="item.label" :prop="item.props" align="center">
							<template #default="props">
								<div class="orderId_style">
									<div>{{ props.row.orderId }}</div>
									<img @click="copyId(props.row.orderId)" :src="copyimg" alt="" />
								</div>
							</template>
						</el-table-column>
						<!-- 投注时间 -->
						<el-table-column v-else-if="item.label == '投注时间'" :label="item.label" :prop="item.props" align="center">
							<template #default="props">
								<div>{{ dayjs(props.row.betTime).format("YYYY-MM-DD HH:mm:ss") }}</div>
							</template>
						</el-table-column>
						<!-- 投注金额 -->
						<el-table-column v-else-if="item.label == '投注金额'" :label="item.label" :prop="item.props" align="center">
							<template #default="props">
								<div>{{ props.row.betAmount }} CNY</div>
							</template>
						</el-table-column>
						<!-- 输赢金额 -->
						<el-table-column v-else-if="item.label == '输赢金额'" :label="item.label" :prop="item.props" align="center">
							<template #default="props">
								<div :style="{ color: String(props.row.winLossAmount).indexOf('-') > -1 ? '#FF8C00' : '#FF284B' }">
									{{ String(props.row.winLossAmount).indexOf("-") > -1 ? props.row.winLossAmount : "+" + props.row.winLossAmount }} CNY
								</div>
							</template>
						</el-table-column>

						<el-table-column v-else :label="item.label" :prop="item.props" align="center" />
					</template>
					<template #empty>{{ $t(`common['暂无数据']`) }}</template>
				</el-table>
			</div>
			<div class="flex-center Pagination" v-if="tableData.length">
				<Pagination v-model:current-page="params.pageNumber" :pageSize="params.pageSize" :total="pageData.totalSize" @sizeChange="sizeChange" @pageChange="pageQuery" />
			</div>
		</div>
		<NoData v-else info="暂无投注记录" />
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { welfareCenterApi } from "/@/api/welfareCenter";
import dayjs from "dayjs";
import showToast from "/@/hooks/useToast";
import { fieldMap, colmuns, columnsType, columnType } from "./bettingRecordsColumns";
import loselogo from "/@/assets/zh-CN/wallet/loselogo.png";
import winlogo from "/@/assets/zh-CN/wallet/winlogo.png";
import helogo from "/@/assets/zh-CN/wallet/he.png";
import copyimg from "/@/assets/zh-CN/wallet/copy.png";
import NoData from "/@/views/messageCenter/components/NoData.vue";

const showDatePicker = ref(false);
const tableColumns = ref<columnType[]>([]);
const colmunsrow = ref<columnsType>(colmuns);
const today = dayjs();
const params = reactive({
	betStartTime: dayjs().startOf("day").valueOf(),
	betEndTime: dayjs().endOf("day").valueOf(),
	pageNumber: 1,
	pageSize: 10,
	receiveStatus: "",
	venueType: "1",
});

const range = reactive({
	start: new Date(today.subtract(0, "day").format("YYYY/MM/DD")),
	end: new Date(today.add(0, "day").format("YYYY/MM/DD")),
});
const minDate = today.subtract(180, "day").format("YYYY/MM/DD");
const maxDate = today.add(0, "day").format("YYYY/MM/DD");

const activityReceiveStatusOptions: any = ref([]);
const welfareCenterRewardTypeOptions = ref<{ text: string; value: string }[]>([]);
const tzAmount = ref(0);
const winOrLoseAmount = ref(0);
const tableData: any = ref([]);
const pageData = reactive({
	totalSize: "",
	waitReceiveTotal: "",
	platCurrencyTotal: "",
	platCurrencyCode: "",
	mainCurrency: "",
	mainCurrencyTotal: "",
});
const total = ref(0);
const hasData = ref(false);
const updateRange = (value: any) => {
	console.log(value);
	range.start = value[0];
	range.end = value[1];
};

const type = ref("1");
onMounted(() => {
	getDownBox();
	pageQuery(true);
});
const pageQuery = (type?: boolean) => {
	if (!type) {
		params.betStartTime = dayjs(new Date(range.start)).startOf("day").valueOf();
		params.betEndTime = dayjs(new Date(range.end)).endOf("day").valueOf();
	}
	let orderClassifyList: any = [];
	if (params.receiveStatus === "") {
		orderClassifyList = [];
	} else {
		orderClassifyList = [+params.receiveStatus];
	}

	welfareCenterApi.tzPageQuery({ ...params, venueType: +params.venueType, orderClassifyList }).then((res) => {
		if (!res.data) return;
		let rows = res.data[fieldMap[params.venueType]];

		if (params.venueType == "2" || !rows) {
			tableData.value = [];
			return;
		}
		console.log(fieldMap[params.venueType], "rows");
		tableData.value = rows.records || rows;
		pageData.totalSize = rows.total || (rows.orderMultipleBetList ? rows.records.length : rows.length);
		pageData.waitReceiveTotal = res.data.waitReceiveTotal;
		pageData.platCurrencyTotal = res.data.platCurrencyTotal;
		pageData.platCurrencyCode = res.data.platCurrencyCode;
		pageData.mainCurrency = res.data.mainCurrency;
		pageData.mainCurrencyTotal = res.data.mainCurrencyTotal;

		tzAmount.value = tableData.value.reduce((a: any, b: any) => {
			return a + b.betAmount;
		}, 0);

		winOrLoseAmount.value = tableData.value
			.reduce((a: any, b: any) => {
				return a + b.winLossAmount;
			}, 0)
			?.toFixed(2);

		tableData.value.forEach((item: any) => {
			if (item.betAmount) {
				item.betAmount = item.betAmount.toFixed(2);
			} else {
				item.betAmount = "";
			}
			if (item.winLossAmount) {
				item.winLossAmount = item.winLossAmount.toFixed(2);
			} else {
				item.winLossAmount = "";
			}
		});

		hasData.value =
			res.data.sabOrderList?.length > 0 ||
			res.data.eventOrderPage?.records?.length > 0 ||
			res.data.basicOrderPage?.records?.length > 0 ||
			res.data.tableOrderPage?.records?.length > 0;
		getTableType();
	});
};
// 获取 查询目录
const getDownBox = () => {
	const params = ["order_status_client", "order_date_num", "venue_type"];
	welfareCenterApi.requestGetTypeList(params).then((res) => {
		welfareCenterRewardTypeOptions.value = res.data.venue_type.map((item: any) => {
			return { text: item.value, value: item.code };
		});

		activityReceiveStatusOptions.value = res.data.order_status_client.map((item: any) => {
			return { text: item.value, value: item.code };
		});
		activityReceiveStatusOptions.value.unshift({
			text: "全部状态",
			value: "",
		});
	});
};

// 複製id
const copyId = (id: string) => {
	const input = document.createElement("input");
	input.setAttribute("value", id);
	document.body.appendChild(input);
	input.select();
	// 执行复制命令
	document.execCommand("copy");
	// 移除输入框
	document.body.removeChild(input);

	showToast("复制成功");
};

// watch([() => params.welfareCenterRewardType, () => welfareCenterRewardTypeOptions.value], (val) => {
// 	let selectCurrent = welfareCenterRewardTypeOptions.value.find((item: any) => item.value == val[0]);
//
// 	if (!selectCurrent || !selectCurrent.text) return;
//
// 	tableColumns.value = colmunsrow.value[selectCurrent.text];
// });

const sizeChange = (pageSize: number) => {
	params.pageNumber = 1;
	params.pageSize = pageSize;
	pageQuery();
};
const handleReceive = (item: any) => {
	const params = {
		id: item.id,
		welfareCenterRewardType: item.welfareCenterRewardType,
	};
	welfareCenterApi.clickReceive(params).then((res) => {
		if (res.code === 10000) {
			pageQuery();
		}
	});
};

const headerStyle = ({ row, column, rowIndex, columnIndex }: any) => {
	if (rowIndex == 0) {
		row[0].colSpan = 2;
		row[3].rowSpan = 2;
	}
};
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
	if (columnIndex === 0) {
		if (rowIndex === 0) {
			return {
				rowspan: 1,
				colspan: 2,
			};
		} else {
			return {
				rowspan: 0,
				colspan: 0,
			};
		}
	}
};
const handleQuery = () => {
	params.pageNumber = 1;
	pageQuery();
};
handleQuery();
function getTableType() {
	let selectCurrent = welfareCenterRewardTypeOptions.value.find((item: any) => item.value == params.welfareCenterRewardType[0]);
	if (!selectCurrent || !selectCurrent.text) return;
	tableColumns.value = colmunsrow.value[selectCurrent.text];
}
</script>

<style scoped lang="scss">
.header {
	background: var(--Bg1);
	border-radius: 12px;
	padding: 20px;

	.title {
		position: relative;
	}

	.title::before {
		content: "";
		position: absolute;
		top: 50%;
		left: -20px;
		width: 4px;
		height: 26px;
		transform: translateY(-50%);
		background: var(--Theme);
		border-radius: 0 12px 12px 0;
	}

	.line {
		height: 1px;
		background: var(--Line_1);
		box-shadow: 0px 1px 0px 0px #343d48;
	}

	.btn {
		background: var(--Theme);
		padding: 6px 20px;
		border-radius: 6px;
		color: var(--Text_a);
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.formItem {
		height: 34px;
		background: var(--Bg2);
		color: var(--Text_s);
		line-height: 34px;
		min-width: 140px;
	}

	.time {
		width: 268px;
	}
}

.content {
	min-height: calc(100vh - 260px);
	margin-top: 20px;
	background: var(--Bg1);
	border-radius: 12px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	.lose_color {
		color: #01aff6;
	}
	.win_color {
		color: var(--light-ok-Theme--, #ff284b);
	}
	.table {
		border: 1px solid var(--Line_2);
		border-radius: 8px;
	}

	.tr {
		display: flex;
		justify-content: space-around;
		border-bottom: 1px solid var(--Line_2);
		height: 50px;
		line-height: 50px;
		font-size: 14px;

		.td {
			text-align: center;
			width: 100%;
			border-right: 1px solid var(--Line_2);
		}

		.td:last-child {
			border-right: none;
		}

		.btn {
			border-radius: 4px;
			padding: 6px 17px;
			font-size: 12px;
		}

		.status0 {
			background: var(--Theme);
			color: var(--Text_a);
		}

		.status1 {
			background: var(--Line_2);
			color: var(--Success);
		}

		.status2 {
			color: var(--Text2);
		}
	}

	.tr:last-child {
		border-bottom: none;
	}

	.theader {
		height: 42px;
		background: var(--Bg2);
		border-radius: 8px 8px 0 0;
		line-height: 42px;
		color: var(--Text_s);
	}

	.Pagination {
		margin-top: 12px;
	}
}

.dropdown_row {
	display: flex;
	align-items: center;
}
.orderId_style {
	display: flex;
	align-items: center;
	gap: 10px;
	img {
		cursor: pointer;
	}
}
.dropDown_line {
	display: flex;
	align-items: center;

	.firLine {
		width: 80%;
		display: flex;
		flex-wrap: wrap;

		.fir_item {
			padding: 6px 12px 8px;
		}
	}

	.winlogo {
		width: 20%;
		text-align: center;
	}
}

:deep(.date-picker) {
	z-index: 9999;
}

:deep(.nodata) {
	height: 70vh;
}
</style>
