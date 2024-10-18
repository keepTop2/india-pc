<template>
	<div class="betRecord-container">
		<!-- 注单头部筛选 -->
		<div class="toolbar">
			<div class="tabs">
				<div class="btn" :class="{ btn_active: active === 0 }" @click="active = 0">{{ $t(`sports.betRecord['未结算']`) }}</div>
				<div class="btn" :class="{ btn_active: active === 1 }" @click="active = 1">{{ $t(`sports.betRecord['已结算']`) }}</div>
			</div>

			<div class="query" v-show="active === 1">
				<!-- 使用封装后的日期选择器组件 -->
				<DatePickerWrapper v-model="dateRange" />
			</div>
		</div>

		<!-- 投注列表 -->
		<BetTable :data="tableData as any" />

		<!-- 表格底部 -->
		<div class="bottom" v-if="tableData.length > 0">
			<div class="info">
				<span>{{ $t(`sports.betRecord['总计单数']`) }} {{ total }}</span>
				<span>{{ $t(`sports.betRecord['总投注额']`) }} {{ getStakeTotal }}</span>
			</div>
			<Pagination v-model:current-page="params.pageNumber" :pageSize="params.pageSize" :total="total" @sizeChange="sizeChange" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { usePopularLeague } from "/@/stores/modules/sports/popularLeague";
import dayjs from "dayjs";
// 表格组件
import BetTable from "./components/Table.vue";
// 引入封装的日期选择器组件
import DatePickerWrapper from "./components/DatePickerWrapper.vue";
// 分页组件
import { Pagination } from "/@/components/Pagination";
// 注单记录接口
import BetRecordApi from "/@/api/sports/betRecord";
// 体育公用方法
import SportsCommon from "/@/views/sports/utils/common";
import Common from "/@/utils/common";
const popularLeague = usePopularLeague();
/*隐藏热门联赛*/
popularLeague.hidePopularLeague();

// 选中的tab 结算未结算区分
const active = ref(0);

// 定义日期范围变量，默认为当天时间
const dateRange = ref({
	start: dayjs().startOf("day").valueOf(),
	end: dayjs().endOf("day").valueOf(),
});

// 当前请求的注单列表和总数
const list = ref([]);
const total = ref(0);
const params = reactive({
	pageNumber: 1,
	pageSize: 10,
});

// 防抖函数，防止频繁调用请求
function debounce(fn: { (): Promise<void>; (arg0: any): void }, delay: number | undefined) {
	let timer: string | number | NodeJS.Timeout | undefined;
	return function (...args: any) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn(...args);
		}, delay);
	};
}

// 获取注单详情的防抖包装函数
const debouncedGetBetDetails = debounce(getBetDetails, 300);

// 监听日期范围的变化，请求注单详情
watch(dateRange, debouncedGetBetDetails);

// 监听 active 状态的变化，请求注单详情
watch(active, debouncedGetBetDetails);

/**
 * @description: 获取注单详情（已结算和未结算共用）
 */
async function getBetDetails() {
	// 构造请求参数，根据 active 的值区分已结算和未结算
	let requestParams = {};
	if (active.value === 1) {
		const { start, end } = dateRange.value;
		requestParams = getRequestParams(start, end, true);
	} else {
		const { startDate, endDate } = SportsCommon.getQueryDateRange(30);
		// 这里直接将 startDate 和 endDate 传递给 getRequestParams
		requestParams = getRequestParams(startDate, endDate, false);
	}
	// 使用 then 和 catch 处理异步请求
	BetRecordApi.GetBetDetails(requestParams).then((res) => {
		if (res.data) {
			list.value = res.data; // 注单记录
			total.value = list.value.length; // 注单条数
			params.pageNumber = 1; // 重置页码
		}
	});
}

getBetDetails();

/**
 * @description: 获取请求参数
 * @param {String} start - 开始时间
 * @param {String} end - 结束时间
 * @param {Boolean} isSettled - 是否已结算
 * @returns {Object} 请求参数
 */
function getRequestParams(start: number, end: number | boolean, isSettled: boolean | undefined) {
	return {
		start: `${SportsCommon.formatDateBySign(start)}T00:00:00`,
		end: `${SportsCommon.formatDateBySign(end)}T23:59:59`,
		isSettled,
	};
}

const tableData = computed(() => {
	const start = (params.pageNumber - 1) * params.pageSize;
	const end = start + params.pageSize;
	return list.value?.slice(start, end) || [];
});

// 计算投注总额
const getStakeTotal = computed(() => {
	const total = list.value?.reduce((total, cur: { stake: number }) => total + Number(cur.stake), 0) || 0;
	return Common.formatFloat(total);
});

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
			margin-right: 24px;
		}
	}

	.bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 14px;
		.info {
			display: flex;
			gap: 24px;
			color: var(--Text1);
			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 400;
		}
	}
}
</style>
