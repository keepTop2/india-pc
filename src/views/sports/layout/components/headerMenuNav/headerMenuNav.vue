<template>
	<div class="header-container">
		<div class="menu-nav">
			<div class="left">
				<div v-for="(item, index) in Menu" :key="index" class="nva-item" :class="{ active: item.name === route.name }">
					<router-link :to="{ name: item.name }">
						<span class="value">{{ item.meta.title }}</span>
					</router-link>
				</div>
			</div>
			<i class="line"></i>
			<div class="right">
				<div v-for="(item, index) in sportsData" :key="index" class="nva-item" :class="{ active: Number(sportType) == item.sportType }" @click="toPath(item)">
					<img class="icon mr_6" :src="Number(route.query.sportType) == item.sportType ? item.activeIcon : item.icon" alt="" />
					<span class="value mr_4">{{ item.sportName }}</span>
					<div class="value">{{ item.count }}</div>
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
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import MajorCategoriesMenu from "/@/router/modules/sports/sportsRouterLeft";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
const router = useRouter();
const route = useRoute();
const Menu = ref(MajorCategoriesMenu);
const sportsBetEvent = useSportsBetEventStore();
const sportType = computed(() => route.query.sportType);

// 球类tab数据
const sportsData = computed(() => viewSportPubSubEventData.viewSportData.sports);
// console.log("sportsData", sportsData);
// console.log("route.query.sportType", route.query.sportType);

// 路由初始化逻辑
const initRoute = () => {
	if (sportsData.value.length > 0) {
		// 获取第一个 sportsData 项的 sportType
		const firstSportType = sportsData.value[0].sportType;
		// 生成拼接路径
		const defaultPath = `${router.currentRoute.value.path}/${firstSportType}`;
		// 跳转到拼接后的路径
		router.push(defaultPath);
	}
};
initRoute();

const toPath = (item: any) => {
	// 路由参数与点击tab类型相同退出
	if (route.meta.type !== "list") {
		router
			.push({
				path: "/sports/todayContest/rollingBall",
				query: { sportType: item.sportType },
			})
			.catch((err) => {
				console.error("Navigation failed:", err);
				// 可以在这里添加一些错误处理逻辑
			});
	} else {
		// console.log(route.query,'=======query',router.currentRoute)
		if (route.query.sportType == item.sportType) return;
		// 获取当前路径
		const currentPath = router.currentRoute.value.path;
		// 跳转到目标路径并通过 query 传递 sportType
		router.push({
			path: currentPath,
			query: { sportType: item.sportType },
		});
	}
};

// 在组件挂载时执行初始化
onMounted(() => {});
</script>

<style scoped lang="scss">
.header-container {
	position: relative;
	width: 100%;
	height: 48px;
	display: flex;
	align-items: center;
	padding-left: 24px;
	border-radius: 8px 8px 0 0;
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
		overflow: hidden;
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
				padding: 0px 12px;
				background: var(--butter);
				border-radius: 4px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				box-sizing: border-box;
				cursor: pointer;

				.icon {
					width: 16px;
					height: 16px;
				}

				a {
					width: 100%;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					.value {
						color: var(--Text1, #98a7b5);
						text-align: center;
						font-family: "PingFang SC";
						font-size: 14px;
						font-weight: 400;
					}
				}
				.value {
					color: var(--Text1, #98a7b5);
					text-align: center;
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
				}
			}

			.active {
				background-color: var(--Theme);
				.value {
					color: var(--Text_s);
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
