<!--
 * @Author: WangMingxin
 * @Description: 体育-早盘-日期-按钮选择器-日期选择区间
-->
<template>
	<div class="dateSelector">
		<div v-show="other" :class="['date_item', activeDate == 'all' && 'active']" @click="changeDate(allTime)">所有日期</div>

		<div :class="['date_item', activeDate == item.date && 'active']" v-for="(item, index) in dateList" :key="index" @click="changeDate(item)">
			<div class="date">{{ item.label }}</div>
			<!-- <div class="date">{{ weekEnum[item.week] }}</div> -->
		</div>
		<div v-show="other" :class="['date_item', activeDate == 'other' && 'active']" :key="0" @click="changeDate(otherTime)">其他</div>
	</div>
</template>

<script setup lang="ts">
/**
 * @description 日期选择器  <DateSelector v-model="modelValue" :daysNumber="12" :other="false" :direction="false" />
 * @description 监听 modelValue	变化 触发对应方法
 * @param {String} modelValue 默认选中日期 v-model="date"
 * @param {Number} daysNumber 显示天数
 * @param {Boolean} other 是否显示其他 其他会将值设置为 空 为空则是其他
 * @param {Boolean} direction 当 direction 为 true 时，它将生成起始日期（modelValue）之后的日期；当 direction 为 false（默认值）时，它将生成起始日期之前的日期。
 * @event update:modelValue 改变日期  v-modal="date"
 */
import moment from "moment";

import { ref, onMounted, computed } from "vue";
import SportsCommon from "/@/views/sports/utils/common";
import { i18n } from "/@/i18n/index";
import { useSportMorningTradingStore } from "/@/stores/modules/sports/sportMorningTrading";

const $: any = i18n.global;
export interface dateActiveType {
	date: string;
	label: string;
	week: string;
}
/**所有时间 */
const allTime = ref({
	date: "all",
	label: "all",
	week: "all",
});
/**其它时间 */
const otherTime = ref({
	date: "other",
	label: "other",
	week: "other",
});

const SportMorningTradingStore = useSportMorningTradingStore();
const weekEnum = {
	1: $.t("sports['星期一']"),
	2: $.t("sports['星期二']"),
	3: $.t("sports['星期三']"),
	4: $.t("sports['星期四']"),
	5: $.t("sports['星期五']"),
	6: $.t("sports['星期六']"),
	0: $.t("sports['星期日']"),
};

const props = withDefaults(
	defineProps<{
		daysNumber: number;
		other: boolean;
		direction: boolean;
	}>(),
	{
		daysNumber: 7,
		other: false,
		direction: false,
	}
);
/** 今日 */
const todayDate = moment(SportsCommon.todayDate()).add(1, "day").format("YYYY-MM-DD");
/** 日期数组 */
const dateList = ref(SportsCommon.generateDateArray(todayDate, props.daysNumber, props.direction));
// const emit = defineEmits(["update:modelValue"]);

const activeDate = computed(() => {
	return SportMorningTradingStore.getActiveDate;
});

/**
 * @description: 改变时间；
 * @param {*} item 选中的对象;
 * @return {*}
 */
const changeDate = (item) => {
	if (item && item?.date) {
		let params: any = {};
		if (item?.date == "all") {
			/** 今日15天的开始结束 */
			const { startDate, endDate } = SportsCommon.getResultDateRange(todayDate, 15);
			params = { startDate, endDate };
		} else if (item?.date == "other") {
			//获取第8天的日期
			const Date8 = moment(todayDate)
				.add(props.daysNumber + 1, "day")
				.format("YYYY-MM-DD");
			const { startDate, endDate } = SportsCommon.getResultDateRange(Date8, 7);
			params = { startDate, endDate };
		} else {
			const { startDate, endDate } = SportsCommon.getResultDateRange(item.date);
			params = { startDate, endDate };
		}
		SportMorningTradingStore.setActiveDate(item.date);
		// const params = { startDate, endDate };
		SportMorningTradingStore.setTimeInterval(params);
	}
};

onMounted(() => {
	console.log("Component mounted");
});
</script>

<style scoped lang="scss">
.dateSelector {
	width: 100%;
	display: flex;
	gap: 24px;
	padding: 24px;
	box-sizing: border-box;
	overflow-x: auto;
	white-space: nowrap;
	-ms-overflow-style: none; /* IE 和 Edge */
	&::-webkit-scrollbar {
		/* WebKit 浏览器，如 Chrome、Safari */
		width: 0; /* 隐藏垂直滚动条 */
		height: 0; /* 隐藏水平滚动条 */
	}
	// scrollbar-width: none;
	.date_item {
		padding: 4px 10px;
		height: 40px;
		border-radius: 16px;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		border: 2px solid var(--Line);
		color: var(--TB);
		.date {
			white-space: nowrap;
			font-size: 22px;
			font-weight: 400;
		}
	}
	.active {
		background-color: var(--Theme);
		color: themed("TB-P");
		border: 0;
	}
}
</style>
