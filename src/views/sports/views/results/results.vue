<!--
 * @Author: WangMingxin
 * @Description: 体育-赛果
-->
<template>
	<div class="container">
		<!--查询栏-->
		<query :queryForm="queryForm" :ballOptions="ballOptions" :loading="loading" @search="getEventResultsData" />

		<el-table :data="tableData" style="width: 100%">
			<el-table-column type="expand" width="20">
				<template #default="{ row }">
					<!--展开详情-->
					<itemDetails item="row" />
				</template>
			</el-table-column>
			<el-table-column prop="date" :label="$t(`matchResult['日期']`)" width="200" />
			<el-table-column prop="league" :label="$t(`matchResult['联赛']`)">
				<template #default="{ row }">
					<div class="col-box">
						<SvgIcon :iconName="row.leagueIconUrl" :size="22" />
						{{ row.leagueName }}
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="competition" :label="$t(`matchResult['赛事']`)">
				<template #default="{ row }">
					<div class="competition">
						<div class="col-box" v-for="item in row.events">
							<!--							<SvgIcon :iconName="item.logo" :size="22" />-->
							{{ item.awayName }}
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="yellow_first" width="45">
				<template #header>
					<SvgIcon iconName="yellow_first" :size="20" />
				</template>
				<template #default="{ row }">
					<div class="score-box">
						<span v-for="item in row.yellow_first">{{ item }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="yellow_second" width="45">
				<template #header>
					<SvgIcon iconName="yellow_second" :size="20" />
				</template>
				<template #default="{ row }">
					<div class="score-box">
						<span v-for="item in row.yellow_second">{{ item }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="yellow" width="45">
				<template #header>
					<SvgIcon iconName="yellow" :size="20" />
				</template>
				<template #default="{ row }">
					<div class="score-box">
						<span v-for="item in row.yellow">{{ item }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="red_first" width="45">
				<template #header>
					<SvgIcon iconName="red_first" :size="20" />
				</template>
				<template #default="{ row }">
					<div class="score-box">
						<span v-for="item in row.red_first">{{ item }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="red_second" width="45">
				<template #header>
					<SvgIcon iconName="red_second" :size="20" />
				</template>
				<template #default="{ row }">
					<div class="score-box">
						<span v-for="item in row.red_second">{{ item }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="red" width="45">
				<template #header>
					<SvgIcon iconName="red" :size="20" />
				</template>
				<template #default="{ row }">
					<div class="score-box">
						<span v-for="item in row.red_second">{{ item }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="corner_first" width="45">
				<template #header>
					<SvgIcon iconName="corner_first" :size="20" />
				</template>
				<template #default="{ row }">
					<div class="score-box">
						<span v-for="item in row.corner_first">{{ item }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="corner_second" width="45">
				<template #header>
					<SvgIcon iconName="corner_second" :size="20" />
				</template>
				<template #default="{ row }">
					<div class="score-box">
						<span v-for="item in row.corner_second">{{ item }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="corner" width="45">
				<template #header>
					<SvgIcon iconName="corner" :size="20" />
				</template>
				<template #default="{ row }">
					<div class="score-box">
						<span v-for="item in row.corner">{{ item }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="penaltyKick_first" width="45">
				<template #header>
					<SvgIcon iconName="penaltyKick_first" :size="20" />
				</template>
				<template #default="{ row }">
					<div class="score-box">
						<span v-for="item in row.penaltyKick_first">{{ item }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="penaltyKick_second" width="45">
				<template #header>
					<SvgIcon iconName="penaltyKick_second" :size="20" />
				</template>
				<template #default="{ row }">
					<div class="score-box">
						<span v-for="item in row.penaltyKick_second">{{ item }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="penaltyKick" width="45">
				<template #header>
					<SvgIcon iconName="penaltyKick" :size="20" />
				</template>
				<template #default="{ row }">
					<div class="score-box">
						<span v-for="item in row.penaltyKick">{{ item }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="penaltyKick_add" width="45">
				<template #header>
					<SvgIcon iconName="penaltyKick_add" :size="20" />
				</template>
				<template #default="{ row }">
					<div class="score-box">
						<span v-for="item in row.penaltyKick_add">{{ item }}</span>
					</div>
				</template>
			</el-table-column>
		</el-table>

		<Pagination v-if="tableData.length" :currentPage="params.pageNumber" :pageSize="params.pageSize" :total="total" @prevClick="prevClick" @nextClick="nextClick" />
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
import query from "./components/query/query.vue";
import moment from "moment";
import itemDetails from "./components/itemDetails/itemDetails.vue";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import { Pagination } from "/@/components/Pagination";
import sportsApi from "/@/api/menu/sports/sports";
import { usePopularLeague } from "/@/stores/modules/sports/popularLeague";
import { QueryFormType, QueryOptionItemType } from "/@/models/sportResultModel";
import { useResultHook } from "./useResultHook";

import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
const ShopCatControlStore = useShopCatControlStore();
const popularLeague = usePopularLeague();
/*隐藏热门联赛*/
popularLeague.hidePopularLeague();

const SportAttentionStore = useSportAttentionStore();
SportAttentionStore.hintHotLeague();

/** 赛果数据 */
const eventResultData = ref();

const { Today, getSportTypeOptions, preprocessData } = useResultHook();

/**
 * 查询表单数据
 */
const queryForm = reactive<QueryFormType>({
	ballType: -1,
	date: [new Date(`${Today} 00:00:00`), new Date(`${Today} 00:00:00`)],
	league: "",
	competition: "",
	isLive: false,
});

const loading = ref<boolean>(false);

/**
 * 球种 options 列表
 */
const ballOptions = ref<QueryOptionItemType[]>([]);

const tableData = ref([]);

const total = ref(0);
const params = reactive({
	pageNumber: 1,
	pageSize: 10,
});

onMounted(() => {
	ShopCatControlStore.setShopCatClose(true);
	initRequest();
});

onUnmounted(() => {
	ShopCatControlStore.setShopCatClose(false);
});

/**
 * 初始化请求
 */
const initRequest = async () => {
	// 获取球类列表
	const sportTypeOptions = await getSportTypeOptions();
	ballOptions.value = sportTypeOptions;

	if (sportTypeOptions.length) {
		queryForm.ballType = sportTypeOptions[0].value;
	}

	// 获取赛事结果
	await getEventResultsData();
};

/**
 * @description: 获取赛果
 * @return {*}
 */
const getEventResultsData = async () => {
	loading.value = true;
	const [startDate, endDate] = queryForm.date;
	const temp = "YYYY-MM-DDTHH:mm:ss";

	const res = await sportsApi
		.GetEventResults({
			language: "zhcn",
			from: moment(startDate).startOf("days").add(5, "hour").format(temp),
			until: moment(endDate).endOf("days").add(5, "hour").subtract(1, "millisecond").format(temp),
			query: `$filter=sportType eq ${queryForm.ballType}`,
		})
		.finally(() => {
			loading.value = false;
		});
	if (res.data) {
		eventResultData.value = preprocessData(res.data.result);
		total.value = res.data.result.length;
		params.pageNumber = 1;
		console.info(eventResultData.value, "默认赛果数据");
		getTableData();
	}
};

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
	tableData.value = eventResultData.value.slice(start, end);
};
</script>

<style scoped lang="scss">
.container {
	.col-box {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.competition {
		flex-direction: column;
		display: grid;
		gap: 12px;
	}

	.score-box {
		display: flex;
		flex-direction: column;
		text-align: center;
		gap: 12px;
	}

	:deep() {
		.el-table {
			background: themed("Bg");

			tr {
				background: transparent;
				overflow: hidden;
			}

			.el-table__inner-wrapper {
				&::before {
					display: none;
				}
			}
		}

		.el-table__header {
			border-radius: 8px;
			overflow: hidden;

			tr {
				border-radius: 10px;

				th {
					background: var(--Bg3);
					color: var(--Text1);
					font-weight: normal;
					border: 1px solid var(--Line);
					border-left: none;
				}

				& > .el-table__cell:first-child {
					border-left: 1px solid var(--Line);
					border-right: none;

					.cell {
						padding: 0;
					}
				}

				& > .el-table__cell:nth-of-type(2) {
					.cell {
						padding-left: 0;
					}
				}
			}
		}

		.el-table__body {
			-webkit-border-vertical-spacing: 4px; // 垂直间距
			.el-table__row {
				&:hover {
					.el-table__cell {
						background: var(--Bg1);
					}
				}

				.el-table__cell {
					border: 1px solid var(--Line);
					border-left: none;
					background: var(--Bg1);
					color: var(--Text1);
				}

				& > .el-table__cell:first-child {
					border-radius: 8px 0 0 8px;
					border-right: none !important;

					border-left: 1px solid var(--Line);

					.cell {
						padding: 0;

						.el-table__expand-icon {
							transform: rotate(0) !important;
							transition: 0s;
							text-align: right;

							&::after {
								content: url("/src/assets/zh/default/svg/web/unfold.svg");
							}

							.el-icon {
								display: none !important;
							}
						}

						.el-table__expand-icon--expanded {
							&::after {
								content: url("/src/assets/zh/default/svg/web/packUp.svg");
							}
						}
					}
				}

				& > .el-table__cell:last-child {
					border-radius: 0 8px 8px 0;
				}
			}
		}

		.el-table__expanded-cell {
			border: none;
			padding: 0;
			background: var(--Bg1);
			&:hover {
				background: var(--Bg1) !important;
			}
		}
	}
}
</style>
