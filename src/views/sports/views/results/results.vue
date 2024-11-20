<template>
	<div class="container">
		<!--查询栏-->
		<query v-model:modelValue="queryForm" :ballOptions="ballOptions" :loading="loading" @search="getEventResultsData" @updateModel="handleUpdateModel" />
		<div class="result_content">
			<el-table :data="paginatedData" :highlight-current-row="false">
				<el-table-column prop="date" :label="$t(`matchResult['日期']`)" width="200">
					<template #header>
						<span>{{ $t(`matchResult['日期']`) }}</span>
						<span @click="handleSort" class="sort">
							<svg-icon :class="{ actived: !isSort }" name="sports-sort-time" />
							<svg-icon :class="{ actived: isSort }" name="sports-sort-time" />
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="league" :label="$t(`matchResult['联赛']`)">
					<template #default="{ row }">
						<div class="col-box">
							<!-- 联赛图标 -->
							<img class="league_icon" v-if="row.leagueIconUrl" :src="row.leagueIconUrl" alt="" />
							<span>{{ row.leagueName }}</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="competition" :label="$t(`matchResult['赛事']`)">
					<template #default="{ row }">
						<div class="competition">
							<div class="col-box">
								{{ row.awayName }}
							</div>
							<div class="col-box">
								{{ row.homeName }}
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="sports-half_court">
					<template #header>
						<div class="col-title-box"><svg-icon name="sports-half_court" size="20" /> &nbsp; 半场</div>
					</template>
					<template #default="{ row }">
						<div>
							<div class="col-content-box">
								{{ row.htAwayScore || "-" }}
							</div>
							<div class="col-content-box">
								{{ row.htHomeScore || "-" }}
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="sports-full_court">
					<template #header>
						<div class="col-title-box"><svg-icon name="sports-full_court" size="20" /> &nbsp; 全场</div>
					</template>
					<template #default="{ row }">
						<div>
							<div class="col-content-box color_Theme">
								{{ row.awayScore || "-" }}
							</div>
							<div class="col-content-box color_Theme">
								{{ row.homeScore || "-" }}
							</div>
						</div>
					</template>
				</el-table-column>
				<template #empty>
					<div class="custom-empty">
						<!-- <svg-icon name="no_data" width="142" height="120" />
					<p>哎呀！还没有数据！</p> -->
						<NoneData />
					</div>
				</template>
			</el-table>
		</div>
		<div class="bottom" v-if="eventResultData?.length">
			<div class="order-total">
				<span>{{ $t(`sports.betRecord['总计单数']`) }} {{ total }}</span>
			</div>
			<Pagination class="pagination" v-model:current-page="params.pageNumber" :pageSize="params.pageSize" :total="total" @sizeChange="sizeChange" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch, computed } from "vue";
import query from "./components/query/query.vue";
import moment from "moment";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import { Pagination } from "/@/components/Pagination";
import sportsApi from "/@/api/sports/sports";
import { usePopularLeague } from "/@/stores/modules/sports/popularLeague";
import { QueryFormType, QueryOptionItemType } from "/@/views/sports/models/sportResultModel";
import { useResultHook } from "./useResultHook";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
import useSportPubSubEvents from "../../hooks/useSportPubSubEvents";
import dayjs from "dayjs";
const { initSportPubsub, unSubSport, clearState, sportsLogin } = useSportPubSubEvents();
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
 * @description 查询表单数据
 */
const queryForm = ref<QueryFormType>({
	ballType: 1,
	date: [new Date(`${Today} 00:00:00`), new Date(`${Today} 00:00:00`)],
	league: "",
	competition: "",
	isLive: false,
});

/**
 * @description 更新查询表单数据
 * @param {QueryFormType} data - 查询表单数据
 */
const handleUpdateModel = (data: QueryFormType) => {
	console.log(data, "====data");
	queryForm.value = data;
};

const loading = ref<boolean>(false);

/**
 * @description 球种 options 列表
 */
const ballOptions = ref<QueryOptionItemType[]>([]);

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

/**
 * @description 计算分页后的数据
 */
const paginatedData = computed(() => {
	console.log("params.pageNumber", params.pageNumber);
	const start = (params.pageNumber - 1) * params.pageSize;
	const end = start + params.pageSize;
	return eventResultData.value?.slice(start, end) || [];
});

// 默认时间最近
const isSort = ref(true);
const handleSort = () => {
	isSort.value = !isSort.value;
	eventResultData.value = eventResultData.value?.sort((a, b) => {
		const aTime = moment(a.eventTime).valueOf();
		const bTime = moment(b.eventTime).valueOf();
		if (isSort.value) {
			return aTime - bTime;
		} else {
			return bTime - aTime;
		}
	});
};

onMounted(async () => {
	await sportsLogin();
	await initRequest();
});

onUnmounted(() => {});

/**
 * @description 初始化请求
 */
const initRequest = async () => {
	// 获取球类列表
	const sportTypeOptions = await getSportTypeOptions();
	ballOptions.value = sportTypeOptions;

	if (sportTypeOptions.length) {
		queryForm.value.ballType = sportTypeOptions[0].value;
	}

	// 获取赛事结果
	await getEventResultsData();
};

/**
 * @description 获取赛果
 */
const getEventResultsData = async () => {
	console.log(queryForm, "=====queryForm");
	loading.value = true;
	const [startDate, endDate] = queryForm.value.date;
	const temp = "YYYY-MM-DDTHH:mm:ss";

	const res = await sportsApi
		.GetEventResults({
			language: "zhcn",
			from: dayjs(startDate).startOf("days").toISOString(),
			until: dayjs(endDate).endOf("days").subtract(1, "millisecond").toISOString(),
			// and isLive eq ${queryForm.value.isLive}
			query: `$filter=contains(leagueName,'${queryForm.value.league}') and (contains(homename,'${queryForm.value.competition}') or contains(awayname,'${queryForm.value.competition}')) and sportType eq ${queryForm.value.ballType} `,
		})
		.finally(() => {
			loading.value = false;
		});
	if (res.data) {
		eventResultData.value = preprocessData(res.data.result);
		total.value = eventResultData.value.length;
		params.pageNumber = 1;
		console.info(eventResultData.value, "默认赛果数据");
	}
};

/**
 * @description 修改每页展示条数
 * @param {number} pageSize - 每页展示条数
 */
const sizeChange = (pageSize: number) => {
	params.pageSize = pageSize;
	params.pageNumber = 1;
};
</script>

<style scoped lang="scss">
.container {
	.result_content {
		width: 100%;
		max-height: calc(100vh - 240px);
	}
	.bottom {
		margin-top: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		width: 100%;
		.order-total {
			display: flex;
			gap: 24px;
			color: var(--Text-1);
			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 400;
			position: absolute;
			left: 0;
		}
	}

	.col-box {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		img {
			width: 20px;
			height: 20px;
			border-radius: 50%;
		}
	}
	.custom-empty {
		margin-top: 160px;
		margin-bottom: 130px;
		p {
			// line-height: 30px;
			color: var(--Text-2);
			font-size: 14px;
			font-weight: 400;
		}
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
			height: 100%;
			max-height: inherit;
			background-color: transparent;
			.col-content-box,
			.col-title-box {
				display: flex;
				justify-content: center;
			}
			.col-content-box {
				margin: 5px;
			}

			tr {
				background: transparent;
				overflow: hidden;
			}

			.el-table__inner-wrapper {
				max-height: inherit;
				&::before {
					display: none;
				}
			}
			.el-table__body-wrapper {
				overflow: auto;
				border-right: 0;
				border-bottom: 0;
			}
		}
		.el-table__header {
			border-radius: 8px;
			overflow: hidden;

			tr {
				border-radius: 10px;

				th {
					background: var(--Bg-3);
					color: var(--Text-1);
					font-weight: normal;
					border: 0;
					border-right: 1px solid var(--Line-2);
					position: relative;
					// border-left: none;
					.sort {
						position: absolute;
						right: 12px;
						top: 50%;
						transform: translateY(-50%);
						color: var(--Text-1);
						> svg {
							width: 4px;
							height: 11px;
							cursor: pointer;
						}
						> svg:last-child {
							transform: rotate(180deg);
							margin-left: 2px;
						}
						svg.actived {
							color: var(--Theme) !important;
						}
					}
				}

				& > .el-table__cell:first-child {
					border-left: 1px solid var(--Line);
					// border-right: none;
					padding-left: 24px;

					.cell {
						padding: 0;
					}
				}

				// & > .el-table__cell:nth-of-type(2) {
				// 	.cell {
				// 		padding-left: 0;
				// 	}
				// }
			}
		}

		.el-table__body {
			-webkit-border-vertical-spacing: 4px; // 垂直间距
			.el-table__row {
				&:hover {
					.el-table__cell {
						background: var(--Bg-1);
					}
				}

				.el-table__cell {
					border: 1px solid var(--Line-2);
					// border-left: none;
					background: var(--Bg-1);
					color: var(--Text-1);
				}

				& > .el-table__cell:first-child {
					border-radius: 8px 0 0 8px;
					border-right: none !important;

					border-left: 1px solid var(--Line);
					padding-left: 24px;

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
					color: var(--Theme);
				}
			}
		}

		.el-table__expanded-cell {
			// border: none;
			padding: 0;
			background: var(--Bg-1);
			&:hover {
				background: var(--Bg-1) !important;
			}
		}
	}
}
</style>
