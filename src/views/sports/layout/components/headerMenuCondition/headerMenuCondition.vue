<!--
 * @Author: WangMingxin
 * @Description: 体育-头部-条件区分
-->
<template>
	<div class="heaerMenuCondition-container">
		<div class="left">
			<template v-for="(item, index) in classification" :key="index">
				<template v-if="item.type == `today`">
					<wButton :active="item.active" @click="onType(item)"> {{ item.label }}</wButton>
					<wSwitch :switchObj="switchObj" :disabled="switchDisable.left" @selected="wSwitchSelect"></wSwitch>
				</template>
				<template v-else>
					<wButton :active="item.active" @click="onType(item)"> {{ item.label }}</wButton>
				</template>
			</template>
		</div>
		<div class="right">
			<wSwitch v-if="isShowTime" :switchObj="switchObjRight" :disabled="switchDisable.right" @selected="wSwitchSelectRight"></wSwitch>
			<div class="btnIcon">
				<div class="icon" @click="onRefresh">
					<SvgIcon iconName="refresh_sports" class="iconSvg" />
				</div>
				<div class="icon" @click="onExpandAndCollapse">
					<SvgIcon iconName="doubleArrowUp_sports" class="iconSvg" :class="{ doubleArrowUp_sports: isFold }" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import moment from "moment";
import { wButton, wSwitch } from "./components";

import { useRouter, useRoute } from "vue-router";
import pubSub from "/@/pubSub/pubSub";
import sportsApi from "/@/api/menu/sports/sports";
import SportsCommon from "/@/utils/sports/common";
import { usePopularLeague } from "/@/stores/modules/sports/popularLeague";
import { useSportLeagueSeachStore } from "/@/stores/modules/sports/sportLeagueSeach";
import { useSportSortStore } from "/@/stores/modules/sports/sportSort";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";

import { useSportMorningTradingStore } from "/@/stores/modules/sports/sportMorningTrading";

const SportAttentionStore = useSportAttentionStore();
const isFold = computed(() => SportAttentionStore.isFold);

const router = useRouter();
const route = useRoute();

const SportLeagueSeachStore = useSportLeagueSeachStore();
const SportSortStore = useSportSortStore();
const popularLeague = usePopularLeague();
const SportMorningTradingStore = useSportMorningTradingStore();

/*展示热门联赛*/
popularLeague.showPopularLeague();
// [
// 	{ label: "滚球", path: "rollingBall" },
// 	{ label: "今日", path: "todayContest" },
// 	{ label: "早盘", path: "morningTrading" },
// 	{ label: "冠军", path: "champion" },
// 	{ label: "关注", path: "attention" },
// 	{ label: "赛果", path: "matchResult" },
// ];
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

// 监听路由变化 重置收起展开图标
watch(
	() => route.path,
	() => {
		SportAttentionStore.setIsFold(false);
	}
);
/**
 * @description: 设置默认选中项
 */
const setDefaultActive = () => {
	/** 判断第一层赛选对象 */
	classification.value.forEach((item) => {
		if (item.type == props.sportsActive && !item.active) {
			onType(item);
		}
	});
	/** 判断第二层赛选对象 */
	Object.keys(switchObj.value).forEach((key) => {
		if (switchObj.value[key].type == props.sportsActive) {
			switchObj.value[key].active = true;
		} else {
			switchObj.value[key].active = false;
		}
	});
};

/**是否显示 排序方式按钮 */
const isShowTime = computed(() => {
	if (route.name?.indexOf("football") != -1 || route.name?.indexOf("basketball") != -1) {
		if (route?.query?.sportsActive == `champion`) {
			return false;
		} else {
			return true;
		}
	} else {
		return false;
	}
});

onMounted(() => {
	setDefaultActive();

	wSwitchSelectRight(!SportSortStore.getIsActiveHot, true);
});

const emit = defineEmits(["onRefresh", "onExpand", "onCollapse", "onType"]);
/** switch组件禁用命令  */
const switchDisable = ref({
	left: false,
	right: false,
});

/**
 * @description: 分类
 */
const classification = ref([
	{ label: "今日", type: "today", active: true },
	{ label: "早盘", type: "morningTrading", active: false },
	{ label: "冠军", type: "champion", active: false },
]);

/**
 * @description: 今日下-按钮配置
 */
const switchObj = ref({
	on: { label: "未开赛", type: "todayContest", active: false },
	off: { label: "滚球", type: "rollingBall", active: true },
});

/**
 * @description: 左侧Switch选项
 * @param {*} checked 选中状态
 */
const wSwitchSelect = (checked: boolean) => {
	if (checked) {
		SportSortStore.setMenuIsLive(false);
		SportAttentionStore.setIsFold(false);
		switchObj.value.on.active = true;
		switchObj.value.off.active = false;
		emit("onType", switchObj.value.on);
	} else {
		SportSortStore.setMenuIsLive(true);
		SportAttentionStore.setIsFold(false);
		switchObj.value.on.active = false;
		switchObj.value.off.active = true;
		emit("onType", switchObj.value.off);
	}
};
/**
 * @description: 热门-时间
 */
const switchObjRight = ref({
	on: { label: "时间", type: "time", active: true },
	off: { label: "热门", type: "hot", active: false },
});

watch(
	() => SportSortStore.getHotLeagueList,
	(newValue, oldValue) => {
		if (!newValue.length) {
			switchObjRight.value.on.active = true;
			switchObjRight.value.off.active = false;
		} else {
			switchObjRight.value.on.active = false;
			switchObjRight.value.off.active = true;
		}
	}
);
/**
 * @description: 右侧 热门时间变动时；
 * @param {*} checked 选中状态
 */
const wSwitchSelectRight = async (checked: boolean, isMounted: boolean = false) => {
	if (checked) {
		// SportLeagueSeachStore.clearLeagueSelect();
		SportSortStore.setIsActiveHot(false);
		SportSortStore.clearHotLeagueList();
		switchObjRight.value.on.active = true;
		switchObjRight.value.off.active = false;
	} else {
		switchObjRight.value.on.active = false;
		switchObjRight.value.off.active = true;
		await GetPromotions();
	}
	!isMounted && onRefresh();
};

/**
 * @description 调用获取热门赛事
 */
const GetPromotions = async () => {
	/** 路由地址处理 */
	const splArr = route.path.split("/");
	let sportType = 0;
	/**查找当前球类型 */
	for (let i = 0; i < splArr.length; i++) {
		const num = Number(splArr[i]);
		if (num && num.toString() != "NaN") {
			sportType = num;
			break;
		}
	}

	const params = {
		query: `$filter=sporttype eq ${sportType}`,
		includeMarkets: "none",
	};
	const res = await sportsApi.GetPromotions(params).catch((err) => err);
	//获取赛果数量后 添加到sports中
	if (res.data) {
		const list = res.data.events;
		SportSortStore.setHotLeagueList(list);
		SportSortStore.setIsActiveHot(true);
	}
};

/**
 * @description: 体育 游戏分类切换
 */
const onType = (e: any) => {
	SportSortStore.setMenuTab(e.type);
	classification.value.forEach((item) => {
		if (e.type == item.type) {
			SportAttentionStore.setIsFold(false);

			item.active = true;
		} else {
			item.active = false;
		}
	});
	if (e.type == "today") {
		switchDisable.value.left = false;
		switchDisable.value.right = false;
		/**直接调用下级switc 赋值 */
		wSwitchSelect(!SportSortStore.getMenuIsLive);
	} else if (e.type == "morningTrading") {
		switchDisable.value.left = true;
		switchDisable.value.right = false;
		/** 今日 */
		const todayDate = moment(SportsCommon.todayDate()).add(1, "day").format("YYYY-MM-DD");
		/** 今日15天的开始结束 */
		const { startDate, endDate } = SportsCommon.getResultDateRange(todayDate, 15);
		const params = { startDate, endDate };
		SportMorningTradingStore.setTimeInterval(params);

		emit("onType", e);
	} else if (e.type == "champion") {
		switchDisable.value.left = true;
		switchDisable.value.right = true;
		emit("onType", e);
	}
};

/**
 * @description: 数据刷新；
 */
const onRefresh = () => {
	emit("onRefresh");
};
/**
 * @description: 展开收缩控制函数
 */

const onExpandAndCollapse = () => {
	if (isFold.value) {
		//展开
		SportAttentionStore.setIsFold(false);
	} else {
		//收缩
		SportAttentionStore.setIsFold(true);
	}

	pubSub.publish(pubSub.PubSubEvents.SportEvents.onExpandAngCollapse.eventName, !isFold.value);
};
</script>

<style scoped lang="scss">
.heaerMenuCondition-container {
	width: 100%;
	height: 72px;
	// background: rgb(254, 253, 220);
	display: flex;
	align-items: center;

	.left {
		flex: 1;
		height: 100%;
		display: flex;
		align-items: center;
		padding-left: 6px;
		padding-right: 6px;

		:deep() {
			.wbutton {
				margin: 0 6px;
			}

			.btn-container {
				margin: 0 6px;
			}
		}
	}

	.right {
		height: 100%;
		display: flex;
		align-items: center;

		.btnIcon {
			display: flex;
			justify-content: center;

			.icon {
				width: 24px;
				height: 24px;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-left: 27px;

				@include themeify {
					color: themed("icon");
				}

				.iconSvg {
					width: 100%;
					height: 100%;
				}
				.doubleArrowUp_sports {
					width: 100%;
					height: 100%;
					transform: rotate(-180deg);
				}
			}
		}
	}
}
</style>
