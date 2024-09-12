<template>
	<div class="scoreboard-container">
		<div class="scoreboard" :class="'small'">
			<div class="scoreboard-center">
				<div class="header cell">
					<div class="label">上半场</div>
					<div class="value">
						<div class="icon" v-for="item in scoreboardData">
							<svg-icon :name="item.icon" size="20px"></svg-icon>
						</div>
					</div>
				</div>
				<!-- 主队 -->
				<div class="row cell">
					<div class="label">
						<div class="icon"></div>
						<div class="name">川崎前锋</div>
					</div>
					<div class="value">
						<div class="num" v-for="item in scoreboardData">{{ item.value1 }}</div>
					</div>
				</div>
				<div class="line"></div>
				<!-- 客队 -->
				<div class="row cell">
					<div class="label">
						<div class="icon"></div>
						<div class="name">北海道札幌</div>
					</div>
					<div class="value">
						<div class="num" v-for="item in scoreboardData">{{ item.value1 }}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="scoreboard-footer">
			<div class="team team1">
				<div class="team-info">
					<div class="icon"></div>
					<div class="name">川崎前锋</div>
				</div>
				<div class="foul-info">
					<div class="red">
						<span class="icon"> <svg-icon name="sports-sidebar-football-red_Card" size="16px"></svg-icon></span>
						<span class="value">1</span>
					</div>
					<div class="yellow">
						<span class="icon"> <svg-icon name="sports-sidebar-football-yellow_card" size="16px"></svg-icon></span>
						<span class="value">1</span>
					</div>
				</div>
			</div>
			<div class="event-info">
				<div class="date">
					<span>下半场</span>
					<span class="red">89:26</span>
				</div>
				<div class="score">
					<div class="value">3</div>
					<i></i>
					<div class="value">3</div>
				</div>
			</div>
			<div class="team team2">
				<div class="team-info">
					<div class="name">川崎前锋</div>
					<div class="icon"></div>
				</div>
				<div class="foul-info">
					<div class="yellow">
						<span class="icon"> <svg-icon name="sports-sidebar-football-yellow_card" size="16px"></svg-icon></span>
						<span class="value">1</span>
					</div>
					<div class="red">
						<span class="icon"> <svg-icon name="sports-sidebar-football-red_Card" size="16px"></svg-icon></span>
						<span class="value">1</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const scoreboardData = [
	// 红牌
	{
		icon: "sports-sidebar-football-red_Card",
		value1: 0,
		value2: 0,
	},
	// 黄牌
	{
		icon: "sports-sidebar-football-yellow_card",
		value1: 0,
		value2: 0,
	},
	// 半场
	{
		icon: "sports-sidebar-football-half_time",
		value1: 0,
		value2: 0,
	},
	// 全场
	{
		icon: "sports-sidebar-football-full_time",
		value1: 0,
		value2: 0,
	},
];
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
		background: url("/@/assets/zh-CN/sports/sidebar/football_s.png") center center / 100% 100% no-repeat;
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
				.icon {
					width: 20px;
					height: 20px;
				}
			}
			.row {
				width: 100%;
				height: 50px;
				.label {
					.icon {
						width: 20px;
						height: 20px;
					}
					.name {
						color: var(--Text_s);
						font-family: "PingFang SC";
						font-size: 14px;
						font-weight: 400;
					}
				}
				.num {
					width: 20px;
					height: 20px;
					display: flex;
					align-items: center;
					justify-content: center;
					color: var(--Text_s);
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
				background-color: var(--Line_2);
			}
		}
	}
	.scoreboard-footer {
		width: 100%;
		height: 68px;
		display: flex;
		padding: 0px 12px;
		border-radius: 0px 0px 8px 8px;
		background-color: var(--Bg3);
		.team {
			width: 30%;
			margin-top: 8px;
			.team-info {
				display: flex;
				gap: 8px;
				.icon {
					width: 20px;
					height: 20px;
				}
				.name {
					color: var(--Text1);
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
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
						color: var(--Text1);
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
				color: var(--Text_s);
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
					background-color: var(--Bg4);
					color: var(--Text_s);
					font-family: "DIN Alternate";
					font-size: 14px;
					font-weight: 700;
				}
				i {
					width: 16px;
					height: 2px;
					border-radius: 2px;
					background: var(--Line_2);
				}
			}
		}
	}
}
</style>
