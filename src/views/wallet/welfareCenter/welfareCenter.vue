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
							<svg-icon name="common-arrow_down" width="12px" height="8px"></svg-icon>
						</div>
						<DatePicker :range="range" v-model="showDatePicker" :minDate="minDate" :maxDate="maxDate" @updateRange="updateRange" />
					</div>
					<div class="formItem"><Dropdown :options="welfareCenterRewardTypeOptions" v-model="params.welfareCenterRewardType"></Dropdown></div>
					<div class="formItem"><Dropdown :options="activityReceiveStatusOptions" v-model="params.receiveStatus"></Dropdown></div>
				</div>
				<div class="flex-center btns">
					<Button class="curp" @click="handleQuery"><svg-icon name="search_on" size="14px"></svg-icon> 查询</Button>

					<Button class="" @click="oneClickReceive" :disabled="Number(pageData.waitReceiveTotal) < 1" v-if="tableData.length > 0">一键领取</Button>
				</div>
			</div>
		</div>
		<div class="content" v-if="tableData.length > 0">
			<div>
				<div class="flex_space-between Text_s fs_14 mb_12">
					<div>
						<span>笔数: {{ pageData.totalSize || 0 }}</span>
						<span class="ml_20">{{ pageData.mainCurrencyTotal || 0 }} {{ pageData.mainCurrency }}</span>
						<span class="ml_20">{{ pageData.platCurrencyTotal || 0 }} {{ pageData.platCurrencyCode }}</span>
					</div>
					<div class="flex-center">
						<img src="./image/fudai.png" alt="" width="20px" />

						您有{{ pageData.waitReceiveTotal || 0 }}个待领取福利
					</div>
				</div>
				<div class="table">
					<div class="tr theader">
						<div class="td" style="width: 25%">订单号</div>
						<div class="td" style="width: 15%">类型</div>
						<div class="td" style="width: 14%">名称</div>
						<div class="td" style="width: 13%">奖励</div>
						<div class="td" style="width: 18%">时间</div>
						<div class="td" style="width: 15%">操作</div>
					</div>
					<div class="tbody">
						<div class="tr" v-for="item in tableData">
							<div class="td Text1 td1 curp" style="width: 25%">
								<svg-icon name="add_icon" size="16px" @click="showDetails(item)"></svg-icon>
								<div class="ellipsis">{{ item.orderNo }}</div>
								<svg-icon name="copy" size="16px" @click="common.copy(item.orderNo)"></svg-icon>
							</div>
							<div class="td Text1" style="width: 15%" @click="showDetails(item)">{{ item.welfareCenterRewardTypeText }}</div>
							<div class="td Text1" style="width: 14%" @click="showDetails(item)">{{ item.detailType }}</div>

							<div class="td Text_s" style="width: 13%" @click="showDetails(item)">{{ item.amount }}{{ item.currencyCode }}</div>
							<div class="td Text1" style="width: 18%" @click="showDetails(item)">{{ dayjs(item.pfTime).format("YYYY-MM-DD HH:mm:ss") }}</div>
							<div class="td" style="width: 15%; flex-direction: column">
								<span class="btn curp" :class="'status' + item.receiveStatus" @click="handleReceive(item)">{{ receiveStatus[item.receiveStatus] }}</span>
								<div class="fs_11 Text1" v-if="item.receiveStatus == 0">{{ Common.formatTimestamp(item.expiryTimeRemaining) }}后过期</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="flex-center Pagination" v-if="tableData.length">
				<Pagination v-model:current-page="params.pageNumber" :pageSize="params.pageSize" :total="pageData.totalSize" @sizeChange="sizeChange" @pageChange="pageQuery" />
			</div>
		</div>
		<div class="content flex_center" v-else>
			<NoneData></NoneData>
		</div>
	</div>
	<CommonDialog v-model="showDetailsDialog">
		<div class="Dialog">
			<div class="header">
				<div class="fs_20 Text_s fw_500 mt_5">福利详情</div>
				<div class="close curp" @click="showDetailsDialog = false">
					<img src="../../../assets/common/close_btn_bg.png" alt="" />
				</div>
			</div>
			<div class="text-center fs_28 Text_s"><img src="./image/fudai.png" alt="" width="26px" /> {{ detailsInfo.amount }} {{ pageData.platCurrencyCode }}</div>

			<div class="filed">
				<div>状态</div>
				<div :class="detailsInfo.receiveStatus == 0 ? 'color_F2' : detailsInfo.receiveStatus == 1 ? 'color_sussess' : 'Text2'">{{ detailsInfo.receiveStatusText }}</div>
			</div>

			<div class="filed">
				<div>福利类型</div>
				<div>{{ detailsInfo.welfareCenterRewardTypeText }}</div>
			</div>

			<div class="filed">
				<div>发放时间</div>
				<div>{{ dayjs(detailsInfo.pfTime).format("YYYY-MM-DD HH:mm:ss") }}</div>
			</div>

			<div class="filed">
				<div>订单号</div>
				<div class="flex-center">{{ detailsInfo.orderNo }} <svg-icon class="curp" name="copy" size="16px" @click="common.copy(detailsInfo.orderNo)"></svg-icon></div>
			</div>
			<div class="submitBtn">
				<Button style="width: 360px" v-if="detailsInfo.receiveStatus == 0" @click="handleReceive(detailsInfo)">立即领取</Button>
				<div class="mt_10">如需帮助，请 <span class="color_F2 curp" @click="common.getSiteCustomerChannel">联系客服</span></div>
			</div>
		</div>
	</CommonDialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { welfareCenterApi } from "/@/api/welfareCenter";
import dayjs from "dayjs";
import showToast from "/@/hooks/useToast";
import common from "/@/utils/common";
import Common from "/@/utils/common";
const showDatePicker = ref(false);

const params: any = reactive({
	pfTimeStartTime: "",
	pfTimeEndTime: "",
	pageNumber: 1,
	pageSize: 10,
	receiveStatus: "-1",
	welfareCenterRewardType: "-1",
});
const today = dayjs();
const detailsInfo: any = ref({});
const showDetailsDialog = ref(false);
const range = reactive({
	start: new Date(today.subtract(89, "day").format("YYYY/MM/DD")),
	end: new Date(today.add(0, "day").format("YYYY/MM/DD")),
});
const minDate = today.subtract(89, "day").format("YYYY/MM/DD");
const maxDate = today.add(0, "day").format("YYYY/MM/DD");
const receiveStatus: any = {
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
	params.pfTimeStartTime = new Date(range.start).getTime();
	params.pfTimeEndTime = new Date(range.end).getTime() + (59 + 60 * 60 * 23 + 59 * 60) * 1000;
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
		activityReceiveStatusOptions.value = res.data.activityReceiveStatus.map((item: any) => {
			return { text: item.value, value: item.code };
		});
		activityReceiveStatusOptions.value.unshift({
			text: "全部状态",
			value: "-1",
		});
		welfareCenterRewardTypeOptions.value = res.data.welfareCenterRewardType.map((item: any) => {
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
			showDetailsDialog.value = false;
			showToast("领取成功");
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
const showDetails = (item: any) => {
	detailsInfo.value = item;
	showDetailsDialog.value = true;
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
.Dialog {
	width: 520px;
	background: var(--Bg-1);
	border-radius: 12px;
	padding-bottom: 40px;
	.close {
		position: absolute;
		top: 0;
		right: 0;
		img {
			width: 58px;
			height: 45px;
		}
	}
	.filed {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0 24px;
		padding: 10px 0;
		border-bottom: 0.5px solid var(--Line-2);
		font-size: 14px;
		color: var(--Text-1);
	}
	.submitBtn {
		display: flex;
		justify-content: center;
		flex-direction: column;
		margin-top: 40px;
		align-items: center;
		color: var(--Text-1);
		font-size: 12px;
		.color_F2 {
			text-decoration-line: underline;
		}
	}
}
</style>
