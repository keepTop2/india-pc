<!--
 * @Author: WangMingxin
 * @Description: 体育-赛果
-->
<template>
	<div class="container">
		<!--查询栏-->
		<query v-model:modelValue="queryForm" :ballOptions="ballOptions" :loading="loading" @search="getEventResultsData" @updateModel="handleUpdateModel" />
		<div class="result_content">
		<el-table :data="paginatedData" style="width: 100%;" :max-height="tableMaxHeight">
			<el-table-column prop="date" :label="$t(`matchResult['日期']`)" width="200" />
			<el-table-column prop="league" :label="$t(`matchResult['联赛']`)">
				<template #default="{ row }">
					<div class="col-box">
						{{ row.leagueName }}
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
			<el-table-column prop="sports-half_court" >
				<template #header>
					<div class="col-title-box">
						<svg-icon name="sports-half_court" :size="20" /> &nbsp; 半场
					</div>
				</template>
				<template #default="{ row }">
					<div>
						<div class="col-content-box">
							{{ row.htAwayScore || '-'  }}
						</div>
						<div class="col-content-box">
							{{ row.htHomeScore || '-'  }}
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="sports-full_court" >
				<template #header>
					<div class="col-title-box">
					<svg-icon name="sports-full_court" :size="20" /> &nbsp; 全场
				</div>
				</template>
				<template #default="{ row }">
					<div>
						<div class="col-content-box">
							{{ row.awayScore || '-' }}
						</div>
						<div class="col-content-box">
							{{ row.homeScore || '-' }}
						</div>
					</div>
				</template>
			</el-table-column>
			<template #empty>
				<div class="custom-empty">
					<svg-icon name="no_data" width="142" height="120" />
					<p>哎呀！还没有数据！</p>
				</div>
			</template>
		</el-table>
	</div>

		<Pagination v-if="eventResultData?.length" v-model:current-page="params.pageNumber" :pageSize="params.pageSize" :total="total" @sizeChange="sizeChange" />

</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch, computed } from "vue";
import query from "./components/query/query.vue";
import moment from "moment";
import itemDetails from "./components/itemDetails/itemDetails.vue";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import { Pagination } from "/@/components/Pagination";
import sportsApi from "/@/api/sports/sports";
import { usePopularLeague } from "/@/stores/modules/sports/popularLeague";
import { QueryFormType, QueryOptionItemType } from "/@/views/sports/models/sportResultModel";
import { useResultHook } from "./useResultHook";

import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
import useSportPubSubEvents from "../../hooks/useSportPubSubEvents";
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
	console.log(data,'====data')
	queryForm.value = data;
}

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

watch(() => params.pageNumber, (newValue) => {
		console.log(newValue,'===newValue')
})

/**
 * @description 计算分页后的数据
 */
const paginatedData = computed(() => {
	const start = (params.pageNumber - 1) * params.pageSize;
	const end = start + params.pageSize;
	return eventResultData.value?.slice(start, end) || [];
});

onMounted(async () => {
	ShopCatControlStore.setShopCatClose(true);
	await sportsLogin();
	await initRequest();
});

onUnmounted(() => {
	ShopCatControlStore.setShopCatClose(false);
});

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
 * @description 计算表格最大高度
 */
const tableMaxHeight = computed(() => {
  const windowHeight = window.innerHeight;
  
  return windowHeight - 60 - 40 - 48 - 50 - 80 -60;
});

/**
 * @description 获取赛果
 */
const getEventResultsData = async () => {
	console.log(queryForm,'=====queryForm')
	loading.value = true;
	const [startDate, endDate] = queryForm.value.date;
	const temp = "YYYY-MM-DDTHH:mm:ss";

	const res = await sportsApi
		.GetEventResults({
			language: "zhcn",
			from: moment(startDate).startOf("days").add(5, "hour").format(temp),
			until: moment(endDate).endOf("days").add(5, "hour").subtract(1, "millisecond").format(temp),
			query: `$filter=contains(leagueName,'${queryForm.value.league}') and (contains(homename,'${queryForm.value.competition}') or contains(awayname,'${queryForm.value.competition}')) and sportType eq ${queryForm.value.ballType}`,
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
	.col-box {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.custom-empty {
		margin-top: 160px;
		margin-bottom: 130px;
		p {
			line-height: 30px;
			color: var(--Text2);
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
			background: none;
			.col-content-box,.col-title-box{
				display:flex;
				justify-content: center;
			}
			.col-content-box{
				margin: 5px;
			}
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
					// border-left: none;
				}

				& > .el-table__cell:first-child {
					border-left: 1px solid var(--Line);
					// border-right: none;
					padding-left:24px;

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
					border: 1px solid var(--Line_2);
					// border-left: none;
					background: var(--Bg1);
					color: var(--Text1);
				}

				& > .el-table__cell:first-child {
					border-radius: 8px 0 0 8px;
					border-right: none !important;

					border-left: 1px solid var(--Line);
					padding-left:24px;

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
			// border: none;
			padding: 0;
			background: var(--Bg1);
			&:hover {
				background: var(--Bg1) !important;
			}
		}
	}
}
</style>
