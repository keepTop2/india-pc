<!--
 * @Author: WangMingxin
 * @Description: 体育-注单记录
-->
<template>
	<div class="betRecord-container">
		<div class="toolbar">
			<div class="tabs">
				<el-button :class="{ active: active === 0 }" @click="active = 0">{{ $t(`betRecord['未结算']`) }}</el-button>
				<el-button :class="{ active: active === 1 }" @click="active = 1">{{ $t(`betRecord['已结算']`) }}</el-button>
			</div>

			<div class="query" v-show="active === 1">
				<el-date-picker :clearable="false" class="date-picker" v-model="dateRange" type="daterange" start-placeholder="Start Date" end-placeholder="End Date" />
				<el-button :loading="loading" icon="Search" @click="handleQuery">{{ $t(`betRecord['查询']`) }}</el-button>
			</div>
		</div>

		<Unsettled :data="tableData" :loading="loading"></Unsettled>

		<div class="bottom">
			<div>*{{ $t(`betRecord['此记录将显示所有未派彩的投注']`) }}</div>
			<div class="info">
				<span>{{ $t(`betRecord['总计单数']`) }}：{{ total }}</span>
				<span>{{ $t(`betRecord['总投注额']`) }}：2000.00</span>
				<span>{{ $t(`betRecord['输/赢']`) }}：-200.0</span>
			</div>
			<Pagination :currentPage="params.pageNumber" :pageSize="params.pageSize" :total="total" @prevClick="prevClick" @nextClick="nextClick" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
import SportsCommon from "/@/views/sports/utils/common";
import Unsettled from "./components/Table.vue";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import BetRecordApi from "/@/api/menu/sports/betRecord";
import { Pagination } from "/@/components/Pagination";
import { usePopularLeague } from "/@/stores/modules/sports/popularLeague";
import { pick, debounce } from "lodash-es";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
const ShopCatControlStore = useShopCatControlStore();

const popularLeague = usePopularLeague();
/*隐藏热门联赛*/
popularLeague.hidePopularLeague();

BetRecordApi.GetBetDetails();

const SportAttentionStore = useSportAttentionStore();
SportAttentionStore.hintHotLeague();

// 选中的tab
const active = ref(0);
/** 默认今日时间 */
/** 今日15天的开始结束 */
const { startDate, endDate } = SportsCommon.getQueryDateRange();
// 日期范围
const dateRange = ref([startDate, endDate]);
const loading = ref(false);
// 总数据
const list = ref([]);
// 表格数据
const tableData = ref([]) as any;

watch(active, () => getBetDetails(), { immediate: true });

/**
 * @description: 点击查询
 */
const handleQuery = debounce(getBetDetails, 300);

const total = ref(0);
const params = reactive({
	pageNumber: 1,
	pageSize: 10,
});
// 监听分页变化截取表格数据
watch(
	params,
	() => {
		getTableData();
	},
	{ deep: true }
);
// 上一页
const prevClick = () => {
	if (params.pageNumber <= 1) {
		return;
	}
	params.pageNumber--;
};
// 下一页
const nextClick = (totalPages: number) => {
	if (params.pageNumber >= totalPages) {
		return;
	}
	params.pageNumber++;
};

// 截取 tableData 数据
const getTableData = () => {
	const start = (params.pageNumber - 1) * params.pageSize;
	const end = start + params.pageSize;
	tableData.value = list.value.slice(start, end);
};

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

	loading.value = true;
	let res = await BetRecordApi.GetBetDetails(!!active.value ? settledParams : unsettledParams);
	list.value = res.data;
	total.value = list.value.length;
	console.log("=>(betRecord.vue:82) res", res.data);
	getTableData();
	loading.value = false;
}

onMounted(() => {
	ShopCatControlStore.setShopCatClose(true);
});
onUnmounted(() => {
	ShopCatControlStore.setShopCatClose(false);
});
</script>

<style scoped lang="scss">
.betRecord-container {
	//padding: 0 30px;

	.toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.tabs {
			display: flex;
			gap: 16px;
			margin-bottom: 20px;
			margin-top: 14px;

			.el-button {
				width: 128px;
				height: 40px;
				margin: 0;

				background: var(--Bg2);
				color: var(--Text1);
			}

			.active {
				background: var(--Bg3);
				color: var(--Theme);
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
		//margin-top: 16px;
		color: var(--Text1);
		.info {
			display: flex;
			gap: 24px;
		}
	}
}
</style>
