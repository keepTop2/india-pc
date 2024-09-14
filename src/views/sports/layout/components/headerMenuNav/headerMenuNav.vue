<!--
 * @Author: WangMingxin
 * @Description: 体育-头部-球类导航
-->
<template>
	<div class="header-container">
		<div class="menu-nav">
			<div class="left">
				<div
					v-for="(item, index) in left"
					:key="index"
					class="nva-item"
					:class="{ active: item.name === route.name }"
				>
					<router-link :to="{ name: item.name }">
						<span class="value">{{ item.meta.title }}</span>
					</router-link>
				</div>
			</div>
			<i class="line"></i>
			<div class="right">
				<div
					v-for="(item, index) in sportList"
					:key="index"
					class="nva-item"
					:class="{ active: route.name === String(item.name) + '_list' }"
				>
					<router-link :to="{ name: item.name, query: { sportsActive } }">
						<img
							class="icon mr_6"
							:src="item.redirect === route.path ? item.meta.iconActive : item.meta.icon"
							alt=""
						/>
						<span class="value mr_4">{{ item.meta.title }}</span>
						<div class="value">{{ item.count }}</div>
					</router-link>
				</div>
				<div class="arrow_content">
					<span class="icon">
						<svg-icon name="sports-arrow_big" size="20px"></svg-icon>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, computed } from "vue";
import { debounce } from "lodash-es";
import sportsRouter from "/@/router/modules/sports/menuRight";
import sportsRouterLeft from "/@/router/modules/sports/sportsRouterLeft";
import { useRouter, useRoute } from "vue-router";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";

const router = useRouter();
const route = useRoute();
// console.log(route,'====route')
const props = withDefaults(
	defineProps<{
		sportsActive?: string;
	}>(),
	{
		sportsActive: "",
	}
);

const sportsBetEvent = useSportsBetEventStore();

const left = ref(sportsRouterLeft);
const right = ref(sportsRouter);
const navRight = ref([]);

const sports = computed(() => viewSportPubSubEventData.viewSportData.sports);

const sportList = computed(() => {
	const list = right.value.filter((item) => {
		const type = item.path.replace(/[^\d]/g, "");
		const sport = sports.value.find((sp) => Number(sp.sportType) === Number(type));
		if (!sport) return false;

		let count;
		switch (props.sportsActive) {
			case "todayContest":
				count = sport.gameCount;
				break;
			case "rollingBall":
				count = sport.liveGameCount;
				break;
			case "morningTrading":
			case "champion":
				count = sport.count;
				break;
			default:
				count = 0
				break;
		}
		item.count = count || 0;
		if (count) {
			return item;
		}
		return false;
	});
	// console.log(list, '=======list')
	return list;
});

// watch([() => props.sportsActive, sports], ([newActive, newSports]) => {
// 	if (!/^\/sports\/\d+\/list$/.test(route.path)) return;

// 	if (newSports && newSports.length) {
// 		const sportsType = route.path.replace(/[^\d]/g, "");
// 		const index = newSports.findIndex((e) => e.sportType === Number(sportsType));
// 		if (index === -1) {
// 			router.push({
// 				path: navRight.value[0].path,
// 				query: { sportsActive: props.sportsActive },
// 			});
// 		}
// 	}
// });

onMounted(() => {
	// Initialization logic if needed
});
</script>

<style scoped lang="scss">
.header-container {
	position: relative;
	width: 100%;
	height: 48px;
	display: flex;
	align-items: center;
	padding-left: 24px;
	background: var(--Bg1);
	overflow: hidden;
	box-sizing: border-box;

	.arrow_content {
		position: absolute;
		top: 0;
		right: 0;
		width: 40px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--butter);

		.icon {
			transform: rotate(90deg);
			color: var(--Icon_1);
		}
	}

	.menu-nav {
		height: 100%;
		flex: 1;
		display: flex;
		align-items: center;
		padding: 10px 0;
		padding-right: 40px;
		box-sizing: border-box;

		.line {
			width: 1px;
			height: 34px;
			margin: 0 12px;
			background: var(--Line_1);
			box-shadow: 1px 0 0 0 #343d48;
		}

		.left,
		.right {
			display: flex;

			.nva-item {
				min-width: 80px;
				height: 30px;
				display: flex;
				align-items: center;
				justify-content: center;
				background: var(--butter);
				border-radius: 4px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				box-sizing: border-box;

				a {
					display: flex;
					width: 100%;
					height: 100%;
					align-items: center;
					justify-content: center;
					padding: 0 12px;
					text-decoration: none;

					.icon {
						width: 16px;
						height: 16px;
					}

					.value {
						color: var(--Text1, #98a7b5);
						text-align: center;
						font-family: "PingFang SC";
						font-size: 14px;
						font-weight: 400;
					}
				}
			}

			.active {
				background-color: var(--Theme);
				a {
					color: var(--Text_a);
					.value {
						color: var(--Text_a);
					}
				}
			}
		}

		.left {
			gap: 12px;
		}

		.right {
			width: calc(100% - 270px);
			padding-right: 12px;
			gap: 8px;
			overflow-x: auto;
			white-space: nowrap;
			scrollbar-width: none;
			-ms-overflow-style: none;

			&::-webkit-scrollbar {
				display: none;
			}

			.nva-item {
				flex-shrink: 0;
				gap: 6px;
			}
		}
	}
}
</style>
