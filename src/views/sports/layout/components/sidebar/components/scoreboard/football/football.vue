<template>
	<div class="scoreboard-container">
		<div class="scoreboard" :class="'small'">
			<div class="scoreboard-center">
				<div class="header cell">
					<div class="label">{{ getEventsTitle(eventsInfo) }} {{ gameTime }}</div>
					<div class="value">
						<div class="icon"><svg-icon name="sports-sidebar-football-red_Card" size="20px"></svg-icon></div>
						<div class="icon"><svg-icon name="sports-sidebar-football-yellow_card" size="20px"></svg-icon></div>
						<div class="icon"><svg-icon name="sports-sidebar-football-half_time" size="20px"></svg-icon></div>
						<div class="icon"><svg-icon name="sports-sidebar-football-full_time" size="20px"></svg-icon></div>
					</div>
				</div>
				<!-- 主队 -->
				<div class="row cell">
					<div class="label">
						<div class="icon"><img :src="eventsInfo?.teamInfo?.homeIconUrl" alt="" /></div>
						<div class="name">
							<span v-ok-tooltip>{{ eventsInfo?.teamInfo?.homeName }}</span>
						</div>
					</div>
					<div class="value">
						<div class="num">{{ eventsInfo?.soccerInfo?.homeRedCard }}</div>
						<div class="num">{{ eventsInfo?.soccerInfo?.homeYellowCard }}</div>
						<div class="num">{{ 0 }}</div>
						<div class="num F2">{{ eventsInfo?.gameInfo?.liveHomeScore }}</div>
					</div>
				</div>
				<div class="line"></div>
				<!-- 客队 -->
				<div class="row cell">
					<div class="label">
						<div class="icon"><img :src="eventsInfo?.teamInfo?.awayIconUrl" alt="" /></div>
						<div class="name">
							<span v-ok-tooltip>{{ eventsInfo?.teamInfo?.awayName }}</span>
						</div>
					</div>
					<div class="value">
						<div class="num">{{ eventsInfo?.soccerInfo?.awayRedCard }}</div>
						<div class="num">{{ eventsInfo?.soccerInfo?.awayYellowCard }}</div>
						<div class="num">{{ 0 }}</div>
						<div class="num F2">{{ eventsInfo?.gameInfo?.liveAwayScore }}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="scoreboard-footer">
			<div class="team team1">
				<div class="team-info">
					<div class="icon"><img :src="eventsInfo?.teamInfo?.homeIconUrl" alt="" /></div>
					<div class="name">{{ eventsInfo?.teamInfo?.homeName }}</div>
				</div>
				<div class="foul-info">
					<div class="red">
						<span class="icon"> <svg-icon name="sports-sidebar-football-red_Card" size="16px"></svg-icon></span>
						<span class="value">{{ eventsInfo?.soccerInfo?.homeRedCard }}</span>
					</div>
					<div class="yellow">
						<span class="icon"> <svg-icon name="sports-sidebar-football-yellow_card" size="16px"></svg-icon></span>
						<span class="value">{{ eventsInfo?.soccerInfo?.homeYellowCard }}</span>
					</div>
				</div>
			</div>
			<div class="event-info">
				<div class="date">
					<span class="red">{{ getEventsTitle(eventsInfo) }} {{ gameTime }}</span>
					<!-- <span class="red">89:26</span> -->
				</div>
				<div class="score">
					<div class="value">{{ eventsInfo?.gameInfo?.liveHomeScore }}</div>
					<i></i>
					<div class="value">{{ eventsInfo?.gameInfo?.liveAwayScore }}</div>
				</div>
			</div>
			<div class="team team2">
				<div class="team-info">
					<div class="name">{{ eventsInfo?.teamInfo?.awayName }}</div>
					<div class="icon"><img :src="eventsInfo?.teamInfo?.awayIconUrl" alt="" /></div>
				</div>
				<div class="foul-info">
					<div class="yellow">
						<span class="icon"> <svg-icon name="sports-sidebar-football-yellow_card" size="16px"></svg-icon></span>
						<span class="value">{{ eventsInfo?.soccerInfo?.awayYellowCard }}</span>
					</div>
					<div class="red">
						<span class="icon"> <svg-icon name="sports-sidebar-football-red_Card" size="16px"></svg-icon></span>
						<span class="value">{{ eventsInfo?.soccerInfo?.awayRedCard }}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="line"></div>
	</div>
</template>

<script setup lang="ts">
import { SportsRootObject } from "/@/views/sports/models/interface";
import SportsCommonFn from "/@/views/sports/utils/common";
import useGameTimer from "/@/views/sports/hooks/useGameTimer";
import { computed } from "vue";
const { getEventsTitle } = SportsCommonFn;

const props = withDefaults(
	defineProps<{
		eventsInfo: SportsRootObject;
	}>(),
	{}
);

//比赛时间
const gameState = computed(() => props.eventsInfo);
const { gameTime } = useGameTimer(gameState);
</script>

<style scoped lang="scss">
.scoreboard-container {
	width: 100%;
	height: 100%;

	// 侧边栏小布局样式
	.small {
		width: 100%;
		height: 208px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: url("/@/assets/zh-CN/sports/sidebar/football_s.png") center center / 100% 100% no-repeat;
		.scoreboard-center {
			position: relative;
			width: 354px;
			border-radius: 8px;
			background-color: var(--scoreboard_bg);
			overflow: hidden;

			.header {
				width: 100%;
				height: 36px;
				background: var(--Bg-3);
				border-radius: 8px 8px 0px 0px;
				.label {
					color: var(--Text-s);
					font-family: "PingFang SC";
					font-size: 12px;
					font-weight: 400;
				}
				.icon {
					width: 20px;
					height: 20px;
				}
			}
			.row {
				width: 100%;
				height: 50px;
				.label {
					overflow: hidden;
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
					.name,
					:deep(.name) {
						flex: 1;
						color: var(--Text-1);
						font-family: "PingFang SC";
						font-size: 14px;
						font-weight: 400;
						white-space: nowrap; /* 强制文本在一行显示 */
						overflow: hidden; /* 隐藏超出容器的文本 */
						text-overflow: ellipsis; /* 使用省略号来表示被截断的文本 */
						cursor: pointer;
					}
				}
				.num {
					width: 20px;
					height: 20px;
					display: flex;
					align-items: center;
					justify-content: center;
					color: var(--Text-s);
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
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
				}
			}
			.line {
				width: 342px;
				height: 1px;
				margin: 0 auto;
				border-radius: 2px;
				opacity: 0.5;
				background-color: var(--Line-2);
			}
		}
	}
	.scoreboard-footer {
		width: 100%;
		height: 68px;
		display: flex;
		padding: 0px 12px;
		background-color: var(--Bg-1);
		.team {
			width: 30%;
			margin-top: 8px;
			.team-info {
				display: flex;
				gap: 8px;

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
					flex: 1;
					color: var(--Text-1);
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
					white-space: nowrap; /* 强制文本在一行显示 */
					overflow: hidden; /* 隐藏溢出内容 */
					text-overflow: ellipsis; /* 溢出时显示省略号 */
				}
			}
			.foul-info {
				display: flex;
				gap: 10px;
				margin-top: 9px;
				.red,
				.yellow {
					display: flex;
					align-items: center;
					gap: 4px;
					.icon {
						width: 16px;
						height: 16px;
					}
					.value {
						color: var(--Text-1);
						font-family: "PingFang SC";
						font-size: 12px;
						font-weight: 400;
						line-height: 15px;
					}
				}
			}
		}
		.team2 {
			text-align: end;
			.team-info,
			.foul-info {
				justify-content: end;
			}
		}
		.event-info {
			width: 40%;
			.date {
				display: flex;
				justify-content: center;
				gap: 4px;
				margin-top: 8px;
				color: var(--Text-s);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
				.red {
					color: var(--Theme);
				}
			}
			.score {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 4px;
				margin-top: 4px;
				.value {
					width: 22px;
					height: 28px;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 4px;
					background-color: var(--Bg-4);
					color: var(--Text-s);
					font-family: "DIN Alternate";
					font-size: 14px;
					font-weight: 700;
				}
				i {
					width: 16px;
					height: 2px;
					border-radius: 2px;
					background: var(--Line-2);
				}
			}
		}
	}

	.line {
		width: 370px;
		height: 1px;
		background: var(--Line-1);
		box-shadow: 0px 1px 0px 0px var(--Line-2);
	}
}
</style>
