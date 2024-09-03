<!--
 * @Author: WangMingxin
 * @Description: 体育-头部-球类导航
-->
<template>
	<div class="header-container">
		<div class="menu-nav">
			<div class="left">
				<template v-for="(item, index) in left" :key="index">
					<wTooltip class="box-item" :content="item?.meta?.title">
						<div class="nva-item">
							<router-link :to="{ name: item.name }" active-class="selected">
								<div class="icon">
									<SvgIcon :size="18" :iconName="item?.meta?.iconCode || `Casino`" class="iconSvg" />
								</div>
							</router-link>
						</div>
					</wTooltip>
				</template>
			</div>
			<el-divider direction="vertical" />
			<div class="right">
				<template v-for="(item, index) in navRight" :key="index">
					<wTooltip class="box-item" v-if="!item?.meta?.isHide" :content="item?.meta?.title">
						<div class="nva-item">
							<router-link :to="{ name: item.name, query: { sportsActive: sportsActive } }" active-class="selected" @click="changeBall">
								<div class="icon">
									<SvgIcon :size="18" :iconName="item?.meta?.iconCode || `Casino`" class="iconSvg" />
								</div>
							</router-link>
						</div>
					</wTooltip>
				</template>
			</div>
		</div>
		<div class="seach">
			<wTooltip class="box-item" content="搜索">
				<div class="nva-item">
					<div class="icon">
						<SvgIcon @click="onSeach" :size="18" iconName="ty_icon_ss" class="iconSvg" />
					</div>
				</div>
			</wTooltip>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, computed, onUnmounted } from "vue";
import { debounce, isEmpty } from "lodash-es";
import sportsRouter from "/@/router/sports/menuRight";
import sportsRouterLeft from "/@/router/sports/sportsRouterLeft";

import { useRouter, useRoute } from "vue-router";
import { wTooltip } from "./components/index";
import viewSportPubSubEventData from "/@/hooks/sport/viewSportPubSubEventData";
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
	let newRight = [];
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

const onSeach = () => {
	// 使用正则表达式匹配数字部分
	const match = route.path.match(/\/sports\/(\d+)\/list/);
	const sportType = parseInt(match[1]);
	const params = {
		sportType: sportType,
		// eventId: props?.teamData?.eventId,
		// dataIndex: props?.dataIndex,
	};
	/** 路由地址处理 */
	const splArr = route.path.split("/");
	const getLastStr = splArr[splArr.length - 1];
	const path = route.path.replace(getLastStr, "sportsLeagueSearch");
	router.push({ path: path, query: params });
};

const changeBall = () => {
	// sportsBetEvent.clearShopCart();
};
</script>

<style scoped lang="scss">
.header-container {
	// width: 100%;
	// width: 1246px;
	height: 68px;
	border-radius: 8px;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 0 10px;
	background: var(--Bg1);
	.menu-nav {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 100%;

		.el-divider {
			&.el-divider--vertical {
				width: 2px;
				height: 48px;
				flex-shrink: 0;
				border-radius: 2px;
				border: 0px;

				background: var(--Line);
			}
		}

		.left,
		.right {
			display: flex;

			.nva-item {
				width: 32px;
				height: 32px;
				margin: 0px 12px;

				.icon {
					width: 100%;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					overflow: hidden;
					color: var(--icon);

					.iconSvg {
						width: 100%;
						height: 100%;
					}
				}

				.selected {
					.icon {
						color: var(--Theme);
					}
				}
			}
		}
	}

	.seach {
		.nva-item {
			width: 24px;
			height: 24px;
			margin: 0 12px;

			.icon {
				width: 100%;
				height: 100%;

				color: var(--icon);
				.iconSvg {
					width: 100%;
					height: 100%;
				}
			}

			.selected {
				.icon {
					color: var(--Theme);
				}
			}
		}
	}
}
</style>
