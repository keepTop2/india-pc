<!--
 * @Author: WangMingxin
 * @Description: 体育-头部-球类导航
-->
<template>
	<div class="header-container">
		<div class="menu-nav">
			<div class="left">
				<div class="nva-item" :class="{ active: item.name == route.name }" v-for="(item, index) in left" :key="index">
					<router-link :to="{ name: item.name }">
						<span class="value">{{ item.meta.title }}</span>
					</router-link>
				</div>
			</div>
			<i class="line"></i>
			<div class="right">
				<div class="nva-item" v-for="(item, index) in navRight" :key="index">
					<router-link :to="{ name: item.name, query: { sportsActive: sportsActive } }">
						<img class="icon mr_6" :src="item.redirect == route.path ? item.meta.iconActive : item.meta.icon" alt="" />
						<span class="value mr_4">{{ item.meta.title }}</span>
						<div class="value">{{ item.count }}</div>
					</router-link>
				</div>

				<div class="arrow_content">
					<span class="icon"><svg-icon name="sports-arrow_big" size="20px"></svg-icon></span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import sportsRouter from "/@/router/modules/sports/menuRight";
import sportsRouterLeft from "/@/router/modules/sports/sportsRouterLeft";
import { useRouter, useRoute } from "vue-router";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";

const router = useRouter();
const route = useRoute();

const props = withDefaults(
	defineProps<{
		/**
		 * @description:选中的赛选类型
		 */
		sportsActive?: string;
	}>(),
	{
		sportsActive: "",
	}
);

const left = ref(sportsRouterLeft);

/**右侧基础路由 */
const right = ref(sportsRouter);
/** 右侧最后路由 */
const navRight: any = ref([]);

/**
 * @description 球类列表
 */
const sports = computed(() => viewSportPubSubEventData.viewSportData.sports);

/**
 * @description 球类导航列表
 */
const sportList = computed(() => {
	let newRight: any[] = [];
	right.value.forEach((item) => {
		const type = item.path.replace(/[^\d]/g, "");
		sports.value.forEach((sp) => {
			if (props.sportsActive == "todayContest") {
				if (Number(sp.sportType) == Number(type) && sp?.gameCount) {
					newRight.push({ ...item, count: sp?.gameCount });
				}
			} else if (props.sportsActive == "rollingBall") {
				if (Number(sp.sportType) == Number(type) && sp?.liveGameCount) {
					newRight.push({ ...item, count: sp?.liveGameCount });
				}
			} else if (props.sportsActive == "morningTrading" || props.sportsActive == "champion") {
				if (Number(sp.sportType) == Number(type) && sp?.count) {
					newRight.push({ ...item, count: sp?.count });
				}
			}
		});
	});
	return newRight;
});

/** 查询获取右侧导航数据 */
watch(
	() => sportList.value,
	(newValue, oldValue) => {
		if (newValue && newValue.length) {
			navRight.value = newValue;
		}
	}
);

/** 获取选中查询类型；用于 wacthArray 查询 */
const cSportsActive = computed(() => {
	return props.sportsActive;
});

/** 根据体育查询类型；过滤选中  */
watch([cSportsActive, sports], ([newActive, newSports], [prevActive, prevSports]) => {
	if (!/^\/sports\/\d+\/list$/.test(route.path)) {
		return false;
	}
	if (newSports && newSports.length) {
		const sportsType = route.path.replace(/[^\d]/g, "");
		const sports = viewSportPubSubEventData.viewSportData.sports;
		const index = sports?.findIndex((e) => e.sportType === Number(sportsType));
		if (index == -1) {
			const params = {
				sportsActive: props.sportsActive,
			};
			router.push({ path: navRight.value[0].path, query: params });
		}
	}
});

/**是否显示搜索按钮 */
const isSeach = computed(() => {
	// 	if (route.name?.indexOf("football") != -1 || route.name?.indexOf("basketball") != -1) {
	// 		if (route?.query?.sportsActive == `champion`) {
	// 			return false;
	// 		} else {
	// 			return true;
	// 		}
	// 	} else {
	// 		return false;
	// 	}
});

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
	background: var(--Bg1);
	overflow: hidden;
	box-sizing: border-box;
	.arrow_content {
		position: absolute;
		top: 0px;
		right: 0px;
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
		padding: 10px 0px;
		padding-right: 40px;
		box-sizing: border-box;

		.line {
			width: 1px;
			height: 34px;
			margin: 0px 12px;
			background: var(--Line_1);
			box-shadow: 1px 0px 0px 0px #343d48;
		}

		.left,
		.right {
			display: flex;

			.nva-item {
				min-width: 80px;
				height: 30px;
				// padding: 10px;
				display: flex;
				align-items: center;
				justify-content: center;
				background: var(--butter);
				border-radius: 4px;
				white-space: nowrap; /* 禁止换行 */
				overflow: hidden; /* 隐藏超出容器的内容 */
				text-overflow: ellipsis; /* 使用省略号代替超出的文本 */
				box-sizing: border-box;

				a {
					display: block;
					width: 100%;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 0px 12px;
					text-decoration: dashed;
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
						text-decoration: none;
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
			overflow-x: auto; /* 确保横向滚动 */
			white-space: nowrap; /* 防止内容换行 */
			scrollbar-width: none; /* 隐藏滚动条 Firefox */
			-ms-overflow-style: none; /* 隐藏滚动条 IE 和 Edge */

			&::-webkit-scrollbar {
				display: none; /* 隐藏滚动条 Chrome 和 Safari */
			}

			.nva-item {
				flex-shrink: 0; /* 防止内容被压缩 */
				gap: 6px;
				// padding: 0px 12px;
			}
		}
	}
}
</style>
