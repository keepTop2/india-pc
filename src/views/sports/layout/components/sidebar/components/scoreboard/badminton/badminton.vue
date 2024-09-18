<template>
	<div class="scoreboard-container">
		<div class="scoreboard" :class="'small'">
			<div class="scoreboard-center">
				<template v-if="Object.keys(eventsInfo).length !== 0">
					<div class="header cell">
						<div class="label">{{ getEventsTitle(eventsInfo) }}</div>
						<div class="value">
							<!-- 渲染前两节得分 -->
							<template v-for="(period, index) in periods" :key="index">
								<div class="num" :class="{ F2: isCurrentPeriod(index + 1) }">
									{{ period }}
								</div>
							</template>
							<!-- 局 -->
							<div class="num">{{ $t(`sports['局']`) }}</div>
							<!-- 总分 -->
							<div class="num F2">{{ $t(`sports['总分']`) }}</div>
						</div>
					</div>
					<!-- 主队 -->
					<div class="row cell">
						<div class="label">
							<div class="icon">
								<img :src="eventsInfo?.teamInfo?.homeIconUrl" alt="" />
							</div>
							<div class="name">{{ eventsInfo?.teamInfo?.homeName }}</div>
						</div>
						<div class="value">
							<template v-for="(score, index) in homeScores" :key="index">
								<div class="num" :class="{ F2: isCurrentPeriod(index + 1) }">
									<span v-if="isPeriodActive(index + 1)">
										{{ score }}
									</span>
								</div>
							</template>
							<!-- 局 -->
							<div class="num">
								<span>{{ calculateSetScore(homeScores, awayScores) }}</span>
							</div>
							<!-- 总分 -->
							<div class="num F2">
								<span>{{ eventsInfo?.badmintonInfo?.homeCurrentPoint }}</span>
							</div>
						</div>
					</div>
					<div class="line"></div>
					<!-- 客队 -->
					<div class="row cell">
						<div class="label">
							<div class="icon">
								<img :src="eventsInfo?.teamInfo?.awayIconUrl" alt="" />
							</div>
							<div class="name">{{ eventsInfo?.teamInfo?.awayName }}</div>
						</div>
						<div class="value">
							<template v-for="(score, index) in awayScores" :key="index">
								<div class="num" :class="{ F2: isCurrentPeriod(index + 1) }">
									<span v-if="isPeriodActive(index + 1)">
										{{ score }}
									</span>
								</div>
							</template>
							<!-- 局 -->
							<div class="num">
								<span>{{ calculateSetScore(awayScores, homeScores) }}</span>
							</div>
							<!-- 总分 -->
							<div class="num F2">
								<span>{{ eventsInfo?.badmintonInfo?.awayCurrentPoint }}</span>
							</div>
						</div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { SportsRootObject } from "/@/views/sports/models/interface";
import SportsCommonFn from "/@/views/sports/utils/common";
import { i18n } from "/@/i18n/index";
const { getEventsTitle } = SportsCommonFn;
const $: any = i18n.global;

const props = withDefaults(
	defineProps<{
		eventsInfo: SportsRootObject;
	}>(),
	{}
);

// 计算属性
const periods = ["1", "2", "3", "4", "5"];
// 总共的盘数
const gameSession = computed(() => props.eventsInfo?.gameSession || 0);
// 当前盘数
const currentInning = computed(() => props.eventsInfo?.badmintonInfo?.currentInning || 1);

// 判断当前节是否是直播的最新节
const isCurrentPeriod = (period: number) => currentInning.value === period;

// 判断是否是活跃的节
const isPeriodActive = (period: number) => gameSession.value >= period;

// 计算主队得分
const homeScores = computed(() => props.eventsInfo?.badmintonInfo?.homeGameScore || []);
// 计算客队得分
const awayScores = computed(() => props.eventsInfo?.badmintonInfo?.awayGameScore || []);

// 计算局
const calculateSetScore = (scores: number[], opponentScores: number[]) => {
	if (currentInning.value === 1) {
		return 0; // 第一盘时不计算局
	} else if (currentInning.value === 2) {
		// 当前为第二盘时计算第一盘的局
		return compareSets(scores, opponentScores, 0); // 比较第一盘的得分
	} else if (currentInning.value === 3) {
		// 当前为第三盘时计算前两盘的局
		return compareSets(scores, opponentScores, 0) + compareSets(scores, opponentScores, 1); // 比较前两盘的得分
	} else if (currentInning.value === 4) {
		// 当前为第三盘时计算前两盘的局
		return compareSets(scores, opponentScores, 0) + compareSets(scores, opponentScores, 1) + compareSets(scores, opponentScores, 2); // 比较前三盘的得分
	} else if (currentInning.value === 5) {
		// 当前为第三盘时计算前两盘的局
		return compareSets(scores, opponentScores, 0) + compareSets(scores, opponentScores, 1) + compareSets(scores, opponentScores, 2) + compareSets(scores, opponentScores, 3); // 比较前四盘的得分
	}
};

// 对比得分
const compareSets = (scores: number[], opponentScores: number[], setIndex: number) => {
	// 确保 setIndex 在有效范围内
	if (setIndex < 0 || setIndex >= scores.length || setIndex >= opponentScores.length) {
		return 0;
	}

	if (scores[setIndex] > opponentScores[setIndex]) {
		return 1; // 主队的得分更高，局数加1
	} else {
		return 0; // 客队的得分更高或相等，局数不变
	}
};
</script>

<style scoped lang="scss">
.scoreboard-container {
	width: 100%;
	height: 208px;

	// 侧边栏小布局样式
	.small {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: url("/@/assets/zh-CN/sports/sidebar/badminton_s.png") center center / 100% 100% no-repeat;
		.scoreboard-center {
			position: relative;
			width: 366px;
			border-radius: 8px;
			background-color: var(--scoreboard_bg);
			overflow: hidden;

			.header {
				width: 100%;
				height: 36px;
				background: var(--Bg3);
				border-radius: 8px 8px 0px 0px;
				.label {
					color: var(--Text_s);
					font-family: "PingFang SC";
					font-size: 12px;
					font-weight: 400;
				}
				.value {
					.num {
						width: 30px;
						height: 30px;
						display: flex;
						align-items: center;
						justify-content: center;
						color: var(--Text_s);
						font-family: "PingFang SC";
						font-size: 12px;
						font-weight: 400;
					}
					.F2 {
						color: var(--F2);
					}
				}
			}
			.row {
				width: 100%;
				height: 50px;
				.label {
					.icon {
						width: 20px;
						height: 20px;
						img {
							width: 100%;
							height: 100%;
						}
					}
					.name {
						max-width: 85px;
						color: var(--Text_s);
						font-family: "PingFang SC";
						font-size: 14px;
						font-weight: 400;
						white-space: nowrap; /* 强制文本在一行显示 */
						overflow: hidden; /* 隐藏超出容器的文本 */
						text-overflow: ellipsis; /* 使用省略号来表示被截断的文本 */
					}
				}
				.num {
					width: 30px;
					height: 30px;
					display: flex;
					align-items: center;
					justify-content: center;
					color: var(--Text_s);
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
				}
				.F2 {
					color: var(--F2);
				}

				&::first-letter {
					border-top: 1px solid;
				}
			}
			.cell {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0px 15px 0px 12px;
				.label {
					flex: 1;
					display: flex;
					gap: 5px;
				}
				.value {
					min-width: 179px;
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 2px;
				}
			}
			.line {
				width: 342px;
				height: 1px;
				margin: 0 auto;
				border-radius: 2px;
				opacity: 0.5;
				background-color: var(--Line_2);
			}
		}
	}
}
</style>
