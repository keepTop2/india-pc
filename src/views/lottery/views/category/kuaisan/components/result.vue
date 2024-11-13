<template>
	<div class="lottery-result">
		<div class="search">
			<el-select :teleported="false" v-model="selectValue" placeholder="排序: 按时间排序" clearable filterable @change="handleChange">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
			</el-select>
		</div>

		<div class="table">
			<el-table :data="tableData" border :row-class-name="'row-cell'" header-cell-class-name="table-header-cell" :highlight-current-row="false">
				<!-- 发行数量 -->
				<el-table-column :label="$t(`lottery['发行数量']`)" align="left" :resizable="false">
					<template #default="{ row }">
						<div class="serial-number">{{ row.issueNum }}</div>
					</template>
				</el-table-column>
				<!-- 中奖号码 -->
				<el-table-column :label="$t(`lottery['中奖号码']`)" align="right" :resizable="false">
					<template #default="{ row }">
						<div class="balls">
							<Dice size="30px" :type="item === 1 ? 2 : 1" :points="item" v-for="(item, index) in formatLotteryNum(row.lotteryNum)" :key="index" />
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<Pagination v-model:current-page="pagination.pageNumber" :pageSize="pagination.pageSize" :total="pagination.total" @sizeChange="sizeChange" @update:currentPage="pageChange" />
	</div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { lotteryApi } from "/@/api/lottery";
import { Pagination } from "/@/components/Pagination";
import { useUserStore } from "/@/stores/modules/user";
import useDice from "/@/views/lottery/components/Tools/Dice/Index";
import { DEFAULT_LANG, langMaps } from "/@/views/lottery/constant/index";
import { useLoginGame } from "/@/views/lottery/stores/loginGameStore";

interface TableDataItem {
	endTime: number;
	gameCode: string;
	gameName: string;
	id: string;
	issueNum: string;
	lotteryNum: string;
	startTime: number;
	state: number;
}

type TableData = TableDataItem[];

const { Dice } = useDice();
const userStore = useUserStore();
const { merchantInfo } = useLoginGame();
const route = useRoute();

const options = [
	{ label: "排序: 抽奖时间升序", value: 1 },
	{ label: "排序: 抽奖时间降序", value: 0 },
];

const selectValue = ref(0);
const tableData = ref<TableData>([]);
const pagination = reactive({ pageNumber: 1, pageSize: 10, total: 0 });

const handleChange = (lotteryTimeSort: number) => {
	issueHistory({ lotteryTimeSort });
	resetPageNumber();
};

const sizeChange = (size: number) => {
	issueHistory({ size });
	resetPageNumber();
};

const pageChange = (page: number) => {
	issueHistory({ page });
};

function resetPageNumber() {
	pagination.pageNumber = 1;
}

async function issueHistory({ lotteryTimeSort = 0, page = 1, size = 10 } = {}) {
	// 准备入参
	const language = userStore.getLang;
	const lang = (langMaps as any)[language] || DEFAULT_LANG;
	const { merchantNo: operatorId, userAccount: operatorAccount } = merchantInfo.value;
	const { gameCode = "" } = route.query;

	const submitData = { operatorId, gameCode, lotteryTimeSort, page, size, lang };

	// 发送请求
	const res = await lotteryApi.issueHistory(submitData);
	const { records = [], total = 0 } = res.data || {};
	tableData.value = records;
	pagination.total = total;
}

function formatLotteryNum(lotteryNum = "") {
	return lotteryNum.split(" ").map((v) => +v);
}

onMounted(issueHistory);
</script>
