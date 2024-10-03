<template>
	<div class="scoreboard-container">
		<div class="scoreboard" :class="'small'" :style="{ background: `url(${backgroundImage}) center center / 100% 100% no-repeat` }">
			<div class="scoreboard-center">
				<template v-if="Object.keys(eventsInfo).length !== 0">
					<div class="scoreboard-header">{{ eventsInfo.leagueName }}</div>
					<div class="scoreboard-info">
						<div class="home-team-info">
							<div class="home-team-name">{{ eventsInfo?.teamInfo?.homeName }}</div>
							<div class="home-team-icon"><img :src="eventsInfo?.teamInfo?.homeIconUrl" alt="" /></div>
						</div>
						<div class="date">{{ getEventsTitle(eventsInfo) }}</div>
						<div class="away-team-info">
							<div class="away-team-icon"><img :src="eventsInfo?.teamInfo?.awayIconUrl" alt="" /></div>
							<div class="away-team-name">{{ eventsInfo?.teamInfo?.awayName }}</div>
						</div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// 静态资源
import americanSoccer_l from "/@/assets/zh-CN/sports/sidebar/americanSoccer_l.png";
import americanSoccer_s from "/@/assets/zh-CN/sports/sidebar/americanSoccer_s.png";
import badminton_l from "/@/assets/zh-CN/sports/sidebar/badminton_l.png";
import badminton_s from "/@/assets/zh-CN/sports/sidebar/badminton_s.png";
import baseBall_l from "/@/assets/zh-CN/sports/sidebar/baseBall_l.png";
import baseBall_s from "/@/assets/zh-CN/sports/sidebar/baseBall_s.png";
import basketball_l from "/@/assets/zh-CN/sports/sidebar/basketball_l.png";
import basketball_s from "/@/assets/zh-CN/sports/sidebar/basketball_s.png";
import billiards_l from "/@/assets/zh-CN/sports/sidebar/billiards_l.png";
import billiards_s from "/@/assets/zh-CN/sports/sidebar/billiards_s.png";
import eSports_l from "/@/assets/zh-CN/sports/sidebar/eSports_l.png";
import eSports_s from "/@/assets/zh-CN/sports/sidebar/eSports_s.png";
import football_l from "/@/assets/zh-CN/sports/sidebar/football_l.png";
import football_s from "/@/assets/zh-CN/sports/sidebar/football_s.png";
import iceHockey_l from "/@/assets/zh-CN/sports/sidebar/iceHockey_l.png";
import iceHockey_s from "/@/assets/zh-CN/sports/sidebar/iceHockey_s.png";
import tennis_l from "/@/assets/zh-CN/sports/sidebar/tennis_l.png";
import tennis_s from "/@/assets/zh-CN/sports/sidebar/tennis_s.png";
import volleyball_l from "/@/assets/zh-CN/sports/sidebar/volleyball_l.png";
import volleyball_s from "/@/assets/zh-CN/sports/sidebar/volleyball_s.png";

import { computed } from "vue";
import { SportsRootObject } from "/@/views/sports/models/interface";
import SportsCommonFn from "/@/views/sports/utils/common";
import { useRouter, useRoute } from "vue-router";
const { getEventsTitle } = SportsCommonFn;
const route = useRoute();

const props = withDefaults(
	defineProps<{
		size?: "small" | "large";
		eventsInfo: SportsRootObject;
	}>(),
	{
		size: "small",
	}
);

// 映射字典
const backgroundMap = {
	small: {
		"1": football_s,
		"2": basketball_s,
		"3": americanSoccer_s,
		"4": iceHockey_s,
		"5": tennis_s,
		"6": volleyball_s,
		"7": billiards_s,
		"8": baseBall_s,
		"9": badminton_s,
		"43": eSports_s,
	},
	large: {
		"1": football_l,
		"2": basketball_l,
		"3": americanSoccer_l,
		"4": iceHockey_l,
		"5": tennis_l,
		"6": volleyball_l,
		"7": billiards_l,
		"8": baseBall_l,
		"9": badminton_l,
		"43": eSports_l,
	},
};

// 响应式计算属性获取背景图像
const backgroundImage = computed(() => {
	const size = props.size; // 根据实际的 prop 获取值
	const sportType = props.eventsInfo.sportType || "1"; // 默认值为 "1"
	return backgroundMap[size]?.[sportType] || backgroundMap[size]?.["1"]; // 返回对应的背景图像或默认图像
});
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

		.scoreboard-center {
			position: relative;
			width: 366px;
			border-radius: 8px;
			background-color: var(--scoreboard_bg);
			overflow: hidden;
			.scoreboard-header {
				width: 100%;
				height: 36px;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: var(--Bg3);
				color: var(--Text_a);
				text-align: center;
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
			}
			.scoreboard-info {
				width: 100%;
				height: 102px;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 24px;
			}
			.date {
				width: 50px;
				color: var(--Text_a);
				text-align: center;
				font-family: "PingFang SC";
				font-size: 12px;
				font-weight: 400;
			}
			.home-team-info,
			.away-team-info {
				width: calc(50% - 50px);
				display: flex;
				align-items: center;
				gap: 8px;
				.home-team-icon,
				.away-team-icon {
					width: 30px;
					height: 30px;
					img {
						width: 100%;
						height: 100%;
					}
				}
				.home-team-name,
				.away-team-name {
					max-width: 72px;
					color: var(--Text_a);
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
					display: -webkit-box; /* 必须结合以下两个属性来实现多行文本截断 */
					-webkit-box-orient: vertical; /* 设置为垂直排列 */
					-webkit-line-clamp: 2; /* 限制显示两行 */
					overflow: hidden; /* 超出部分隐藏 */
					text-overflow: ellipsis; /* 超出显示省略号 */
					white-space: normal; /* 允许换行 */
				}
			}
			.home-team-info {
				justify-content: end;
			}
		}
	}
}
</style>
