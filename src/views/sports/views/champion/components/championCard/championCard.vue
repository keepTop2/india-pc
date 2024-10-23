<template>
	<div class="card-container">
		<div class="box sticky">
			<div class="header" @click="toggleDisplay">
				<div class="league_name">{{ championData.leagueName }}</div>
				<div class="header-icon">
					<span class="icon" :class="{ 'icon-expanded': !isExpanded }">
						<svg-icon name="sports-arrow" width="8px" height="12px"></svg-icon>
					</span>
				</div>
			</div>
			<div v-if="isExpanded" class="content">
				<MarketColumn :displayContent="isExpanded" :sportInfo="championData" @oddsChange="oddsChange" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import MarketColumn from "../marketColumn/marketColumn.vue";

const SportAttentionStore = useSportAttentionStore();

interface TeamDataType {
	dataIndex: number;
	championData: any;
	isExpanded: boolean;
}

const props = withDefaults(defineProps<TeamDataType>(), {
	dataIndex: 0,
	championData: () => ({}),
	isExpanded: false,
});

const emit = defineEmits(["oddsChange", "toggleDisplay"]);

const oddsChange = (obj: any) => {
	emit("oddsChange", obj);
};

const isAttention = computed(() => {
	return SportAttentionStore.attentionLeagueIdList.includes(props.championData.leagueId);
});

const toggleDisplay = () => {
	emit("toggleDisplay", props.dataIndex);
};
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
			transition: transform 0.3s ease;

			&.icon-expanded {
				transform: rotate(90deg);
			}
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
