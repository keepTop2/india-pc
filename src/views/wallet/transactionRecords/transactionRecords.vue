<template>
	<div>
		<div class="header">
			<div class="title fs_24 Text_s mb_3">交易记录</div>
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
					<div class="formItem"><Dropdown :options="welfareCenterRewardTypeOptions" v-model="params.tradeType"></Dropdown></div>
					<div class="formItem"><Dropdown :options="activityReceiveStatusOptions" v-model="params.tradeStatus"></Dropdown></div>
				</div>
				<div class="flex-center btns">
					<Button class="curp" @click="handleQuery"><svg-icon name="search_on" size="14px"></svg-icon> 查询</Button>
				</div>
			</div>
		</div>
		<div class="content" v-if="tableData.length > 0">
			<div>
				<div class="table">
					<div class="tr theader">
						<div class="td" style="width: 186px">订单号</div>
						<div class="td" style="width: 142px">类型</div>
						<div class="td" style="width: 158px">方式</div>
						<div class="td" style="width: 174px">金额</div>
						<!-- <div class="td" style="width: 174px">到账金额</div> -->
						<div class="td" style="width: 90px">状态</div>
						<div class="td" style="width: 181px">时间</div>
						<div class="td" style="width: 79px">操作</div>
					</div>
					<div class="tbody">
						<div class="tr" v-for="item in tableData">
							<div class="td Text1 td1 curp" style="width: 186px">
								<div class="ellipsis">{{ item.orderNo }}</div>
								<svg-icon name="copy" size="16px" @click="common.copy(item.orderNo)"></svg-icon>
							</div>
							<div class="td Text1" style="width: 142px">{{ item.tradeTypeText }}</div>
							<div class="td Text1" style="width: 158px">{{ item.tradeWayTypeText }}</div>
							<div class="td Text_s" style="width: 174px">{{ common.formatAmount(item.tradeAmount) }}</div>
							<!-- <div class="td Text_s" style="width: 174px">{{ common.formatAmount(item.arriveAmount) }}</div> -->
							<div class="td Text_s" :class="'status' + item.tradeStatus" style="width: 90px">{{ item.tradeStatusText }}</div>
							<div class="td Text1" style="width: 181px">{{ dayjs(item.tradeTime).format("YYYY-MM-DD HH:mm:ss") }}</div>
							<div class="td operate status0" style="width: 79px; flex-direction: column" @click="showDetails(item)">详情</div>
						</div>
					</div>
				</div>
			</div>
			<div class="flex-center Pagination" v-if="tableData.length > 0">
				<Pagination v-model:current-page="params.pageNumber" :pageSize="params.pageSize" :total="pageData.totalSize" @sizeChange="sizeChange" @pageChange="pageQuery" />
			</div>
		</div>
		<div class="content flex_center" v-else>
			<NoneData></NoneData>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { walletApi } from "/@/api/wallet";
import dayjs from "dayjs";
import showToast from "/@/hooks/useToast";
import common from "/@/utils/common";
import Common from "/@/utils/common";
import { useRouter } from "vue-router";
const showDatePicker = ref(false);
const router = useRouter();

const params: any = reactive({
	startTime: "",
	endTime: "",
	pageNumber: 1,
	pageSize: 10,
	tradeStatus: "",
	tradeType: "",
});
const today = dayjs();
const detailsInfo: any = ref({});
const range = reactive({
	start: new Date(today.subtract(89, "day").format("YYYY/MM/DD")),
	end: new Date(today.add(0, "day").format("YYYY/MM/DD")),
});
const minDate = today.subtract(89, "day").format("YYYY/MM/DD");
const maxDate = today.add(0, "day").format("YYYY/MM/DD");
const tradeStatus: any = {
	0: "领取",
	1: "已领取",
	2: "已过期",
};
const activityReceiveStatusOptions: any = ref([]);
const welfareCenterRewardTypeOptions: any = ref([]);
const tableData: any = ref([]);
const pageData = reactive({
	totalSize: "",
});
const total = ref(0);
const updateRange = (value: any) => {
	range.start = value[0];
	range.end = value[1];
};
const typeList: any = ref([
	{ text: "财务问题", value: "1" },
	{ text: "账号问题", value: "2" },
	{ text: "游戏问题", value: "3" },
	{ text: "活动问题", value: "4" },
	{ text: "其他问题", value: "5" },
]);

const type = ref("1");
onMounted(() => {
	getDownBox();
	pageQuery();
});
const pageQuery = () => {
	params.startTime = new Date(range.start).getTime();
	params.endTime = new Date(range.end).getTime() + (59 + 60 * 60 * 23 + 59 * 60) * 1000;
	walletApi.tradeRecordList(params).then((res) => {
		tableData.value = res.data.records;
		pageData.totalSize = res.data.total;
	});
};
const getDownBox = () => {
	walletApi.getDownBox().then((res) => {
		activityReceiveStatusOptions.value = res.data.deposit_withdraw_customer_status.map((item: any) => {
			return { text: item.value, value: item.code };
		});
		activityReceiveStatusOptions.value.unshift({
			text: "全部状态",
			value: "",
		});
		welfareCenterRewardTypeOptions.value = res.data.trade_type.map((item: any) => {
			return { text: item.value, value: item.code };
		});
		welfareCenterRewardTypeOptions.value.unshift({
			text: "全部类型",
			value: "",
		});
	});
};
const sizeChange = (pageSize: number) => {
	params.pageNumber = 1;
	params.pageSize = pageSize;
	pageQuery();
};

const showDetails = (item: any) => {
	router.push({
		path: "/accountChangeDetails",
		query: {
			tradeType: item.tradeType,
			tradeWayType: item.tradeWayType,
			orderNo: item.orderNo,
		},
	});
};
const handleQuery = () => {
	params.pageNumber = 1;
	pageQuery();
};
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
		padding: 8px 20px;
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
		border-radius: 6px;
	}
	.time {
		width: 268px;
	}
}
.content {
	min-height: calc(100vh - 260px);
	margin-top: 20px;
	background: var(--Bg-1);
	border-radius: 12px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.table {
		border: 1px solid var(--Line-2);
		border-radius: 8px;
	}
	.tr {
		display: flex;
		justify-content: space-around;
		border-bottom: 1px solid var(--Line-2);
		height: 50px;
		align-items: center;
		// line-height: 50px;
		font-size: 14px;
		.td {
			text-align: center;
			width: 100%;
			height: 50px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-right: 1px solid var(--Line-2);
		}
		.td:last-child {
			border-right: none;
		}
		.td1 {
			text-align: left;
			padding-left: 5px;
			padding-right: 5px;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 6px;
			.ellipsis {
				max-width: 130px;
			}
		}
		.btn {
			border-radius: 4px;
			padding: 2px 17px;
			font-size: 12px;
		}
		.operate {
			cursor: pointer;
		}
		// 进行中
		.status0 {
			color: var(--F-2);
		}
		// 成功
		.status1 {
			color: var(--success);
		}
		// 失败
		.status2 {
			color: var(--F-1);
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
.btns {
	button {
		height: 32px;
		border-radius: 6px;
		color: var(--Text-a);
		display: flex;
		align-items: center;
		gap: 6px;
		white-space: nowrap;
		font-size: 12px;
		font-weight: 400;
	}
	button:disabled {
		height: 32px;
		font-size: 12px;
		font-weight: 400;
	}
}
</style>
