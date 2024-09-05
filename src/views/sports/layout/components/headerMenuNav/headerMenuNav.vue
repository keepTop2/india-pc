<!--
 * @Author: WangMingxin
 * @Description: 体育-头部-球类导航
-->
<template>
	<div class="header-container">
		<div class="menu-nav">
			<div class="left">
				<div class="nva-item" v-for="(item, index) in left" :key="index">
					<router-link :to="{ name: item.name }">{{ item.meta.title }}</router-link>
				</div>
			</div>
			<i class="line"></i>
			<div class="right">
				<div class="nva-item" v-for="(item, index) in navRight" :key="index">
					<img class="icon" :src="item.meta.iconCode" alt="" />
					<router-link :to="{ name: item.name, query: { sportsActive: sportsActive } }">{{ item.meta.title }}</router-link>
					<div class="value">1</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, computed, onUnmounted } from "vue";
import { debounce, isEmpty } from "lodash-es";
import sportsRouter from "/@/router/modules/sports/menuRight";
import sportsRouterLeft from "/@/router/modules/sports/sportsRouterLeft";

import { useRouter, useRoute } from "vue-router";
import { wTooltip } from "./components/index";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";

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
const sportsBetEvent = useSportsBetEventStore();

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
					newRight.push(item);
				}
			} else if (props.sportsActive == "rollingBall") {
				if (Number(sp.sportType) == Number(type) && sp?.liveGameCount) {
					newRight.push(item);
				}
			} else {
				if (Number(sp.sportType) == Number(type) && sp?.count) {
					newRight.push(item);
				}
			}
		});
	});
	return newRight;
});

/**
 * @description: 延时获取无值时导航
 */
const getSportList = debounce(() => {
	navRight.value = sportList.value;
	console.log("navRight.value", navRight.value);
}, 3000);
/** 查询获取右侧导航数据 */
watch(
	() => sportList.value,
	(newValue, oldValue) => {
		if (newValue && newValue.length) {
			navRight.value = newValue;
		} else {
			getSportList();
		}
	}
);

/** 获取选中查询类型；用于 wacthArray 查询 */
const cSportsActive = computed(() => {
	return props.sportsActive;
});

/** 根据体育查询类型；过滤选中  */
watch([cSportsActive, sports], ([newActive, newSports], [prevActive, prevSports]) => {
	if (newSports && newSports.length) {
		const sportsType = route.path.replace(/[^\d]/g, "");
		const sports = viewSportPubSubEventData.viewSportData.sports;
		const index = sports?.findIndex((e) => {
			if (e.sportType == sportsType) {
				return true;
			} else {
				false;
			}
		});
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

const changeBall = () => {
	// sportsBetEvent.clearShopCart();
};
</script>

<style scoped lang="scss">
.header-container {
	border-radius: 8px;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 0 24px;
	background: var(--Bg1);
	.menu-nav {
		height: 100%;
		flex: 1;
		display: flex;
		align-items: center;
		padding: 10px 0px;

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
				padding: 10px;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: var(--butter);
				border-radius: 4px;
				box-sizing: border-box;

				.icon {
					width: 16px;
					height: 16px;
				}

				a,
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
		.left {
			gap: 12px;
		}
		.right {
			gap: 8px;
			.nva-item {
				gap: 6px;
				padding: 0px 12px;
			}
		}
	}
}
</style>
