<template>
	<div class="mt_40 pr_10 pl_10">
		<div class="cardHeader">
			<div>
				<span class="flex-center">
					<svg-icon name="sports-event_game" width="24px" height="24px" />
					<span class="Text_s fs_20">我们的游戏</span>
				</span>
			</div>
			<div class="more Text1 fs_18 curp" @click="gotoVenue" v-if="gameList.length > 3">更多</div>
		</div>

		<div class="card-list">
			<div class="card-list-item">
				<!-- 头部信息 -->
				<header class="card-header">
					<svg-icon width="20px" height="20px" style="color: var(--theme)" name="sports-football" />
					<span class="name">
						<span v-ok-tooltip>2024年欧洲杯欧洲杯欧洲杯欧洲</span>
					</span>
				</header>
				<!-- 开赛时间 -->
				<div class="sport-time"></div>
				<!-- 球队信息 -->
				<div class="sport-team-info">
					<div class="team home-team">
						<img src="" alt="" />
						<span class="name">
							<span></span>
						</span>
						<div class="sroce">
							<span></span>
						</div>
					</div>
				</div>
				<!-- 分割线 -->
				<div class="line"></div>
				<!-- 盘口 -->
				<div class="markets"></div>
				<!-- 底部更多投注 -->
				<footer>
					<div>更多投注</div>
				</footer>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import SportsApi from "/@/api/sports/sports";

const gameList = ref([]);
// 获取热门赛事
const GetPromotions = async () => {
	// 指定足球，后期可能会更改
	let sportType = 1;
	const params = {
		query: `$filter=sporttype eq ${sportType}`,
		includeMarkets: "none",
	};
	try {
		const { data } = await SportsApi.GetPromotions(params).catch((err) => err);
		if (data) {
			gameList.value = data.events;
		}
	} catch (error) {
		console.log(error);
	}
};

onMounted(() => GetPromotions());

const gotoVenue = () => {};
</script>

<style scoped lang="scss">
.cardHeader {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12px;
}
.card-list {
	width: 100%;
	display: flex;
	align-items: center;
	column-gap: 18px;
	height: 464px;
	.card-list-item {
		width: calc((100% - 36px) / 3);
		height: 100%;
		background-color: var(--Bg1);
		border-radius: 12px;
		padding: 16px 12px;
		header {
			display: flex;
			column-gap: 4px;
			width: 100%;
			height: 22px;
			align-items: center;
			.icon {
				height: 20px;
			}
			.icon,
			.collection {
				flex: 1;
			}
			.name {
				width: 100%;
				color: var(--Text1);
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.collection {
				height: 20px;
				width: 20px;
				background: linear-gradient(to bottom, #f4f5f5, #c8cacd);
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		.sport-time {
			height: 20px;
			line-height: 20px;
			margin-top: 8px;
			color: var(--Text1);
			margin-bottom: 24px;
		}
		.sport-team-info {
			display: flex;
			flex-direction: column;
			width: 100%;
			row-gap: 14px;
			.team {
				height: 38px;
				width: 100%;
				display: flex;
				align-items: center;
				img {
					width: 30px;
					height: 30px;
					flex: 1;
				}
				.name {
					width: 100%;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					font-size: 20px;
					color: var(--Text_a);
				}
				.sroce {
					height: 100%;
					width: 48px;
					border-radius: 8px;
					background-color: var(--Line_2);
					display: flex;
					justify-content: center;
					align-items: center;
					> span {
						color: var(--Text_a);
						font-family: "DIN Alternate";
						font-size: 18px;
						font-weight: 700;
					}
				}
			}
		}
		.line {
			width: 100%;
			height: 1px;
			background-color: var(--Line_1);
			margin: 14px 0;
		}
		footer {
			text-align: center;
			margin-top: 20px;
			color: var(--Text1);
			font-size: 16px;
		}
	}
}
</style>
