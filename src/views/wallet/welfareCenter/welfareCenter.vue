<template>
	<div>
		<div class="header">
			<div class="title fs_24 Text_s mb_3">福利中心</div>
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
					<div class="formItem"><Dropdown :options="welfareCenterRewardTypeOptions" v-model="params.welfareCenterRewardType"></Dropdown></div>
					<div class="formItem"><Dropdown :options="activityReceiveStatusOptions" v-model="params.receiveStatus"></Dropdown></div>
				</div>
				<div class="flex-center">
					<div class="btn curp" @click="handleQuery"><svg-icon name="search_on" size="14px"></svg-icon> 查询</div>
					<div class="btn curp" @click="oneClickReceive">一键领取</div>
				</div>
			</div>
		</div>
		<div class="content">
			<div>
				<div class="flex_space-between Text_s fs_14 mb_12">
					<div>
						<span>笔数: {{ pageData.waitReceiveTotal || 0 }}</span>
						<span class="ml_20">{{ pageData.mainCurrencyTotal || 0 }} {{ pageData.mainCurrency }}</span>
						<span class="ml_20">{{ pageData.platCurrencyTotal || 0 }} {{ pageData.platCurrencyCode }}</span>
					</div>
					<div class="flex-center">
						<img src="./image/fudai.png" alt="" width="20px" />
						您有{{}}个待领取福利
					</div>
				</div>
				<div class="table">
					<div class="tr theader">
						<div class="td" style="width: 25%">订单号</div>
						<div class="td" style="width: 15%">类型</div>
						<div class="td" style="width: 15%">名称</div>
						<div class="td" style="width: 13%">奖励</div>
						<div class="td" style="width: 20%">时间</div>
						<div class="td" style="width: 12%">操作</div>
					</div>
					<div class="tbody">
						<div class="tr" v-for="item in tableData">
							<div class="td Text1" style="width: 25%">{{ item.orderNo }}</div>
							<div class="td Text1" style="width: 15%">{{ item.detailType }}</div>
							<div class="td Text1" style="width: 15%">{{ item.welfareCenterRewardTypeText }}</div>
							<div class="td Text_s" style="width: 13%">{{ item.amount }}{{ item.currencyCode }}</div>
							<div class="td Text1" style="width: 20%">{{ dayjs(item.pfTime).format("YYYY-MM-DD HH:mm:ss") }}</div>
							<div class="td" style="width: 12%">
								<span class="btn curp" :class="'status' + item.receiveStatus" @click="handleReceive(item)">{{ receiveStatus[item.receiveStatus] }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="flex-center Pagination" v-if="tableData.length">
				<Pagination v-model:current-page="params.pageNumber" :pageSize="params.pageSize" :total="pageData.totalSize" @sizeChange="sizeChange" @pageChange="pageQuery" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { welfareCenterApi } from "/@/api/welfareCenter";
import dayjs from "dayjs";
import showToast from "/@/hooks/useToast";

const showDatePicker = ref(false);

const params = reactive({
	pfTimeStartTime: new Date("2024-09-08 00:00:00").getTime(),
	pfTimeEndTime: new Date("2024-12-08 00:00:00").getTime(),
	pageNumber: 1,
	pageSize: 10,
	receiveStatus: "-1",
	welfareCenterRewardType: "-1",
});
const today = dayjs();
const range = reactive({
	start: new Date(today.subtract(90, "day").format("YYYY/MM/DD")),
	end: new Date(today.add(0, "day").format("YYYY/MM/DD")),
});
const minDate = today.subtract(90, "day").format("YYYY/MM/DD");
const maxDate = today.add(0, "day").format("YYYY/MM/DD");
const receiveStatus = {
	0: "领取",
	1: "已领取",
	2: "已过期",
};
const activityReceiveStatusOptions: any = ref([]);
const welfareCenterRewardTypeOptions: any = ref([]);
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
const updateRange = (value) => {
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
	params.pfTimeStartTime = new Date(range.start).getTime();
	params.pfTimeEndTime = new Date(range.end).getTime();
	welfareCenterApi.pageQuery(params).then((res) => {
		tableData.value = res.data.pages.records;
		pageData.totalSize = res.data.totalSize;
		pageData.waitReceiveTotal = res.data.waitReceiveTotal;
		pageData.platCurrencyTotal = res.data.platCurrencyTotal;
		pageData.platCurrencyCode = res.data.platCurrencyCode;
		pageData.mainCurrency = res.data.mainCurrency;
		pageData.mainCurrencyTotal = res.data.mainCurrencyTotal;
	});
};
const getDownBox = () => {
	welfareCenterApi.getDownBox().then((res) => {
		activityReceiveStatusOptions.value = res.data.activityReceiveStatus.map((item) => {
			return { text: item.value, value: item.code };
		});
		activityReceiveStatusOptions.value.unshift({
			text: "全部状态",
			value: "-1",
		});
		welfareCenterRewardTypeOptions.value = res.data.welfareCenterRewardType.map((item) => {
			return { text: item.value, value: item.code };
		});
		welfareCenterRewardTypeOptions.value.unshift({
			text: "全部类型",
			value: "-1",
		});
	});
};
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

const oneClickReceive = () => {
	welfareCenterApi.oneClickReceive().then((res) => {
		if (res.code === 10000) {
			pageQuery();
			showToast("领取成功");
		}
	});
};
const handleQuery = () => {
	params.pageNumber = 1;
	pageQuery();
};
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
</style>
