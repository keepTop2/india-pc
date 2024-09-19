<template>
	<div class="scoreboard-container">
		<div class="scoreboard" :class="'small'">
			<div class="scoreboard-center">
				<template v-if="Object.keys(eventsInfo).length !== 0">
					<div class="header cell">
						<div class="label">{{ getEventsTitle(eventsInfo) }}</div>
						<div class="value">
							<!-- 渲染前两节得分 -->
							<div class="num-content">
								<div v-if="canScrollLeft" class="left-icon" @click="scrollLeft"><svg-icon name="sports-arrow" width="8px" height="12px"></svg-icon></div>
								<div class="num-container">
									<div class="num-list" :style="{ transform: `translateX(-${scrollPosition}px)` }">
										<div v-for="(period, index) in gameSession" :key="index" class="num" :class="{ F2: isCurrentPeriod(index + 1) }">
											{{ period }}
										</div>
									</div>
								</div>
								<div v-if="canScrollRight" class="right-icon" @click="scrollRight"><svg-icon name="sports-arrow" width="8px" height="12px"></svg-icon></div>
							</div>
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
							<div class="num-content">
								<div class="num-container">
									<div class="num-list" :style="{ transform: `translateX(-${scrollPosition}px)` }">
										<div v-for="(score, index) in homeScores" :key="index" class="num" :class="{ F2: isCurrentPeriod(index + 1) }">
											<span v-if="isPeriodActive(index + 1)">
												{{ score }}
											</span>
										</div>
									</div>
								</div>
							</div>
							<!-- 总分 -->
							<div class="num F2">
								<span>{{ eventsInfo?.baseballInfo?.homeCurrentPoint }}</span>
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
							<div class="num-content">
								<div class="num-container">
									<div class="num-list" :style="{ transform: `translateX(-${scrollPosition}px)` }">
										<div v-for="(score, index) in awayScores" :key="index" class="num" :class="{ F2: isCurrentPeriod(index + 1) }">
											<span v-if="isPeriodActive(index + 1)">
												{{ score }}
											</span>
										</div>
									</div>
								</div>
							</div>
							<!-- 总分 -->
							<div class="num F2">
								<span>{{ eventsInfo?.baseballInfo?.awayCurrentPoint }}</span>
							</div>
						</div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
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

const itemWidth = 30; // 每个子项宽度为 30px
const visibleItems = 5; // 容器内可见的子项数量
const scrollPosition = ref(0); // 当前滚动的位置

// 总共的盘数
const gameSession = computed(() => props.eventsInfo?.gameSession || 0);
// 当前盘数
const currentInning = computed(() => props.eventsInfo?.baseballInfo?.currentInning || 1);

// 判断当前节是否是直播的最新节
const isCurrentPeriod = (period: number) => currentInning.value === period;

// 判断是否是活跃的节
const isPeriodActive = (period: number) => gameSession.value >= period;

// 计算主队得分
const homeScores = computed(() => props.eventsInfo?.baseballInfo?.homeGameScore || []);
// 计算客队得分
const awayScores = computed(() => props.eventsInfo?.baseballInfo?.awayGameScore || []);

// 可滚动的最大位置
const maxScrollPosition = computed(() => (gameSession.value - visibleItems) * itemWidth);

// 向左滚动
const scrollLeft = () => {
	if (scrollPosition.value > 0) {
		scrollPosition.value -= itemWidth;
	}
};

// 向右滚动
const scrollRight = () => {
	if (scrollPosition.value < maxScrollPosition.value) {
		scrollPosition.value += itemWidth;
	}
};

// 是否能向左滚动
const canScrollLeft = computed(() => scrollPosition.value > 0);

// 是否能向右滚动
const canScrollRight = computed(() => scrollPosition.value < maxScrollPosition.value);
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
		background: url("/@/assets/zh-CN/sports/sidebar/baseBall_s.png") center center / 100% 100% no-repeat;
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
					// width: 120px;
					flex: 1;
					display: flex;
					gap: 5px;
				}
				.value {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 2px;
				}
				.num-content {
					position: relative;
					width: 150px;
					margin: 0px 20px 0px 15px;

					.num-container {
						// width: 100%;
						width: 150px;
						overflow: hidden;
						.num-list {
							width: 270px;
							display: flex;
						}
					}

					.left-icon,
					.right-icon {
						position: absolute;
						width: 20px;
						height: 20px;
						display: flex;
						align-items: center;
						justify-content: center;
						cursor: pointer;
					}
					.left-icon {
						top: 50%;
						left: -15px;
						transform: translate(0, -50%) rotate(-180deg);
					}
					.right-icon {
						top: 50%;
						right: -15px;
						transform: translate(0, -50%);
					}
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
