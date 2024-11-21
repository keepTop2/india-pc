<template>
	<div>
		<div class="header">
			<div class="title fs_24 Text_s mb_3">{{ $t(`bettingRecords['投注记录']`) }}</div>
			<div class="line"></div>
			<div class="form flex_space-between mt_20 fs_12">
				<div class="flex-center">
					<div class="time formItem pl_14 pr_14" @click="showDatePicker = true" style="position: relative">
						<div class="flex_space-between curp">
							<span>{{ dayjs(range.start).format("YYYY/MM/DD") }} - {{ dayjs(range.end).format("YYYY/MM/DD") }}</span>
							<svg-icon name="common-arrow_down" width="12px" height="8px"></svg-icon>
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
						{{ $t(`bettingRecords['查询']`) }}
					</div>
				</div>
			</div>
		</div>
		<div v-if="tableData.length" class="content">
			<div>
				<div v-if="!['1', '7'].includes(params.venueType)" class="flex_space-between Text_s fs_14 mb_12">
					<div>
						<span>
							<span style="color: var(--Text-2-1)">{{ $t(`bettingRecords['共计']`) }}: </span>
							{{ totalVO.betNum }} {{ $t(`bettingRecords['投注']`) }}
						</span>
						<span class="ml_20">
							<span style="color: var(--Text-2-1)">{{ $t(`bettingRecords['投注金额']`) }}: </span>
							{{ totalVO.betAmount.toFixed(2) }} {{ mainCurrency }}
						</span>
						<span class="ml_20">
							<span style="color: var(--Text-2-1)">{{ $t(`bettingRecords['输赢金额']`) }}: </span>
							<span :class="[String(totalVO.winLoseAmount).indexOf('-') > -1 ? 'lose_color' : 'win_color']"
								>{{ String(totalVO.winLoseAmount).indexOf("-") > -1 ? totalVO.winLoseAmount : "+" + totalVO.winLoseAmount || 0 }} {{ mainCurrency }}</span
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
							<template #default="{ row }">
								<div class="expand-wrapper">
									<template v-if="row.eventInfo !== '串关'">
										<div v-if="params.venueType === '2'" class="dropDown_line" style="border: none; padding: 0">
											<div class="zhenRen">
												<div>
													<span>{{ row.gameName }}</span>
													<span>{{ row.gameNo }}</span>
												</div>

												<div class="p">
													<span>{{ $t(`bettingRecords['投注内容']`) }}</span>
													<span>{{ row.betContent }}</span>
												</div>
												<div class="p">
													<span>{{ $t(`bettingRecords['赔率']`) }}</span>
													<span>@{{ row.odds }}</span>
												</div>
												<div class="p">
													<span>{{ $t(`bettingRecords['结果']`) }}</span>
													<span>{{ row.resultList || "-" }}</span>
												</div>
												<div class="winlogo">
													<img v-if="row.orderClassify == '1'" :src="getLogo(row.winlossStatus)" alt="" />
													<span v-else>-</span>
												</div>
											</div>
										</div>

										<div v-else class="dropDown_line" style="border: none; padding: 0">
											<div class="firLine">
												<div>
													<span>{{ row.eventInfo }}</span>
													<span>{{ row.teamInfo }}</span>
												</div>
												<div class="p">
													<span>{{ $t(`bettingRecords['投注内容']`) }}</span>
													<span>{{ row.betContent }}</span>
												</div>
												<div class="p">
													<span>{{ $t(`bettingRecords['赔率']`) }}</span>
													<span>@{{ row.odds }}</span>
												</div>

												<div class="winlogo">
													<img v-if="row.orderClassify == '1'" :src="getLogo(row.winlossStatus)" alt="" />
													<span v-else>-</span>
												</div>
											</div>
										</div>
									</template>

									<div v-for="(item, i) in row.orderMultipleBetList" class="dropDown_line" :key="i">
										<div class="firLine">
											<div>
												<span>{{ item.eventInfo }}</span>
												<span>{{ item.teamInfo }}</span>
											</div>
											<div class="p">
												<span>{{ $t(`bettingRecords['投注内容']`) }}</span>
												<span>{{ item.betContent }}</span>
											</div>
											<div class="p">
												<span>{{ $t(`bettingRecords['赔率']`) }}</span>
												<span>@{{ item.odds }}</span>
											</div>

											<div class="winlogo">
												<img v-if="item.orderClassify == '1'" :src="getLogo(row.winlossStatus)" alt="" />
												<span v-else>-</span>
											</div>
										</div>
									</div>
								</div>
							</template>
						</el-table-column>
						<!-- 订单号 -->
						<el-table-column v-else-if="item.label == $t(`bettingRecords['订单号']`)" width="250" :label="$t(`bettingRecords['${item.label}']`)" :prop="item.props" align="center">
							<template #default="props">
								<div class="orderId_style">
									<div>{{ props.row.orderId }}</div>
									<img @click="copyId(props.row.orderId)" :src="copyimg" alt="" />
								</div>
							</template>
						</el-table-column>
						<!-- 投注时间 -->
						<el-table-column v-else-if="item.label == $t(`bettingRecords['投注时间']`)" :label="$t(`bettingRecords['${item.label}']`)" :prop="item.props" align="center">
							<template #default="props">
								<div>{{ dayjs(props.row.betTime).format("YYYY-MM-DD HH:mm:ss") }}</div>
							</template>
						</el-table-column>
						<!-- 投注金额 -->
						<el-table-column
							v-else-if="$t(`bettingRecords['${item.label}']`) == $t(`bettingRecords['投注金额']`)"
							:label="$t(`bettingRecords['${item.label}']`)"
							:prop="item.props"
							align="center"
						>
							<template #default="props">
								<div>{{ props.row.betAmount }} {{ mainCurrency }}</div>
							</template>
						</el-table-column>
						<!-- 输赢金额 -->
						<el-table-column
							v-else-if="$t(`bettingRecords['${item.label}']`) == $t(`bettingRecords['输赢金额']`)"
							:label="$t(`bettingRecords['${item.label}']`)"
							:prop="item.props"
							align="center"
						>
							<template #default="{ row }">
								<div v-if="row.orderClassify" :style="{ color: String(row.winLossAmount).indexOf('-') > -1 ? '#FF8C00' : '#FF284B' }">
									{{ row.winLossAmount ? (String(row.winLossAmount).indexOf("-") > -1 ? row.winLossAmount : "+" + row.winLossAmount) : "-" }} {{ mainCurrency }}
								</div>
								<div v-else>-</div>
							</template>
						</el-table-column>

						<el-table-column v-else :label="$t(`bettingRecords['${item.label}']`)" :prop="item.props" align="center" />
					</template>
					<template #empty>{{ $t(`common['暂无数据']`) }}</template>
				</el-table>
			</div>
			<div class="flex-center Pagination" v-if="tableData.length && params.venueType !== '1'">
				<Pagination v-model:current-page="params.pageNumber" :pageSize="params.pageSize" :total="pageData.totalSize" @sizeChange="sizeChange" @pageChange="pageQuery" />
			</div>
		</div>
		<NoData v-else :info="$t(`bettingRecords['暂无投注记录']`)" />
	</div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { colmuns, columnsType, columnType, fieldMap } from "./bettingRecordsColumns";
import { welfareCenterApi } from "/@/api/welfareCenter";
import copyimg from "/@/assets/zh-CN/wallet/copy.png";
import loselogo from "/@/assets/zh-CN/wallet/loselogo.png";
import winlogo from "/@/assets/zh-CN/wallet/winlogo.png";
import he from "/@/assets/zh-CN/wallet/he.png";
import showToast from "/@/hooks/useToast";
import { useUserStore } from "/@/stores/modules/user";
import NoData from "/@/views/messageCenter/components/NoData.vue";
const { t } = useI18n();

const getLogo = (status: any) => {
	if (status == "0") return he;
	else if (status == "1") return winlogo;
	else return loselogo;
};

// 获取主货币类型
const UserStore = useUserStore();
const mainCurrency = computed(() => UserStore.userInfo.mainCurrency);
const showDatePicker = ref(false);
const tableColumns = ref<columnType[]>([]);
const colmunsrow = ref<columnsType>(colmuns);
const today = dayjs();
const params = reactive({
	betStartTime: dayjs(new Date()).startOf("day").valueOf(),
	betEndTime: dayjs(new Date()).endOf("day").valueOf(),
	pageNumber: 1,
	pageSize: 10,
	receiveStatus: "",
	venueType: "1",
});

const range = reactive({
	start: dayjs(new Date()).startOf("day").valueOf(), // 今天 00:00:00
	end: dayjs(new Date()).endOf("day").valueOf(), // 今天 23:59:59
});
const minDate = today.subtract(180, "day").format("YYYY/MM/DD");
const maxDate = today.add(0, "day").format("YYYY/MM/DD");

const activityReceiveStatusOptions: any = ref([]);
const welfareCenterRewardTypeOptions = ref<{ text: string; value: string }[]>([]);
const tzAmount = ref(0);
const tableData: any = ref([]);
const pageData = reactive({
	totalSize: "",
	waitReceiveTotal: "",
	platCurrencyTotal: "",
	platCurrencyCode: "",
	mainCurrency: "",
	mainCurrencyTotal: "",
});
const updateRange = (value: any) => {
	console.log(value);
	range.start = value[0];
	range.end = value[1];
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
			text: t("common['全部状态']"),
			value: "",
		});
	});
};
onMounted(() => {
	getDownBox();
	pageQuery(true);
});

const totalVO = ref({
	betAmount: 0,
	winLoseAmount: 0,
	betNum: 0,
});
const pageQuery = (type?: boolean) => {
	if (!type) {
		params.betStartTime = dayjs(new Date(range.start)).startOf("day").valueOf();
		params.betEndTime = dayjs(new Date(range.end)).endOf("day").valueOf();
	}

	const data = {
		...params,
		venueType: +params.venueType,
		orderClassifyList: params.receiveStatus ? [+params.receiveStatus] : [],
	};

	welfareCenterApi.tzPageQuery(data).then((res) => {
		if (!res.data) return (tableData.value = []);
		totalVO.value = res.data.totalVO;
		let rows = res.data[fieldMap[params.venueType]];

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

		tableData.value.forEach((item: any) => {
			if (item.betAmount) {
				item.betAmount = item.betAmount.toFixed(2);
			} else {
				item.betAmount = "";
			}
			// 0被判定成false了 0也为true
			if (typeof item.winLossAmount === "number") {
				item.winLossAmount = item.winLossAmount.toFixed(2);
			} else {
				item.winLossAmount = "";
			}
		});

		getTableType();
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

	showToast(t("common['复制成功']"));
};

const sizeChange = (pageSize: number) => {
	params.pageNumber = 1;
	params.pageSize = pageSize;
	pageQuery();
};

const handleQuery = () => {
	params.pageNumber = 1;
	pageQuery();
};
handleQuery();

function getTableType() {
	let selectCurrent = welfareCenterRewardTypeOptions.value.find((item: any) => item.value == params.venueType[0]);
	if (!selectCurrent || !selectCurrent.text) return;
	tableColumns.value = colmunsrow.value[selectCurrent.text];
}
</script>

<style scoped lang="scss">
.header {
	background: var(--Bg-1);
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
		background: var(--Line-1);
		box-shadow: 0px 1px 0px 0px #343d48;
	}

	.btn {
		background: var(--Theme);
		padding: 6px 20px;
		border-radius: 6px;
		color: var(--Text-a);
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.formItem {
		height: 34px;
		background: var(--Bg-2);
		color: var(--Text-s);
		line-height: 34px;
		min-width: 140px;
	}

	.time {
		width: 268px;
	}
}

.content {
	min-height: calc(100vh - 260px);
	margin-top: 14px;
	background: var(--Bg-1);
	border-radius: 12px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	.lose_color {
		color: #01aff6;
	}

	.win_color {
		color: var(--Theme);
	}

	.table {
		border: 1px solid var(--Line-2);
		border-radius: 8px;
	}

	.tr {
		display: flex;
		justify-content: space-around;
		border-bottom: 1px solid var(--Line-2);
		height: 50px;
		line-height: 50px;
		font-size: 14px;

		.td {
			text-align: center;
			width: 100%;
			border-right: 1px solid var(--Line-2);
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
			color: var(--Text-a);
		}

		.status1 {
			background: var(--Line-2);
			color: var(--success);
		}

		.status2 {
			color: var(--Text-2);
		}
	}

	.tr:last-child {
		border-bottom: none;
	}

	.theader {
		height: 42px;
		background: var(--Bg-2);
		border-radius: 8px 8px 0 0;
		line-height: 42px;
		color: var(--Text-s);
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
	justify-content: center;
	gap: 10px;

	img {
		cursor: pointer;
	}
}

.dropDown_line:last-child {
	border: none;
	padding-bottom: 0;
}

.dropDown_line {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 70px;
	border-bottom: 1px solid var(--light-ok-Line-2-, #373a40);
	padding-bottom: 10px;

	.firLine {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: 3fr 1fr 1fr 1fr;
		font-size: 14px;
		gap: 15px;

		& > div {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			gap: 10px;
		}

		.p {
			text-align: center;
			& > span:first-child {
				color: var(--Text-s);
			}
		}

		.winlogo {
			display: flex;
			justify-content: center;
			align-items: center;
			img {
				width: 58px;
			}

			//width: 20%;
			//text-align: center;
		}
	}

	.zhenRen {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: 1.9fr 1.1fr 1fr 1fr 1fr;
		font-size: 14px;
		gap: 15px;

		& > div {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			gap: 10px;
		}

		.p {
			text-align: center;
			& > span:first-child {
				color: var(--Text-s);
			}
		}

		.winlogo {
			display: flex;
			justify-content: center;
			align-items: center;
			img {
				width: 58px;
			}

			//width: 20%;
			//text-align: center;
		}
	}
}

:deep(.date-picker) {
	z-index: 9999;
}

:deep(.nodata) {
	height: 70vh;
}

:deep(.dropdown-header),
:deep(.curp) {
	color: var(--Text-1);
}
:deep(.formItem) {
	border-radius: 4px;
}
.expand-wrapper {
	display: grid;
	gap: 10px;
}
</style>
