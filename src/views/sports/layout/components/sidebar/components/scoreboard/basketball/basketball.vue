<template>
	<div class="scoreboard-container">
		<div class="scoreboard" :class="'small'">
			<div class="scoreboard-center">
				<template v-if="Object.keys(eventsInfo).length !== 0">
					<div class="header cell">
						<div class="label">{{ getEventsTitle(eventsInfo) }}</div>
						<div class="value">
							<!-- 渲染前两节得分 -->
							<template v-for="(period, index) in periods.slice(0, 2)" :key="index">
								<div class="num" :class="{ F2: isCurrentPeriod(index + 1) }">
									{{ period }}
								</div>
							</template>
							<!-- 半场得分 -->
							<div class="num">
								<span>{{ $t(`sports['半场']`) }}</span>
							</div>
							<template v-for="(period, index) in periods.slice(2)" :key="index + 2">
								<div class="num" :class="{ F2: isCurrentPeriod(index + 3) }">
									{{ period }}
								</div>
							</template>
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
								<!-- 渲染前两节得分 -->
								<div v-if="index < 2" class="num" :class="{ F2: isCurrentPeriod(index + 1) }">
									<span v-if="isPeriodActive(index + 1)">
										{{ score }}
									</span>
								</div>
								<!-- 在 Q2 之后插入半场得分 -->
								<div v-if="index === 1" class="num">
									<span>{{ halftimeScore(homeScores) }}</span>
								</div>
							</template>
							<!-- 渲染第三、第四节得分 -->
							<template v-for="(score, index) in homeScores.slice(2)" :key="index">
								<div class="num" :class="{ F2: isCurrentPeriod(index + 3) }">
									<span v-if="isPeriodActive(index + 3)">
										{{ score }}
									</span>
								</div>
							</template>
							<!-- 总分 -->
							<div class="num F2">
								<span>{{ totalScore(homeScores) }}</span>
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
								<!-- 渲染前两节得分 -->
								<div v-if="index < 2" class="num" :class="{ F2: isCurrentPeriod(index + 1) }">
									<span v-if="isPeriodActive(index + 1)">
										{{ score }}
									</span>
								</div>
								<!-- 在 Q2 之后插入半场得分 -->
								<div v-if="index === 1" class="num">
									<span>{{ halftimeScore(awayScores) }}</span>
								</div>
							</template>
							<!-- 渲染第三、第四节得分 -->
							<template v-for="(score, index) in awayScores.slice(2)" :key="index">
								<div class="num" :class="{ F2: isCurrentPeriod(index + 3) }">
									<span v-if="isPeriodActive(index + 3)">
										{{ score }}
									</span>
								</div>
							</template>
							<!-- 总分 -->
							<div class="num F2">
								<span>{{ totalScore(awayScores) }}</span>
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
const periods = ["Q1", "Q2", "Q3", "Q4"];

const latestLivePeriod = computed(() => props.eventsInfo?.basketballInfo?.latestLivePeriod || 0);

// 判断当前节是否是直播的最新节
const isCurrentPeriod = (period: number) => latestLivePeriod.value === period;

// 判断是否是活跃的节
const isPeriodActive = (period: number) => latestLivePeriod.value >= period;

// 计算主队得分
const homeScores = computed(() => props.eventsInfo?.basketballInfo?.homeGameScore || []);
// 计算客队得分
const awayScores = computed(() => props.eventsInfo?.basketballInfo?.awayGameScore || []);

// 计算总得分
const totalScore = (scores: number[]) => scores.reduce((acc, score) => acc + score, 0);

// 计算半场得分 (前两节得分相加)
const halftimeScore = (scores: number[]) => scores.slice(0, 2).reduce((acc, score) => acc + score, 0);
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
		background: url("/@/assets/zh-CN/sports/sidebar/basketball_s.png") center center / 100% 100% no-repeat;
		.scoreboard-center {
			position: relative;
			width: 354px;
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
						display: flex;
						align-items: center;
						justify-content: center;
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
					gap: 8px;
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
