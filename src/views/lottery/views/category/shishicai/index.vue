<template>
	<div class="lottery-bet-page lottery-shishicai">
		<!-- 头部 -->
		<LotteryHeader />
		<!-- 分割线 -->
		<div class="line" />

		<div class="tabs">
			<div :class="['tabs-item', tabsActived === item.value ? 'actived' : '']" @click="handleTabChange(item.value)" v-for="item in tabs" :key="item.value">{{ item.label }}</div>
		</div>

		<div class="content">
			<div class="game-play"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useLotteryHeader from "/@/views/lottery/components/LotteryHeader/Index";
const mockData = {
	icon: "https://ctopalistat3.zengchenglm.com/pc/images/db_DB5FC2cea4e2f859029cdbda33fffda6ea1f2.png",
	title: "时时彩",
	desc: "五分钟一期",
	seconds: 100,
	betStatusName: "投注中",
	issuesNo: "20230812-084",
	recentlyAwarded: 5403.23,
};
const { LotteryHeader } = useLotteryHeader({ data: mockData });

const tabs = [
	{
		label: "购买彩票",
		value: 1,
	},
	{
		label: "开奖结果",
		value: 2,
	},
];

const gamePlayConfig = [
	{
		gamePlayName: "总和",
		gamePlayCode: "sum",
		desc: `总和大小：开奖号码之和≥23为“大”，≤22为“小”。\n 总和单双：开奖号码之和的个位数为1、3、5、7、9为“单”，0、2、4、6、8为“双”。`,
		playMethods: [
			{
				title: "大",
				desc: "开奖号码之和≥23为“大”",
				odds: 1.995,
				id: 1,
			},
			{
				title: "小",
				desc: "开奖号码之和≤22为“小”",
				odds: 2.395,
				id: 2,
			},
			{
				title: "单",
				desc: "开奖号码之和≤22为“小”",
				odds: 1.05,
				id: 3,
			},
			{
				title: "双",
				desc: "开奖号码之和的个位数为1、3、5、7、9为“单”",
				odds: 1.995,
				id: 1,
			},
		],
	},
];

const tabsActived = ref(1);
const handleTabChange = (id: number) => {
	tabsActived.value = id;
};
</script>

<style lang="scss" scoped>
.lottery-bet-page {
	width: 1308px;
	margin: 0 auto;
	margin-top: 24px;
	background-color: var(--Bg1);
	border-radius: 12px;
	padding: 20px;
	.line {
		border: 1px solid var(--lineBg);
		margin: 16px 0;
	}
	.tabs {
		display: flex;
		align-items: center;
		column-gap: 4px;
		margin-bottom: 16px;
		&-item {
			width: 96px;
			height: 30px;
			line-height: 30px;
			text-align: center;
			color: var(--Text1);
			font-size: 14px;
			background-color: var(--button);
			border-radius: 4px;
			cursor: pointer;
			&.actived {
				background-color: var(--Bg5);
				color: var(--Text_a);
			}
		}
	}
}
</style>
