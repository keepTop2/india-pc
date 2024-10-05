<template>
	<div class="card-container">
		<!--  头部 -->
		<div class="box sticky">
			<div class="header" @click="toggleDisplay">
				<!-- 联赛信息 -->
				<div class="league_name">{{ championData.leagueName }}</div>
				<!-- 展开/收起图标 -->
				<div class="header-icon">
					<span class="icon"><svg-icon name="sports-arrow" width="8px" height="12px"></svg-icon></span>
				</div>
			</div>
			<div v-if="displayContent" class="content">
				<MarketColumn :displayContent="displayContent" :sportInfo="championData" @oddsChange="oddsChange" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import MarketColumn from "../marketColumn/marketColumn.vue";
const SportAttentionStore = useSportAttentionStore();
interface teamDataType {
	/** 数据索引 */
	dataIndex: number;
	/** 队伍数据 */
	championData: any;
	/** 是展开状态？ */
	isExpand?: boolean;
}
const props = withDefaults(defineProps<teamDataType>(), {
	/** 是展开状态？ */
	isExpand: true,
	/** 数据索引 */
	dataIndex: 0,
	/** 队伍数据 */
	championData: () => {
		return {};
	},
});

const emit = defineEmits(["oddsChange", "toggleDisplay"]);

/**
 * @description 动画结束删除oddsChange字段状态
 */
const oddsChange = (obj: any) => {
	emit("oddsChange", obj);
};

const isAttention = computed(() => {
	return SportAttentionStore.attentionLeagueIdList.includes(props.championData.leagueId);
});

const displayContent = ref(true);

/**
 * @description: 展开折叠处理
 * @return {*}
 */
const toggleDisplay = () => {
	displayContent.value = !displayContent.value;
	const params = {
		index: props.dataIndex,
		isExpand: displayContent.value,
	};
	emit("toggleDisplay", params);
};
watch(
	() => props.isExpand,
	(newValue, oldValue) => {
		displayContent.value = newValue;
	},
	{
		immediate: true,
	}
);

onMounted(() => {
	displayContent.value = props.isExpand;
});
</script>

<style scoped lang="scss">
.card-container {
	margin-bottom: 4px;
}
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 34px;
	padding: 6px 14px 6px 8px;
	border-radius: 8px 8px 0px 0px;
	background: var(--Bg6);
	box-shadow: 0px 1px 1px 0px rgba(255, 255, 255, 0.1) inset;
	cursor: pointer;

	.league_name {
		color: var(--Text_s);
		font-family: "PingFang SC";
		font-size: 16px;
		font-style: normal;
		font-weight: 300;
		line-height: normal;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.header-icon {
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		.icon {
			transform: rotate(-90deg);
		}
	}
}

.content {
	width: 100%;
	padding: 10px;
	background: var(--Bg1);
	border-radius: 0px 0px 8px 8px;
}
</style>
