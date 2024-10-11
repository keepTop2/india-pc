<template>
	<div>
		<div class="activityWrapper pb_20">
			<div class="activityHeader">
				{{ activityData.activityNameI18nCode || "每日竞赛" }}
				<span class="closeIcon curp" @click="useModalStore().closeModal"><img src="../../components/image/close_icon.svg" alt="" /></span>
			</div>
			<div class="activityMain">
				<div class="tabs">
					<slide>
						<span v-for="(item, index) in tabList" class="tab" :class="currentTab == index ? 'active' : ''" @click="changeTab(item, index)">
							{{ item.value }}
						</span>
					</slide>
				</div>
				<div class="PrizePool">
					<div>
						<div class="fs_16 Texta fw_300">
							比赛奖池
							<img src="./images/help.png" alt="" class="help curp" @click="openRule" />
						</div>
						<img src="./images/line.png" alt="" class="line" />
						<div class="money">{{ PrizePool }}</div>
					</div>
					<div>
						<img src="./images/Pool.png" alt="" class="Pool" />
					</div>
				</div>
				<div class="card2">
					<div class="countDown">
						<div class="fs_14 Texta">剩余时间</div>
						<countDown v-model="countDownTime" />
					</div>
					<!-- 上届冠军信息 -->
					<div class="championInfo">
						<div>
							<img src="/@/assets/common/userIcon.png" alt="" class="userIcon" />
						</div>
						<div class="winnerInfo">
							<img src="./images/winnerInfoIcon.png" alt="" class="jiaobiao" />
							<span class="fs_14 mb_5 mt_5 color_f1">上届冠军</span>
							<img src="./images/line.png" alt="" class="line mb_5 mt_5" />
							<h3 class="fs_12 Texta">{{ currentData.previous?.userAccount }}</h3>
							<p class="fs_12 Texta">奖金</p>
							<span class="fs_12 flex Texta">
								<span class="color_sussess">{{ currentData.previous?.awardAmount }}</span
								><span></span> ({{ currentData.previous?.activityAmountPer }}%)
							</span>
						</div>
					</div>
				</div>

				<!-- 用户信息 -->
				<div class="userInfo">
					<div class="userInfo_Top pt_20 pb_10">
						<img src="/@/assets/common/userIcon.png" alt="" class="userIcon mr_10" />
						<span class="userName Texta">用户昵称</span>
					</div>
					<div class="userInfo_Bottom">
						<div class="userInfo_Bottom_left">
							<p class="fs_14 Texta mb_5 fw_400">我的位置</p>
							<p class="fw_400 color_f1">{{ currentData.user?.ranking > 100 ? "100+" : currentData.user?.ranking || 0 }}</p>
						</div>
						<img src="./images/line2.png" alt="" style="height: 49px" />
						<div class="userInfo_Bottom_right" style="text-align: center">
							<h3 class="fs_14 Texta mb_5 fw_400">投注金额</h3>
							<span class="color_f1">${{ currentData.user?.betAmount }}</span>
						</div>
					</div>
					<img src="./images/line.png" alt="" class="line" />
					<p class="fs_12 Text2">
						距离上榜还需 <span class="Texta">${{ currentData.user?.lackBetAmount }}</span> 投注金额
					</p>
				</div>

				<div class="table">
					<div class="headearea Texta fs_14">
						<div>
							<span class="today" v-if="currentDay === maxDate">今日</span> <span @click="showDate = true" class="curp">{{ currentDay }}</span>
						</div>
						<div>
							<img src="./images/time_icon.png" alt="" click="showDate = true" />
						</div>
						<div class="date-picker" ref="datePickerRef">
							<v-date-picker @dayclick="dayclick" :min-date="minDate" :max-date="maxDate" v-model="currentDay" v-if="showDate">
								<template #header-title-wrapper>{{ dayjs(currentDay).format("YYYY年MM月") }}</template>
								<template #header-prev-button>
									<svg-icon class="searchIcon" name="arrow_left" size="14px" />
								</template>
								<template #header-next-button>
									<svg-icon class="searchIcon" name="arrow_right" size="14px" />
								</template>
							</v-date-picker>
						</div>
					</div>
					<div class="header">
						<div v-for="(item, index) in columns" :key="index" class="color_TB">
							{{ item.label }}
						</div>
					</div>
					<div class="body">
						<div v-for="(item, index) in tableData" :key="index" class="cell" :class="item.specialShow ? 'active' : ''">
							<div>
								<span class="home_paihang" v-if="index + 1 == 1">
									<img src="./images/no1.png" alt="" />
								</span>
								<span class="home_paihang" v-else-if="index + 1 == 2">
									<img src="./images/no2.png" alt="" />
								</span>
								<span class="home_paihang" v-else-if="index + 1 == 3">
									<img src="./images/no3.png" alt="" />
								</span>
								<span v-else class="color_T1">
									{{ index + 1 }}
								</span>
							</div>
							<div class="color_T1">{{ item.userAccount }}</div>
							<div class="color_TB">{{ item.betAmount }}</div>
							<div class="color_TB">{{ item.awardAmount }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<CommonDialog v-model="showCommonDialog">
			<div class="dialogWrapper">
				<div class="title">
					规则说明
					<span class="closeIcon curp" @click="showCommonDialog = false"><img src="../../components/image/close_icon.svg" alt="" /></span>
				</div>
				<div class="rule">
					<div v-html="currentData?.activityRule"></div>
				</div>
			</div>
		</CommonDialog>
	</div>
</template>

<script setup lang="ts">
import "../../components/common.scss";
import countDown from "./CountDown/CountDown.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { activityApi } from "/@/api/activity";
import { useRouter } from "vue-router";
import { useActivityStore } from "/@/stores/modules/activity";
import { useModalStore } from "/@/stores/modules/modalStore";
import { computed } from "vue";
import Common from "/@/utils/common";
import showToast from "/@/hooks/useToast";
import dayjs from "dayjs";
import { onClickOutside } from "@vueuse/core";
const activityStore = useActivityStore();
const router = useRouter();
const activityData: any = computed(() => activityStore.getCurrentActivityData);
const dialogInfo: any = ref({});
const showCommonDialog = ref(false);
const currentVenueCode = ref(null);

const datePickerRef = ref(null);
const currentTab = ref(0);
const currentData: any = ref({});
const PrizePool = ref(0);
const PrizePoolTimer: any = ref(null);
const countDownTimer: any = ref(null);
const countDownTime = ref(0);
const tableData: any = ref([]);
// 当前日期
const today = dayjs();
const minDate = today.subtract(30, "day").format("YYYY/MM/DD");
const maxDate = today.add(0, "day").format("YYYY/MM/DD");
const currentDay = ref(today.add(0, "day").format("YYYY/MM/DD"));
const columns = [
	{ field: "name", label: "排行" },
	{ field: "userAccount", label: "玩家" },
	{ field: "betAmount", label: "投注金额" },
	{ field: "awardAmount", label: "奖金" },
];
const showDate = ref(false);
// 标签页列表
const tabList: any = ref([]);

const changeTab = (item, index) => {
	currentTab.value = index;
};
const dayclick = (value) => {
	if (value.isDisabled) return;
	currentDay.value = dayjs(value.id).format("YYYY/MM/DD");
	showDate.value = false;
	clearTimeout(PrizePoolTimer.value);
	queryActivityDailyContest();
};
const selectToday = () => {
	currentDay.value = dayjs(maxDate).format("YYYY/MM/DD");
	showDate.value = false;
	clearTimeout(PrizePoolTimer.value);
	queryActivityDailyContest();
};
const queryActivityDailyContestVenueCode = async () => {
	await activityApi.queryActivityDailyContestVenueCode().then((res) => {
		currentVenueCode.value = res.data[0].id;
		tabList.value = res.data.map((item: any, index: any) => {
			return {
				value: item.activityName,
				code: index,
				id: item.id,
			};
		});
	});
};
const queryActivityDailyContest = () => {
	const params = {
		id: currentVenueCode.value,
		day: dayjs(currentDay.value).format("YYYY-MM-DD"),
	};
	activityApi.queryActivityDailyContest(params).then((res) => {
		currentData.value = res.data || [];
	});
	activityApi.queryActivityDailyPrizePool(params).then((res) => {
		PrizePool.value = res.data;
	});
	activityApi.queryActivityDailyRecord(params).then((res) => {
		tableData.value = res.data.list;
	});
	initPrizePool();
};
const initPrizePool = () => {
	clearTimeout(PrizePoolTimer.value);
	PrizePoolTimer.value = setTimeout(async () => {
		const params = {
			id: currentVenueCode.value,
			day: dayjs(currentDay.value).format("YYYY-MM-DD"),
		};
		await activityApi.queryActivityDailyPrizePool(params).then((res) => {
			PrizePool.value = res.data;
		});
		await activityApi.queryActivityDailyRecord(params).then((res) => {
			tableData.value = res.data.list;
		});
		initPrizePool();
	}, 3000);
};
const initCountDownTime = () => {
	countDownTime.value = Math.floor((new Date(new Date().setHours(23, 59, 59, 0)).getTime() - new Date().getTime()) / 1000);
	countDownTimer.value = setInterval(() => {
		if (countDownTime.value > 0) {
			countDownTime.value -= 1;
		} else {
			clearInterval(countDownTimer.value);
		}
	}, 1000);
};
onClickOutside(datePickerRef, () => {
	showDate.value = false;
});
onMounted(async () => {
	await queryActivityDailyContestVenueCode();
	queryActivityDailyContest();
	initCountDownTime();
});
const openRule = () => {
	showCommonDialog.value = true;
};

onBeforeUnmount(() => {
	clearTimeout(PrizePoolTimer.value);
	clearInterval(countDownTimer.value);
});
</script>
<style scoped lang="scss">
.tabs {
	display: flex; /* 使用 flexbox 布局 */
	overflow-x: auto; /* 当内容超出时添加横向滚动条 */
	white-space: nowrap; /* 防止换行 */
	padding: 10px;

	.tab {
		display: inline-block; /* 保证子元素在一行 */
		margin-right: 10px; /* 每个 tab 之间的间距 */
		height: 38px;
		line-height: 38px;
		padding: 0 12px;
		font-size: 14px;
		background-color: var(--Bg3); /* 可选：背景色 */
		text-align: center;
		border-radius: 4px;
		cursor: pointer;
		user-select: none;
		color: var(--Text2);
	}
	.active {
		background-color: var(--Theme); /* 可选：背景色 */
		color: var(--Text_a);
	}
}
.PrizePool {
	display: flex;
	width: 448px;
	height: 100px;
	margin: 30px auto;
	padding: 0 32px;
	align-items: center;
	justify-content: space-between;
	background: url("./images/poolBg.png") no-repeat;
	background-size: 100% 100%;
	.line {
		width: 194px;
	}
	.Pool {
		width: 125px;
		height: 130px;
		margin-top: -30px;
	}
	.money {
		font-family: "DIN Alternate";
		color: var(--F1);
		font-size: 20px;
	}
	.help {
		width: 22px;
		height: 22px;
	}
}
.card2 {
	display: flex;
	padding: 0 20px;
	gap: 16px;
	.countDown {
		width: 50%;
		height: 107px;
		background: url("./images/countDown_bg.png") no-repeat;
		background-size: 100% 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		gap: 14px;
	}
	.championInfo {
		width: 50%;
		height: 107px;
		background: url("./images/championInfo_bg.png") no-repeat;
		background-size: 100% 100%;
		display: flex;
		position: relative;
		div:first-child {
			width: 30%;
			text-align: center;
			align-self: flex-end;
			margin-bottom: 23px;
		}
		div:nth-child(2) {
			padding: 10px 0 10px 10px;
			width: 70%;
			display: flex;
			flex-direction: column;
			justify-content: center;

			.line {
				width: 124px;
			}
		}
		.jiaobiao {
			position: absolute;
			left: -5px;
			top: -5px;
			width: 85px;
		}
	}
}
.userInfo {
	background: url("./images/userInfoBg.png") no-repeat;
	background-size: 100% 100%;
	margin: 20px 20px;
	height: 160px;
	text-align: center;
	.userInfo_Top {
		text-align: center;
	}
	.userInfo_Bottom {
		display: flex;
		justify-content: center;
		gap: 64px;
		img {
			width: 1px;
		}
	}
	.line {
		width: 389px;
		height: 1px;
	}
}
.table {
	background: var(--Bg3);
	margin: 0 20px;
	border-radius: 12px;
	.headearea {
		display: flex;
		padding: 25px 20px 15px;
		justify-content: space-between;
		position: relative;
		flex-wrap: wrap;
		img {
			width: 22px;
			height: 22px;
		}
		.today {
			padding: 6px 10px;
			border-radius: 6px;
			background: var(--Theme);
			margin-right: 10px;
		}
		.date-picker {
			width: 268px;
			position: absolute;
			float: right;
			top: 60px;
			right: 10px;
		}
		:deep(.vc-pane-container) {
			width: 268px;
			border-radius: 8px;
			background: var(--Bg4);
		}
		:deep(.vc-bordered) {
			background: var(--Bg4);
			border: 1px solid var(--Line_2);
			box-shadow: 0px 0px 4px 0px rgba(255, 40, 75, 0.08);
		}
		:deep(.vc-light) {
			color: var(--Text_a);
		}
		:deep(.vc-header.is-lg) {
			font-size: 14px;
			color: var(--Text1);
			font-weight: 500;
		}
		:deep(.vc-header) {
			margin-top: 0;
			border-bottom: 1px solid var(--Line_2);
		}
		:deep(.vc-focus:focus-within) {
			color: var(--Text_a);
			box-shadow: none;
		}
		:deep(.vc-highlight-bg-solid) {
			background: var(--Theme);
			outline: none;
		}
		:deep(.vc-arrow) {
			background: transparent;
		}
		:deep(.vc-day-content.vc-disabled) {
			background: transparent;
			color: #504e4e;
		}
	}
	.header {
		display: flex;
		justify-content: space-around;

		color: var(--Text_s);
		height: 42px;
		line-height: 42px;
		> div {
			width: 25%;
			text-align: center;
		}
	}
	.body {
		.cell {
			display: flex;
			justify-content: space-around;

			height: 42px;
			line-height: 42px;
			color: var(--Text1);
			font-weight: 300;
			> div {
				width: 25%;
				text-align: center;
			}
			img {
				width: 22px;
				height: 22px;
			}
		}
		.active {
			background: url("./images/table_active_bg.png") no-repeat;
			background-size: 100% 100%;
			color: var(--Text_s);
		}
	}
}
.userIcon {
	width: 30px;
	height: 30px;
}
.dialogWrapper {
	width: 448px;

	background: var(--Bg1);
	border-radius: 12px;

	.title {
		height: 54px;
		line-height: 54px;
		padding: 0 20px;
		color: var(--Text_a);
		font-size: 20px;
		border-bottom: 1px solid var(--Line_2);
		display: flex;
		justify-content: space-between;
	}
	.rule {
		min-height: 360px;
		max-height: 618px;
		overflow-y: auto;
		padding: 10px 20px;
		color: var(--Text1);
		font-size: 14px;
	}
	.rule::-webkit-scrollbar {
		width: 6px;
	}
	.rule::-webkit-scrollbar-track {
		background-color: transparent;
	}
	.rule::-webkit-scrollbar-thumb {
		background: var(--Line_2);
		border-radius: 5px;
	}
}
</style>
