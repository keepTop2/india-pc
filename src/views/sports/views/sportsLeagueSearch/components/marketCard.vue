<!--
 * @Author: Relax
 * @Description: 体育-足球-搜索
-->

<template>
	<div class="card-container">
		<!-- <div class="historical_data_two" @click="onSetSportsEventData"> -->
		<div class="historical_data_two" @click="onClick">
			<div class="historical_data_top">
				<!-- <img src="" alt="" /> -->
				<span>{{ cardData.leagueName }}</span>
			</div>

			<!-- <div class="historical_data_bottom">
				<p>哈尔姆斯塔德 VS 米亚尔比</p>
				<p>下半场 57:59 (1 - 1)</p>
			</div> -->
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { RiseOrFall } from "/@/components/Sport/index";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { marketsMatchData } from "/@/utils/sports/formattingViewData";
const emit = defineEmits(["oddsChange", "onClick"]);

// /** 市场 (盘口信息) */
// markets: any;
interface CapotCardType {
	/** 卡片类型 capot:独赢  handicap:让球  magnitude: 大小 */
	// cardType: 'capot' | 'handicap' | 'magnitude';
	/** 卡片数据 */
	cardData: any;
	/** 体育信息（每一行）*/
	sportInfo?: any;
	/** 投注类型 */
	// betType: number;
}
const props = withDefaults(defineProps<CapotCardType>(), {
	// cardType: 'capot',
	cardData: () => {
		return {};
	},
	sportInfo: [],
	// betType: 1,
});

const onClick = () => {
	emit("onClick", props.cardData);
};
</script>

<style scoped lang="scss">
.oddsUp {
	color: var(--Warn) !important;
}

.oddsDown {
	color: var(--Theme) !important;
}

.card-container {
	.historical_data_two {
		margin: 0 24px;
		border-bottom: 1px solid var(--Line-, #373a40);
		cursor: pointer;

		&:hover {
		}

		.historical_data_top {
			margin: 12px 0;
			display: flex;
			align-items: center;

			img {
				width: 20px;
				height: 20px;
			}

			span {
				margin-left: 8px;
				color: var(--text-s, #fff);
				font-family: "PingFang SC";
				font-size: 16px;
				font-style: normal;
				font-weight: 500;
				line-height: normal;
			}
		}

		.historical_data_bottom {
			margin: 12px 0;
			color: var(--Text1-1, #98a7b5);
			font-family: "PingFang SC";
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
		}
	}

	.noData {
		margin: 0 auto;
		width: 14px;
		height: 1px;

		background: var(--Text1);
	}
}

.item:hover {
	background: var(--Line);
}
</style>
