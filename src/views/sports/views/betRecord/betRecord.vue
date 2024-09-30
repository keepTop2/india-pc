<template>
	<div class="betRecord-container">
		<!-- 注单头部筛选 -->
		<div class="toolbar">
			<div class="tabs">
				<div class="btn" :class="{ btn_active: active === 0 }" @click="active = 0">{{ $t(`sports.betRecord['未结算']`) }}</div>
				<div class="btn" :class="{ btn_active: active === 1 }" @click="active = 1">{{ $t(`sports.betRecord['已结算']`) }}</div>
			</div>

			<div class="query" v-show="active === 1">
				<el-date-picker :clearable="false" class="date-picker" v-model="dateRange" type="daterange" start-placeholder="Start Date" end-placeholder="End Date" />
				<el-button icon="Search">{{ $t(`betRecord['查询']`) }}</el-button>
			</div>
		</div>

		<!-- 投注列表 -->
		<BetTable :data="tableData as any" />
		<!-- 表格底部 -->
		<div class="bottom">
			<div class="info">
				<span>{{ $t(`sports.betRecord['总计单数']`) }} {{ total }}</span>
				<span>{{ $t(`sports.betRecord['总投注额']`) }} 2000.00</span>
			</div>
			<Pagination v-model:current-page="params.pageNumber" :pageSize="params.pageSize" :total="total" @sizeChange="sizeChange" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";

// 表格组件
import BetTable from "./components/Table.vue";
// 分页组件
import { Pagination } from "/@/components/Pagination";
// 注单记录接口
import BetRecordApi from "/@/api/sports/betRecord";
// 体育公用方法
import SportsCommon from "/@/views/sports/utils/common";

// 选中的tab 结算未结算区分
const active = ref(0);

/** 默认今日时间 */
const { startDate, endDate } = SportsCommon.getQueryDateRange();
// 日期范围
const dateRange = ref([startDate, endDate]);
// 总数据
const list = ref([]);

// 监听标识变化 请求注单历史记录
watch(active, () => getBetDetails(), { immediate: true });

const total = ref(0);

const params = reactive({
	pageNumber: 1,
	pageSize: 10,
});

watch(
	() => params.pageNumber,
	(newValue) => {
		console.log(newValue, "===newValue");
	}
);

const tableData = computed(() => {
	console.log("params.pageNumber", params.pageNumber);

	const start = (params.pageNumber - 1) * params.pageSize;
	const end = start + params.pageSize;
	console.log("start", start);
	console.log("end", end);
	return list.value?.slice(start, end) || [];
});

/**
 * @description: 获取注单详情
 */
async function getBetDetails() {
	const [start, end] = dateRange.value;
	const settledParams = {
		start: `${SportsCommon.formatDateBySign(start)}T00:00:00`,
		end: `${SportsCommon.formatDateBySign(end)}T23:59:59`,
		isSettled: true,
	};

	const { startDate, endDate } = SportsCommon.getQueryDateRange(30);
	const unsettledParams = {
		isSettled: false,
		start: `${SportsCommon.formatDateBySign(startDate)}T00:00:00`,
		end: `${SportsCommon.formatDateBySign(endDate)}T23:59:59`,
	};

	let res = await BetRecordApi.GetBetDetails(!!active.value ? settledParams : unsettledParams);
	if (res.data) {
		list.value = res.data; // 注单记录
		total.value = list.value.length; // 注单条数
		params.pageNumber = 1;
	}
}

/**
 * @description 修改每页展示条数
 * @param {number} pageSize - 每页展示条数
 */
const sizeChange = (pageSize: number) => {
	console.log("pageSize", pageSize);
	params.pageSize = pageSize;
	params;
};
</script>

<style scoped lang="scss">
.betRecord-container {
	//padding: 0 30px;

	.toolbar {
		width: 100%;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 5px 0px;
		background-color: var(--Bg1);
		border-radius: 8px;

		.tabs {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			gap: 10px;
			padding: 0px 24px;

			.btn {
				width: 88px;
				height: 30px;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 4px;
				border: 1px solid var(--Line_2);
				color: var(--Text1);
				text-align: center;
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
				cursor: pointer;
			}
			.btn_active {
				border: 1px solid var(--Theme);
				color: var(--Theme);
				transition: all 0.2s ease;
			}
		}

		.query {
			display: flex;
			align-items: center;
			gap: 16px;

			:deep() {
				.date-picker {
					height: 44px;
					width: 240px;
				}
			}

			.el-button {
				width: 108px;
				height: 44px;
			}
		}
	}

	.bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 14px;
		.info {
			display: flex;
			gap: 12px;
			color: var(--Text1);
			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 400;
		}
	}
}
</style>
