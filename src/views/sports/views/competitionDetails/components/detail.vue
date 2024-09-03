<!--
 * @Author: Relax
 * @Description: 赛事详细比分栏
-->
<template>
	<div class="detail-container">
		<div class="top">
			<div class="back" @click="$router.back()">
				<el-icon>
					<ArrowLeftBold />
				</el-icon>
				返回
			</div>
			<div class="title">英格兰超级联赛</div>
			<div class="handle">
				<div class="item" @click="isCollect()">
					{{ show ? "显示" : "隐藏" }}
					<img v-if="show" :src="visible" alt="img" />
					<img v-else :src="hidden" alt="img" />
				</div>
				<!-- 收藏 -->
				<SvgIcon v-if="isAttention" class="saveFollow" iconName="sports_collection_three" @click="attentionEvent(true)" :size="20" />
				<!-- 未收藏 -->
				<SvgIcon v-else class="unFollow" iconName="sports_collection_three" @click="attentionEvent(false)" :size="20" />
				<!-- 刷新 -->
				<SvgIcon iconName="refresh_sports" :size="20" />
			</div>
		</div>
		<div class="main" v-if="!show">
			<el-table :data="tableData">
				<el-table-column>
					<template #header>
						<div class="col1">
							<span>下半场</span>
							<span>91:26</span>
						</div>
					</template>
					<template #default="{ row }">
						<div class="title">
							{{ row.title }}
							<SvgIcon :iconName="row.icon" size="14" />
						</div>
					</template>
				</el-table-column>

				<el-table-column width="100" prop="field1">
					<template #header>
						<SvgIcon iconName="ball1" size="14" />
					</template>
					<template #default="{ row }"
						><span class="col">{{ row.field1 }}</span></template
					>
				</el-table-column>

				<el-table-column width="100" prop="field2">
					<template #header>
						<SvgIcon iconName="yellow" size="14" />
					</template>
					<template #default="{ row }"
						><span class="col">{{ row.field2 }}</span></template
					>
				</el-table-column>

				<el-table-column width="100" prop="field3">
					<template #header>
						<SvgIcon iconName="red" size="14" />
					</template>
					<template #default="{ row }"
						><span class="col">{{ row.field3 }}</span></template
					>
				</el-table-column>

				<el-table-column width="100" prop="field4">
					<template #header>
						<SvgIcon iconName="ball2" size="14" />
					</template>
					<template #default="{ row }"
						><span class="col">{{ row.field4 }}</span></template
					>
				</el-table-column>

				<el-table-column width="100" prop="field5">
					<template #header>
						<SvgIcon iconName="ball3" size="14" />
					</template>
					<template #default="{ row }"
						><span class="col">{{ row.field5 }}</span></template
					>
				</el-table-column>

				<el-table-column width="100" prop="field6">
					<template #header>
						<SvgIcon iconName="ball4" size="14" />
					</template>
					<template #default="{ row }"
						><span class="col">{{ row.field6 }}</span></template
					>
				</el-table-column>
			</el-table>
		</div>
		<div class="playing-methods">
			<el-button class="active"> 全部 </el-button>
			<!-- <div v-for="(item, index) in state.playingDataWithAll" @click="handleClick(index)" :key="index">
				<el-button :class="{ active: active === index }">
					{{ item.betTypeName }}
				</el-button>
			</div> -->
		</div>
	</div>
</template>

<script setup lang="ts">
import hidden from "/@/assets/zh/default/competition/hidden.png";
import visible from "/@/assets/zh/default/competition/visible.png";
import { FootballCardApi } from "/@/api/menu/sports/footballCard";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import PubSub from "/@/pubSub/pubSub";
const SportAttentionStore = useSportAttentionStore();
import { reactive, ref, onMounted, computed } from "vue";

const tableData = reactive([
	{ title: "客队名字", icon: "country", field1: 1, field2: 2, field3: 3, field4: 4, field5: 5, field6: 6 },
	{ title: "客队名字", icon: "country", field1: 1, field2: 2, field3: 3, field4: 4, field5: 5, field6: 6 },
	{ title: "客队名字", icon: "country", field1: 1, field2: 2, field3: 3, field4: 4, field5: 5, field6: 6 },
]);

const emits = defineEmits(["back", "isHidden", "isCollect", "refresh", "filter"]);

// // 定义props类型
interface CapotCardType {
	// playingData: any[];
	/** 队伍数据 */
	teamData: any;
}

// // 定义props并设置默认值
const props = withDefaults(defineProps<CapotCardType>(), {
	// playingData: () => [],
	teamData: () => {
		return {};
	},
});

// 定义组件状态
// const state = reactive({
// 	playingDataWithAll: [
// 		{
// 			betTypeName: "全部",
// 			betType: 0,
// 		},
// 	] as any[],
// });

// onMounted(() => {
// 	state.playingDataWithAll.push(...Object.values(props.playingData));
// });

// const active = ref(0);

// const handleClick = (index: number) => {
// 	active.value = index;
// 	const betType = state.playingDataWithAll[index].betType;
// 	emits("filter", betType);
// };
/**
 * @description 点击切换 显示||隐藏 比分栏
 */
const show = ref(false);
const isCollect = () => {
	show.value = !show.value;
};

const isAttention = computed(() => {
	return SportAttentionStore.attentionEventIdList.includes(props.teamData.eventId);
});

// 点击关注按钮
const attentionEvent = async (isActive: boolean) => {
	if (isActive) {
		await FootballCardApi.unFollow({
			thirdId: [props.teamData.eventId],
		});
	} else {
		await FootballCardApi.saveFollow({
			thirdId: props.teamData.eventId,
			type: 2,
		});
	}
	PubSub.publish(PubSub.PubSubEvents.SportEvents.attentionChange.eventName, {});
};
</script>

<style scoped lang="scss">
.detail-container {
	width: 100%;
	margin-bottom: 20px;
	border-radius: 0px 0px 8px 8px;
	background: var(--Bg3);

	.top {
		padding: 15px 12px;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.back {
			display: flex;
			align-items: center;
			gap: 9px;
			cursor: pointer;

			color: var(--Text1);
		}

		.title {
			font-size: 16px;
			color: var(--Text_s);
		}

		.handle {
			display: flex;
			align-items: center;
			gap: 24px;

			.item {
				display: flex;
				align-items: center;
				font-size: 14px;
				gap: 8px;

				color: var(--Text1);

				img {
					cursor: pointer;
				}
			}

			.unFollow {
				color: var(--icon);
			}
			.saveFollow {
				color: var(--Warn);
			}
		}
	}

	.main {
		background-image: url(/@/assets/zh/default/competition/detailBg.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		width: 100%;
		height: 276px;
		display: flex;
		align-items: center;
		justify-content: center;

		.el-table {
			width: 892px;
			//height: 166px;
			--el-table-row-hover-bg-color: transparent;
			--el-table-bg-color: transparent;
			--el-table-border-color: transparent;

			.col1 {
				font-weight: 500;
				display: flex;
				align-items: center;
				gap: 4px;

				color: var(--Text1) !important;
			}

			:deep() {
				tr {
					background: rgba(0, 0, 0, 0.4);
				}

				th.el-table__cell {
					background: var(--Bg3);
				}
			}

			.col {
				color: var(--Text_s);
			}

			.title {
				display: flex;
				align-items: center;
				gap: 8px;
			}
		}
	}

	.playing-methods {
		// height: 52px;
		display: flex;
		gap: 10px;
		padding: 12px;
		border-radius: 0px 0px 8px 8px;
		background: var(--Bg1-1, #24262b);

		.el-button {
			width: fit-content;
			margin: 0;
			height: 28px;
			border-radius: 99px;
			background: transparent;
			border: 1px solid var(--Icon, #67707b);
			padding: 0 20px;

			color: var(--Text1);
		}

		.active {
			border-color: transparent;

			color: var(--Text_a);
			background: var(--Theme);
		}
	}
}
</style>
